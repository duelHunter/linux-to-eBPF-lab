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