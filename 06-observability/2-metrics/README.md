# Metrics

A metric is a number that describes the state of a system, measured repeatedly
over time.

```bash
cpu_usage = 37%        <- one value
cpu_usage = 37%, 41%, 90%, 88% ...   <- the same value over time (a metric)
```

---

## 1. Anatomy of a metric

One data point has four parts:

```bash
http_requests_total{method="GET", path="/", status="200"}  1027   @ 14:02:10
└────────┬────────┘ └──────────────┬──────────────────┘  └─┬─┘   └───┬───┘
       name                     labels                  value    timestamp
```

| Part | Meaning |
|------|---------|
| Name | what is measured |
| Labels | key/value pairs that split it into dimensions |
| Value | the number |
| Timestamp | when it was sampled |

### Time series

One name plus one exact set of labels is one **time series**:

```bash
http_requests_total{status="200"}  ->  (14:00, 900) (14:01, 950) (14:02, 1027)
http_requests_total{status="500"}  ->  (14:00,   2) (14:01,   2) (14:02,   40)
```

Different label values make different series. A time series database (TSDB)
stores these as `(timestamp, value)` pairs, which is why Prometheus (next
section) is built around them.

---

## 2. Metric types

| Type | Behavior | Example |
|------|----------|---------|
| Counter | only goes up (resets on restart) | requests served, errors, bytes sent |
| Gauge | goes up and down | memory used, queue length, temperature |
| Histogram | counts values in buckets | request duration, response size |

### Counter

```bash
requests_total:   100 -> 130 -> 170 -> 0 (restart) -> 20
```

The raw value is rarely useful. What matters is the **rate of change**:
requests per second = (new - old) / seconds. The reset is handled when you
calculate the rate.

### Gauge

A snapshot of the current value. Read it directly.

```bash
memory_used_bytes:   2.1G -> 2.4G -> 1.9G
```

### Histogram

Instead of storing every request time, count how many fell in each bucket:

```bash
request_duration_seconds_bucket{le="0.1"}   800    <- 800 requests <= 100ms
request_duration_seconds_bucket{le="0.5"}   950    <- 950 requests <= 500ms
request_duration_seconds_bucket{le="1"}     990
request_duration_seconds_bucket{le="+Inf"} 1000    <- all requests
```

Buckets are cumulative. From these you can estimate percentiles, such as p95
or p99.

### Why not just use the average?

```bash
99 requests take 10 ms, 1 request takes 5 s
average = ~60 ms   <- looks fine
p99     = 5 s      <- 1 in 100 users is waiting 5 seconds
```

The average hides slow requests. Look at percentiles (p50, p95, p99) for
latency.

---

## 3. Where metrics come from on Linux

You already have metric sources on every machine:

```bash
cat /proc/loadavg        # load average (gauge)
cat /proc/meminfo        # memory (gauges)
cat /proc/net/dev        # bytes and packets per interface (counters)
cat /proc/stat           # CPU time since boot (counters)
```

Look at the counter behavior yourself:

```bash
cat /proc/net/dev | grep -E 'eth0|lo'
curl -s http://localhost > /dev/null
cat /proc/net/dev | grep -E 'eth0|lo'
```

The byte and packet counts only ever go up. That is a counter.

Tools such as `top`, `free`, `vmstat` and `iostat` just read these files and
show them as numbers.

---

## 4. Metrics from your own application

An application can expose its own metrics, usually as plain text on an HTTP
endpoint such as `/metrics`:

```bash
curl http://localhost:3000/metrics
```

```bash
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/"} 42
```

This text format is what Prometheus reads (next section). For the Node app in
`server/`, the `prom-client` package can generate it:

```bash
npm install prom-client
```

Do this as the exercise in the Prometheus section.

---

## 5. Collecting metrics: pull vs push

```bash
Pull:   collector --asks--> app:/metrics        (Prometheus)
Push:   app --sends--> collector                (StatsD, Pushgateway)
```

| Model | Good for | Downside |
|-------|----------|----------|
| Pull | long-running services, easy to see if a target is down | short jobs may finish before being scraped |
| Push | short-lived jobs, firewalled apps | harder to tell "no data" from "down" |

The collector samples at a fixed **scrape interval**, usually 15 to 60
seconds. A spike shorter than the interval can be missed.

---

## 6. Common pitfalls

### High cardinality

Every unique label combination creates a new series.

```bash
# fine: few values
http_requests_total{status="200"}

# bad: unbounded values
http_requests_total{user_id="83921"}
http_requests_total{path="/orders/123456"}
```

With millions of users that is millions of series, which fills memory and
slows queries. Use labels with a small, fixed set of values.

### Counters read as gauges

Graphing a raw counter gives a line that only climbs. Convert it with a rate.

### Missing units

Put the unit in the name: `_seconds`, `_bytes`, `_total`. Prefer base units
(seconds, not milliseconds).

---

## 7. What to measure first

Link back to the four golden signals from the introduction:

| Signal | Metric example | Type |
|--------|----------------|------|
| Latency | `request_duration_seconds` | histogram |
| Traffic | `http_requests_total` | counter |
| Errors | `http_requests_total{status=~"5.."}` | counter |
| Saturation | `memory_used_bytes`, `queue_length` | gauge |

---

## Notes

1. A metric is cheap because it is aggregated: you keep a count, not every
   event. The cost of that is lost detail, which is where logs and traces help.
2. Counters need a rate, gauges need to be read directly, histograms need
   percentile calculation.
3. Metrics tell you *when* and *how much*. They rarely tell you *why*.
4. Next: Prometheus stores and queries these time series.
