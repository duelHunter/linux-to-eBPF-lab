# Linux → eBPF Systems Learning Lab

This repository is my hands-on learning journey from Linux fundamentals to
advanced kernel observability using eBPF.

The goal is not just theory, but **practical understanding through
experiments, scripts, debugging, and real-world projects**.

---

## 🎯 Objective

To understand how modern computing systems work internally:

- Linux operating system internals
- Shell and system administration
- Process and memory behavior
- Networking fundamentals
- Container systems (Docker)
- Observability (metrics, logs, traces)
- Kernel-level tracing using eBPF

---

# 🧭 Learning Roadmap

## 1. Linux Fundamentals

**Goal:** Build strong Linux foundations.

Topics:

- Linux filesystem hierarchy
- File system navigation
- File permissions
- Users and groups
- Package management
- Environment variables
- Process management
- Service management
- System logs

Commands:

- `ls`
- `cd`
- `pwd`
- `find`
- `chmod`
- `chown`
- `ps`
- `systemctl`
- `journalctl`

📁 Folder: `01-linux-basics`

---

## 2. Shell & System Administration

**Goal:** Understand how users interact with Linux systems.

Topics:

- Bash fundamentals
- Shell vs terminal
- Shell builtins vs external commands
- Command execution flow
- PATH and command lookup
- Aliases and functions
- Bash scripting
- SSH
- Cron jobs
- User management

Commands:

- `type`
- `which`
- `export`
- `alias`
- `ssh`
- `crontab`

📁 Folder: `02-shell-admin`

---

## 3. Operating System Concepts

**Goal:** Understand what happens underneath Linux commands.

Topics:

- Processes vs threads
- Process lifecycle
- Fork and exec
- System calls
- CPU scheduling
- Memory management
- Virtual memory
- File descriptors
- Signals

Tools:

- `strace`
- `lsof`
- `vmstat`
- `free`

📁 Folder: `03-os-concepts`

---

## 4. Networking Fundamentals

**Goal:** Understand communication between systems.

Topics:

- TCP/IP model
- OSI model
- IP addressing
- Routing basics
- DNS resolution
- HTTP/HTTPS
- TCP handshake
- UDP
- Socket programming

Tools:

- `ip`
- `ss`
- `netstat`
- `ping`
- `curl`
- `dig`
- `tcpdump`

📁 Folder: `04-networking`

---

## 5. Docker & Containers

**Goal:** Understand how modern applications are packaged and executed.

Topics:

- Container fundamentals
- Docker images
- Image layers
- Container lifecycle
- Namespaces
- cgroups
- Container networking
- Container monitoring
- Container security basics

Tools:

- Docker
- containerd
- runc

📁 Folder: `05-containers`

---

## 6. Observability Engineering

**Goal:** Learn how production systems are monitored and debugged.

Topics:

### Metrics

- Metrics concepts
- Time-series databases
- Prometheus architecture
- Exporters
- Alerting rules

### Logging

- Linux logs
- Application logs
- Log collection strategies

### Tracing

- Distributed tracing
- Request lifecycle analysis
- OpenTelemetry basics

Tools:

- Prometheus
- Grafana
- Loki
- OpenTelemetry

📁 Folder: `06-observability`

---

## 7. eBPF & Kernel Observability

**Goal:** Understand and observe Linux kernel behavior.

Topics:

### eBPF Fundamentals

- What is eBPF?
- eBPF architecture
- eBPF programs
- eBPF maps
- eBPF verifier
- Kernel hooks


### Kernel Tracing

- System call tracing
- Process monitoring
- File access tracing
- Performance analysis


### Network Observability

- Packet monitoring
- XDP basics
- Network performance analysis


Tools:

- bpftrace
- BCC (BPF Compiler Collection)
- Cilium
- Falco

📁 Folder: `07-ebpf`

---

# 🧪 Projects

Practical projects to combine concepts:

## Process Monitor

Build a Linux process monitoring tool.

Concepts:

- `/proc` filesystem
- Process statistics
- CPU and memory usage


---

## Network Analyzer

Analyze network behavior.

Concepts:

- TCP connections
- Packet inspection
- Socket programming


---

## Container Monitoring System

Monitor Docker containers.

Track:

- CPU usage
- Memory usage
- Network activity


---

## eBPF System Tracer

Create kernel-level monitoring tools.

Observe:

- Process creation
- System calls
- File operations
- Network events


📁 Folder: `08-projects`

---

# 🧪 Project Style

Each folder contains:

- Small experiments
- Code snippets (Python / Bash)
- Configuration files
- Notes and explanations
- Command outputs
- Debugging examples
- Key learnings

---

# 🛠 Tools Used

- Linux (Ubuntu recommended)
- Bash
- Python
- Docker
- Git
- bpftrace
- BCC tools
- Prometheus
- Grafana
- OpenTelemetry

---

# 📌 Learning Goals

By the end of this repository, I should be able to:

- Understand Linux internals
- Explain how commands execute
- Debug Linux systems
- Analyze processes and memory behavior
- Understand container internals
- Build observability solutions
- Monitor applications without modifying their code
- Use eBPF for kernel-level tracing
- Diagnose performance problems in production systems

---

# 🚀 Status

Currently in progress.

Learning by building, experimenting, and documenting.

---