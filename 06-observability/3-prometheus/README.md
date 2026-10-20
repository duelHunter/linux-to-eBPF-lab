# Prometheus

Prometheus is a system that collects metrics, stores them as time series, and
lets you query and alert on them.

It does not draw nice dashboards (that is Grafana, next section). It is the
database and the query engine.

---

## 1. How it works

```bash
+-----------+   /metrics    +----------------+        +--------------+
| Node app  | <---scrape--- |                | -----> | Alertmanager |
+-----------+               |   Prometheus   |        +--------------+
| node      | <---scrape--- |  (scrape +     |
| exporter  |               |   TSDB +       | <----- Grafana / PromQL
+-----------+               |   PromQL)      |        (queries)
                            +----------------+
```

1. **Scrape:** every few seconds Prometheus sends `GET /metrics` to each
   target (this is the **pull** model from the metrics section).
2. **Store:** it saves the samples in its local time series database (TSDB).
3. **Query:** you ask questions with **PromQL**, in the web UI or from Grafana.
4. **Alert:** rules are evaluated regularly, and firing alerts are sent to
   Alertmanager, which sends emails, Slack messages and so on.

Main terms:

| Term | Meaning |
|------|---------|
| Target | one endpoint to scrape (`localhost:8000`) |
| Job | a group of targets with the same purpose (`node-app`) |
| Scrape interval | how often to collect (15s is common) |
| Exporter | a helper that exposes metrics for something that has no `/metrics` |

---

## 2. Install and run

### Option A: Docker

```bash
docker run -d --name prometheus --network host \
  -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

`--network host` lets the container reach `localhost:8000` on your machine
(Linux only).

### Option B: Linux package

```bash
sudo apt install prometheus
sudo systemctl status prometheus
```

The config is then `/etc/prometheus/prometheus.yml`. Package versions can be
old, so Docker or the official binary from prometheus.io is often better.

Open the web UI at `http://localhost:9090`.

---

## 3. Configure the scrape targets

`prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: prometheus          # Prometheus monitors itself
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: node-app            # the app in server/
    static_configs:
      - targets: ["localhost:8000"]
```

Notes:

- `/metrics` is the default path. Change it with `metrics_path` if needed.
- Check the file before using it:

```bash
promtool check config prometheus.yml
```

### Check that it works

1. Start the app: `node server.js` (in `server/`).
2. In the UI open **Status -> Targets**. Both targets should be `UP`.
3. If a target is `DOWN`, the error is shown next to it. Then try the same
   endpoint by hand:

```bash
curl http://localhost:8000/metrics
```

If `curl` works, the problem is in the Prometheus config. If `curl` fails, the
problem is the app or the port.

---

## 4. The `up` metric

For every target Prometheus creates a metric by itself:

```bash
up{job="node-app", instance="localhost:8000"}  1    <- scrape worked
up{job="node-app", instance="localhost:8000"}  0    <- scrape failed
```

It is the simplest health check, and the basis of the most common alert.

---

## 5. PromQL basics

Type these in the **Graph** tab of the UI. Generate some traffic first:

```bash
for i in $(seq 1 50); do curl -s localhost:8000/server > /dev/null; done
```

### Selecting series

```bash
http_requests_total                                  # all series
http_requests_total{path="/server"}                  # filter by label
http_requests_total{statusCode=~"5.."}               # regex match
```

### Counters need `rate`

A raw counter only climbs. `rate` gives the per-second increase over a window:

```bash
rate(http_requests_total[1m])        # requests per second, per series
```

The window (`[1m]`) must contain at least two samples, so use at least 2 to 4
times the scrape interval.

### Aggregation

```bash
sum(rate(http_requests_total[1m]))                       # total req/s
sum by (path) (rate(http_requests_total[1m]))            # req/s per path
sum by (statusCode) (rate(http_requests_total[1m]))      # per status
```

### Error ratio (golden signal: errors)

```bash
sum(rate(http_requests_total{statusCode=~"5.."}[5m]))
  /
sum(rate(http_requests_total[5m]))
```

### Gauges are read directly

