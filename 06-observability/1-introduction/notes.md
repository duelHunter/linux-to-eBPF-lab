# Introduction to Observability

Observability is how you find out what a running system is doing, and why it is
doing it, from the data the system produces.

---

## 1. Monitoring vs observability

| | Monitoring | Observability |
|---|-----------|---------------|
| Question | "Is it broken?" | "Why is it broken?" |
| Works for | known failures | unknown failures |
| Example | alert when CPU > 90% | find why only some requests are slow |

Monitoring tells you *that* something is wrong. Observability gives you enough
data to work out *what* and *why*, even for a problem you have never seen.

Quick test: can I explain a new failure without changing the code or adding
new tools first?

---

## 2. The three pillars

```bash
            Your system
                 |
     +-----------+-----------+
     |           |           |
     ▼           ▼           ▼
  Metrics       Logs       Traces
 (numbers)    (events)   (request path)
```

| Pillar | Answers | Example in this lab |
|--------|---------|---------------------|
| Metrics | How much? How often? | CPU %, requests per second |
| Logs | What happened? | `journalctl`, nginx `access.log` |
| Traces | Where did the time go? | one request through nginx -> app |

### Metrics

Numbers measured over time. Cheap to store and good for dashboards and alerts,
but they only show *that* something changed.

### Logs

Timestamped records of events. Detailed, but noisy and hard to search at scale.
You already used these in `01-linux-basics/5-system_logs`.

### Traces

The path of a single request through several components, with the time spent
in each. This is the hardest of the three to set up, and the most useful in
systems with many services.

---

## 3. One incident, three views

Setup from `04-networking/4-reverse_proxy`:

```bash
Client -> nginx (:80) -> Node app (:3000)
```

Problem: users say the site is slow.

| Pillar | What it shows |
|--------|---------------|
| Metrics | response time went up at 14:02 |
| Logs | nginx error log: `upstream timed out` |
| Traces | the extra time is spent inside the app, not in nginx |

No single pillar gives the full answer. Metrics tell you *when*, logs tell you
*what*, and traces tell you *where*.

---

## 4. Where the data comes from

```bash
Application      <- instrumentation (your code, libraries)
     |
Operating system <- /proc, journald, syslog
     |
Kernel           <- scheduler, network stack, syscalls
```

- **Application:** metrics, logs and traces that the code emits itself.
- **Operating system:** files like `/proc/cpuinfo`, `/proc/meminfo` and
  `journalctl`, which are tools you have already used.
- **Kernel:** the most detailed data, but normally hidden from user space.

This last layer is the gap. Application and OS tools cannot see every packet or
syscall. Reading kernel behavior safely, without changing the kernel, is what
**eBPF** is for. It is the end goal of this lab.

---

## 5. What to measure

The four golden signals (from Google SRE):

| Signal | Meaning |
|--------|---------|
| Latency | how long requests take |
| Traffic | how many requests arrive |
| Errors | how many requests fail |
| Saturation | how full the resource is (CPU, memory, disk, queue) |

If you can only watch four things, watch these.

---

## 6. Try it

Quick examples of each pillar with commands you already know:

```bash
# metric-like: one number about one request
curl -s -o /dev/null -w "%{time_total}\n" http://localhost

# log: recent events from a service
journalctl -u nginx -n 5

# system metrics straight from the kernel
cat /proc/loadavg
```

---

## 7. Roadmap for this folder

```bash
1-introduction   <- you are here
2-metrics        what metrics are, types, time series
3-prometheus     collecting and querying metrics
4-grafana        dashboards and alerts
```

Logs and tracing are covered later, and the kernel layer is covered in the
eBPF section.

---

## Notes

1. Observability is not a tool. It is a property of a system: how well you can
   understand it from the outside.
2. You cannot add observability after an outage. The data has to exist before
   the problem happens.
3. Each pillar alone is incomplete. The skill is moving between them: alert
   from a metric, find the cause in logs, locate it with a trace.
