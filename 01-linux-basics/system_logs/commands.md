journalctl                 # systemd journal
journalctl -u <service>    # logs for one service
journalctl -f              # follow, like tail -f
journalctl --since "10 min ago"
tail -f /var/log/syslog    # or /var/log/messages
dmesg                      # kernel ring buffer
dmesg -T                   # with human-readable timestamps
