# Learning Objectives

By the end of this lab, you should be able to answer:

- What is a process?
- What is a thread?
- Why do we need threads?
- How does Linux manage them?
- How can I inspect them?
- How do they relate to system calls and eBPF?


1. What is a process?

    Process is a program that is currently being executed by the OS.

2. What is Process lifecycle?

    Process does not simply start and stop. It has several steps during its lifecycle.

```bash
       New
        │
        ▼
      Ready
        │
        ▼
     Running
        │
        ├─────────────┐
        ▼             │
     Waiting          │
        │             │
        └──────► Ready│
                      │
                      ▼
                 Terminated
```

You can display the information about all running processes using,
```bash
    ps
```
Unlike `top`, `ps` takes a snapshot of the processes in the moment.

***
```bash
    ps aux
```
Shows all running processes on the system with detailed information.
This is one of the most commonly used commands by Linux administrators.

***
```bash
    pstree
```
This command displays running processes in a tree structure,showing parent-child relationships.
Instead of getting a list of processes, you can see which processes started others.

Example:
```bash
systemd
├── NetworkManager
├── sshd
│    └── bash
│         └── python
└── chrome
     ├── chrome
     ├── chrome
     └── chrome
```

Why is this useful?
Suppose you run: `python app.py`

The process hierarchy looks like:
```bash
Terminal
    │
    └── Python
```

You can identify:
- Parent process
- Child process
- Process hierarchy

***

```bash
    top
```
This shows all the running  processes in live and contineously updating view.
Unlike ps, top refreshes automatically every few seconds.

### Information at the Top

top also shows system-wide statistics, such as:
```bash
Tasks: 235 total
CPU: 18%
Memory: 42%
Swap: 0%
```

This tells you:

- Number of running tasks
- CPU usage
- Memory usage
- Swap usage
- System uptime
- Load average

Here are the useful keyboard shortcuts,

| Key | Action               |
| --- | -------------------- |
| `q` | Quit                 |
| `P` | Sort by CPU usage    |
| `M` | Sort by memory usage |
| `k` | Kill a process       |
| `h` | Help                 |


***

```bash
htop
```
htop is an improved, interactive version of top.
