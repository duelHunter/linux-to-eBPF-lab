Run:

tell Linux to pause the current process for 1000 seconds
```bash
sleep 1000
```

In another terminal:

```bash
ps aux
top
htop
kill
kill -9
```

Find the PID:

```bash
ps aux | grep sleep
pgrep sleep
```

Kill the process:

```bash
kill <PID>       # sends SIGTERM (15) - polite request to stop
kill -9 <PID>    # sends SIGKILL (9) - force kill, cannot be ignored
```

## Document

### PID
- PID = Process ID, a unique number the kernel assigns to every running process.
- `ps aux` and `pgrep <name>` are the easiest ways to find it.
- PPID (parent PID) shows which process spawned it.

### Process state
Seen in the `STAT` column of `ps aux` / `top`:

| Code | Meaning |
|------|---------|
| R | Running or runnable (on run queue) |
| S | Sleeping (waiting for an event, interruptible) |
| D | Uninterruptible sleep (usually waiting on I/O) |
| T | Stopped (e.g. via `Ctrl+Z` or `SIGSTOP`) |
| Z | Zombie (finished but not yet reaped by parent) |

`sleep 1000` shows up as `S` since it's idle, waiting for its timer.

### Signal handling
- Signals are how processes are told to do something (terminate, pause, reload config, etc.).
- `kill` doesn't always kill — it just sends a signal (default is `SIGTERM`, 15).
- Common signals:
  - `SIGTERM (15)` - ask the process to terminate gracefully; can be caught/handled.
  - `SIGKILL (9)` - force-terminate immediately; cannot be caught, blocked, or ignored (kernel does it directly).
  - `SIGSTOP` / `SIGCONT` - pause and resume a process.
- Prefer `SIGTERM` first so the process can clean up (close files, save state); only use `-9` if it doesn't respond.