```bash
process_resident_memory_bytes            # memory used by the app
nodejs_eventloop_lag_seconds             # event loop delay
```

These come from `collectDefaultMetrics()` in `server.js`.

### Latency needs a histogram

```bash
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
```

This works only after you add the histogram from the metrics section to the
app. The app has just a counter now, so there is no latency metric yet.

### Instant vs range

| Type | Example | Result |
|------|---------|--------|
| Instant vector | `http_requests_total` | latest value of each series |
| Range vector | `http_requests_total[5m]` | the last 5 minutes of samples |

Functions such as `rate` take a range vector and return an instant vector.

---

## 6. Exporters

Many things do not have a `/metrics` endpoint: the Linux host, nginx, a
database. An exporter reads their data and exposes it in Prometheus format.

| Exporter | Port | Exposes |
|----------|------|---------|
| node_exporter | 9100 | CPU, memory, disk, network of the host |
| nginx-prometheus-exporter | 9113 | nginx connections and requests |
| cAdvisor | 8080 | per-container CPU and memory |

node_exporter reads the same `/proc` files you used in the metrics section:

```bash
sudo apt install prometheus-node-exporter
curl -s localhost:9100/metrics | grep node_load1
cat /proc/loadavg
```

The `node_load1` value matches the first number in `/proc/loadavg`. Add it to
`prometheus.yml`:

```yaml
  - job_name: node
    static_configs:
      - targets: ["localhost:9100"]
```

Useful queries:

```bash
node_load1                                              # load average
node_memory_MemAvailable_bytes                          # free memory
rate(node_network_receive_bytes_total[1m])              # network in, bytes/s
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)   # CPU %
```

---

## 7. Alerting rules

An alert is a PromQL expression that, when true for some time, fires.

`alerts.yml`:

```yaml
groups:
  - name: app
    rules:
      - alert: AppDown
        expr: up{job="node-app"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.instance }} is down"

      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{statusCode=~"5.."}[5m]))
            / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: warning
```

Load it in `prometheus.yml`:

```yaml
rule_files:
  - alerts.yml
```

Then:

```bash
promtool check rules alerts.yml
```

See the state in the UI under **Alerts**:

| State | Meaning |
|-------|---------|
| inactive | condition is false |
| pending | condition is true, waiting out the `for` time |
| firing | true for long enough, sent to Alertmanager |

Try it: stop the Node app and wait about a minute. `AppDown` should go
pending, then firing.

Prometheus only evaluates the rules. Alertmanager is what groups alerts and
delivers them (email, Slack, PagerDuty). It is a separate program, so it is
not set up here.

---

## 8. Storage

- Data is stored locally on disk in blocks (the TSDB).
- Default retention is 15 days. Change it with
  `--storage.tsdb.retention.time=30d`.
- Rough size: number of series x samples per second x about 1 to 2 bytes per
  sample. More series (high cardinality) means more memory and disk.

Check how many series you have:

```bash
count({__name__=~".+"})
```

Prometheus is not for long-term storage or for events. It keeps numbers.

---

## 9. Common problems

| Problem | Likely cause |
|---------|--------------|
| Target `DOWN`, "connection refused" | app not running, wrong port |
| Target `DOWN` only in Docker | `localhost` inside a container is the container, use `--network host` or the host IP |
| Metric missing in the UI | not scraped yet, or label/name typo |
| `rate()` returns nothing | range shorter than 2 scrapes, or no traffic |
| Config change has no effect | Prometheus must reload the config |

Reload the config without a restart:

```bash
sudo systemctl reload prometheus       # package install (sends SIGHUP)
# or start Prometheus with --web.enable-lifecycle, then:
curl -X POST http://localhost:9090/-/reload
```

---

## Notes

1. Prometheus pulls. The app only has to expose `/metrics`, and does not know
   Prometheus exists.
2. Every query result is built from the raw counters and gauges you saw in
   the metrics section, so the cleaner those are, the better the answers.
3. Alert on symptoms (errors, latency, `up == 0`), not on every cause.
4. Next: Grafana draws these queries as dashboards.
