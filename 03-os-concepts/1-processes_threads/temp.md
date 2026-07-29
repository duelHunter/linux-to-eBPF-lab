# Learning Objectives

By the end of this lab, you should be able to answer:

* What is a process?
* What is a thread?
* Why do we need threads?
* How does Linux manage them?
* How can I inspect them?
* How do they relate to system calls and eBPF?

---

# 1. What is a Process?

Learn:

* Definition of a process
* Process lifecycle (New → Ready → Running → Waiting → Terminated)
* Process ID (PID)
* Parent and child processes
* Process resources

### Practice

Commands:

```bash
ps
ps aux
pstree
top
htop
```

Questions:

* What is a PID?
* Why does every process have a unique PID?
* Who is the parent of my Python program?

---

# 2. Process Memory Layout

Understand that every process has its own virtual memory.

Learn these sections:

```text
+----------------------+
| Stack                |
+----------------------+
| Heap                 |
+----------------------+
| Data                 |
+----------------------+
| Text (Program Code)  |
+----------------------+
```

Learn:

* Stack
* Heap
* Code segment
* Data segment

You don't need deep OS theory—just understand what each part stores.

---

# 3. Process States

Learn:

```text
New

Ready

Running

Waiting

Terminated
```

Also Linux states:

```
R Running
S Sleeping
D Uninterruptible Sleep
T Stopped
Z Zombie
```

Practice:

```bash
ps aux
```

Observe the `STAT` column.

---

# 4. Process Creation

Understand:

```text
Parent Process
      |
    fork()
      |
Child Process
```

Linux mainly creates processes using:

* `fork()`
* `exec()`

You don't need to write C code yet—just know the concepts.

---

# 5. What is a Thread?

Learn:

* Definition
* Why threads exist
* Thread ID (TID)
* Main thread
* Worker threads

Understand:

A process can have multiple threads.

Example:

```text
Google Chrome

Process
│
├── Thread 1
├── Thread 2
├── Thread 3
├── Thread 4
└── Thread 5
```

---

# 6. Process vs Thread

This is the most important comparison.

| Process                                              | Thread                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| Independent program                                  | Execution unit inside a process                                           |
| Own memory                                           | Shares process memory                                                     |
| Own PID                                              | Has its own TID (and is associated with the process)                      |
| More expensive to create                             | Lightweight                                                               |
| Communication is slower                              | Communication is easier through shared memory                             |
| Crash usually doesn't directly crash other processes | A crashing thread can terminate the whole process if not handled properly |

Be able to explain **why threads are faster than processes**.

---

# 7. Multithreading in Python

Create:

```python
import threading
```

Spawn:

* 2 threads
* 5 threads
* 10 threads

Observe:

```bash
top -H
```

See how Linux displays them.

---

# 8. Multiprocessing in Python

Create:

```python
import multiprocessing
```

Spawn:

* 2 processes
* 5 processes

Observe:

```bash
ps aux
```

Notice that each process has a different PID.

---

# 9. Compare Processes and Threads

Write one program using:

```python
threading
```

Another using:

```python
multiprocessing
```

Compare:

* CPU usage
* Memory usage
* Number of PIDs
* Number of threads

---

# 10. Context Switching

Learn:

What happens when CPU changes from:

```text
Process A

↓

Process B

↓

Process C
```

Learn:

* Scheduler
* Context switch
* Why switching processes is more expensive than switching threads

---

# 11. Inter-Process Communication (IPC)

Learn the purpose of:

* Pipes
* Shared memory
* Message queues
* Sockets

No need to master every mechanism—just understand why separate processes need IPC.

---

# 12. Synchronization

Learn:

* Race condition
* Mutex
* Semaphore
* Deadlock

Write a simple Python example where two threads update the same variable to see why synchronization matters.

---

# 13. Observe Processes in Linux

Use:

```bash
ps
top
htop
pstree
pidof
pgrep
kill
killall
```

Know what each command is for.

---

# 14. Observe Threads

Commands:

```bash
ps -T
top -H
```

See:

* Number of threads
* Thread IDs
* CPU usage

---

# 15. Connection to eBPF

This is why you're learning all of this.

Later, you'll use eBPF to answer questions like:

* Which process opened this file?
* Which thread is using 100% CPU?
* Which process created this network connection?
* Which process made this system call?
* Which process allocated so much memory?

Without understanding processes and threads, these eBPF traces won't make much sense.

---

# Folder Structure

I recommend organizing this section like this:

```text
02-os-concepts/
│
├── 01-what-is-a-process/
├── 02-process-memory/
├── 03-process-lifecycle/
├── 04-process-creation/
├── 05-what-is-a-thread/
├── 06-process-vs-thread/
├── 07-multithreading-python/
├── 08-multiprocessing-python/
├── 09-context-switching/
├── 10-ipc/
├── 11-synchronization/
├── 12-linux-process-tools/
└── 13-ebpf-connection/
```

This progression mirrors how operating systems build up these concepts, and it naturally prepares you for later topics like system calls, containers, Kubernetes, and eBPF.
