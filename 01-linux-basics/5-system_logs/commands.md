# System Log Commands

Journalctl displays logs collected by systemd-journald, the logging service used by most modern Linux distributions (Ubuntu, Debian, Fedora, etc.)
   ```bash
   journalctl 
   ```

You'll see everything:

- system startup
- services
- SSH logins
- Docker
- kernel messages
- application logs (if they use systemd)

If you want to get logs related to a specific service,
```bash
journalctl -u <service>    # logs for one service
```



```bash
journalctl -f              # follow, like tail -f
journalctl --since "10 min ago"
tail -f /var/log/syslog # or /var/log/messages
dmesg                   # kernel ring buffer
dmesg -T                # with human-readable timestamps
```


### Notes

1. What is systemd?
systemd is the manager in linux systems that starts, stops, monitors and controls processes and services.


When you turned on your Linux computer, systemd is started after the Linux Kernel. Linux kernel starts the systemd as **the first user-space process**.

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

You can verify it using,
```bash
lahiru@DuelHunter:/mnt/d/linux-to-eBPF-lab$ ps -p 1
    PID TTY          TIME CMD
      1 ?        00:00:01 systemd
```

2. What does systemd actualy do?
>>1. Start services
   Example SSH server:

   Instead of manually running,
   ```bash
   /usr/sbin/sshd
   ```
   systemd starts it during the boot.
   You can check the syatus using,
   ```bash
   systemctl status ssh
   ```

>>2. Stop services
   Example:
   ```bash
   sudo systemctl stop nginx
   ```
   systemd tells nginx,
   `Stop running`

>>3. Restart services
   Example: If service crashes,
   ```bash
   sudo systemctl restart nginx
   ```

3. How does systemd relate to the journalctl?
   ```bash
      Service
         |
         | writes logs
         ▼
   systemd-journald
         |
         ▼
   journalctl
   ```
