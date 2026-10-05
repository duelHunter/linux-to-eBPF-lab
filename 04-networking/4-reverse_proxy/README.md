# Reverse Proxy & API Gateway (nginx)

A **reverse proxy** is a server that sits in front of your application.
Clients talk to the proxy, and the proxy talks to the app.

```bash
Client
   |
   ▼
nginx (port 80/443)       <- the only thing exposed to the outside
   |
   ▼
App server (port 3000)    <- hidden, listens on localhost only
```

Compare with a **forward proxy**, which sits in front of the *clients*
(e.g. a company proxy that your browser uses to reach the internet).

| Type | Sits in front of | Client knows about it? |
|------|------------------|------------------------|
| Forward proxy | clients | yes |
| Reverse proxy | servers | no |

## Reverse proxy vs load balancer vs API gateway

These overlap a lot. nginx can act as all three.

| Role | Main job |
|------|----------|
| Reverse proxy | forward requests to a backend, hide it |
| Load balancer | spread requests over several backends |
| API gateway | reverse proxy + auth, API keys, rate limiting, routing |

Dedicated gateways (Kong, Envoy, Traefik, AWS API Gateway) add
application-level features on top. In this lab we only care about the Linux
and networking side, so nginx is enough.

---

## 1. Install and run nginx

```bash
sudo apt install nginx
sudo systemctl status nginx
curl -I http://localhost          # default welcome page
```

Useful files:

```bash
/etc/nginx/nginx.conf             # main config
/etc/nginx/conf.d/*.conf          # extra configs
/etc/nginx/sites-enabled/         # Debian/Ubuntu style
/var/log/nginx/access.log         # one line per request
/var/log/nginx/error.log          # problems
```

Always test the config before reloading:

```bash
sudo nginx -t                     # syntax check
sudo systemctl reload nginx       # apply without dropping connections
```

---

## 2. Proxy to the app

Start the Node app from the `server/` folder (it listens on port 3000):

```bash
cd server
node server.js
```

Create `/etc/nginx/conf.d/app.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
curl http://localhost             # port 80 -> nginx -> port 3000
```

You should see `Hello World!` and the Node console prints `Received request`.

### Why the headers?

The app only sees nginx as the client (`127.0.0.1`). The `X-Forwarded-*`
headers pass along the real client IP and the original protocol.

---

## 3. Path based routing (gateway style)

One public port, several backends:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
}

location /static/ {
    root /var/www;
}
```

Note the trailing `/` in `proxy_pass`. With it, `/api/users` is sent to the
backend as `/users`. Without it, the backend gets `/api/users`.

---

## 4. Load balancing

```nginx
upstream backend {
    # default is round robin
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002 backup;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

Other strategies: `least_conn;`, `ip_hash;`, weights (`server ... weight=3;`).

Try it: run the app on two ports and watch which one logs each request.

```bash
PORT=3001 node server.js
```

(`server.js` has the port hard-coded to 3000 right now. Change it to
`process.env.PORT || 3000` for this experiment.)

---

## 5. TLS termination

nginx handles HTTPS, the backend speaks plain HTTP:

```nginx
server {
    listen 443 ssl;
    ssl_certificate     /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

Self signed cert for practice:

```bash
sudo mkdir -p /etc/nginx/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/certs/key.pem -out /etc/nginx/certs/cert.pem \
  -subj "/CN=localhost"
curl -k https://localhost
```

---

## 6. Rate limiting

```nginx
# in the http {} block
limit_req_zone $binary_remote_addr zone=perip:10m rate=5r/s;

# in the location block
limit_req zone=perip burst=10 nodelay;
```

Test it:

```bash
for i in $(seq 1 30); do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost
done
```

Requests over the limit get `503`.

---

## 7. Look at it from the Linux side

This is the part that connects to the rest of the lab.

```bash
sudo ss -tlnp | grep -E 'nginx|node'
```

Expected: nginx listening on `:80`, node on `:3000`.

```bash
ps aux | grep nginx
```

You will see one **master** process (root, reads config, binds the port) and
several **worker** processes (handle the connections).

```bash
sudo ss -tnp | grep -E ':80|:3000'
```

One client request makes **two** TCP connections: client -> nginx, and
nginx -> app.

```bash
curl -v http://localhost
sudo tcpdump -i lo -nn port 80 or port 3000
tail -f /var/log/nginx/access.log
```

In `tcpdump` you see both hops on the loopback interface, with the
`X-Forwarded-*` headers on the second one.

### Common errors

| Status | Meaning | Check |
|--------|---------|-------|
| 502 Bad Gateway | nginx can't reach the app | is the app running? `ss -tlnp` |
| 504 Gateway Timeout | app too slow | `proxy_read_timeout`, app logs |
| 404 | no matching `location` | `nginx -T` to dump the config |

---

## Notes

1. nginx uses an event loop (epoll) in each worker, so a few workers handle
   thousands of connections. This is a good thing to trace with eBPF later.
2. The extra hop adds latency. In `06-observability` we can measure it with
   `bpftrace` on `accept` and `connect` syscalls.
3. In `05-containers` the same setup becomes two containers on one Docker
   network, with nginx using the container name instead of `127.0.0.1`.
