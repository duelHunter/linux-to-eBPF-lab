Run:

```bash
ip a              # or ifconfig - view interfaces & IPs
ip route          # or route -n - routing table
ping google.com   # connectivity + latency
curl -I https://example.com   # HTTP headers
ss -tulnp         # or netstat -tulnp - listening ports/sockets
dig google.com    # or nslookup - DNS resolution
traceroute google.com   # or tracepath - hop-by-hop path
wget <url>
```

## Document

### `ip a` (or `ifconfig`)
- Lists network interfaces (`lo`, `eth0`, `wlan0`, ...) and the IP address bound to each.
```bash
lahiru@DuelHunter:/mnt/d/linux-to-eBPF-lab$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet 10.255.255.254/32 brd 10.255.255.254 scope global lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:15:5d:8d:33:51 brd ff:ff:ff:ff:ff:ff
    inet 172.27.137.201/20 brd 172.27.143.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::215:5dff:fe8d:3351/64 scope link 
       valid_lft forever preferred_lft forever
```

- `inet` = IPv4 address, `inet6` = IPv6 address.
- `lo` is the loopback interface (`127.0.0.1`), always present, used for local-only traffic.



### `ip route` (or `route -n`)
- Shows the routing table: which gateway/interface traffic goes out through for a given destination.
- `default via <gateway>` is the route used when no more specific route matches (your internet gateway).

### `ping google.com`
- Sends ICMP echo requests and measures round-trip time.
- Confirms basic reachability at the network layer; doesn't test ports or higher-level protocols.
- `time=` in the output is latency in ms; packet loss % shows link reliability.

### `curl -I https://example.com`
- Sends an HTTP request but only fetches the response **headers** (`-I` = HEAD request).
- Confirms the server is up and shows status code, content type, server software, etc., without downloading the body.

### `ss -tulnp` (or `netstat -tulnp`)
- Lists listening sockets: `-t` TCP, `-u` UDP, `-l` listening only, `-n` numeric (no DNS lookups), `-p` show owning process.
- Each row = a `(protocol, local address:port, PID/program)` combination — useful to see what's bound to a port before starting a service.

### `dig google.com` (or `nslookup`)
- Queries DNS and shows the resolution result: query section, answer section (A/AAAA records), and TTL.
- `dig` is more verbose/scriptable; `nslookup` is simpler/older.

### `traceroute google.com` (or `tracepath`)
- Shows the hop-by-hop path packets take to reach a destination, with round-trip time per hop.
- Works by sending packets with increasing TTL and recording which router replies at each TTL — useful for spotting where latency or packet loss is introduced.

### `wget <url>`
- Downloads a file/page over HTTP(S) or FTP directly to disk.
- Unlike `curl`, defaults to saving output to a file rather than printing to stdout.

## Notes
1. What is a Loopback interface?
Loopback interface is a virtual network interface that allows your computer to communicate with  itself. Now imagine you are taking with yourself. That massage never leaves you. That's exactly loopback interface does.

2. Why does Linix has loopback interface?
Many programs need to communicate with other programs running on the same computer.
Instead of sending packets out to the network and back in, Linux provides a virtual interface called lo.
```bash
Application A
      │
      │
127.0.0.1
      │
      │
Application B
```
Everything stays inside the operating system.