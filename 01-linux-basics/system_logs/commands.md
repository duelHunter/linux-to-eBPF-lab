```bash
journalctl                 # systemd journal
journalctl -u <service>    # logs for one service
journalctl -f              # follow, like tail -f
journalctl --since "10 min ago"
tail -f /var/log/syslog # or /var/log/messages
dmesg                   # kernel ring buffer
dmesg -T                # with human-readable timestamps
```

### Notes

1. What is systemd?
systemd is the manager in linux systems that starts, stops, monitors and controls processes and services.


```bash
Power On
   |
   ▼
BIOS / UEFI
   |
   ▼
Bootloader (GRUB)
   |
   ▼
Linux Kernel
   |
   ▼
systemd (PID 1)
   |
   ▼
Services start
   |
   ├── SSH server
   ├── Network manager
   ├── Docker
   ├── Database
   └── Web server

```   


