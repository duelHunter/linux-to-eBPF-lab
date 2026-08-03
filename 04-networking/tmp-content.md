# iptables commands

`iptables` is a Linux firewall management tool. It controls **what network traffic is allowed or blocked**.

Think of it like a security guard at the entrance of a building:

```
                 Internet / Network
                         |
                         |
                         v
                  +-------------+
                  |  Firewall   |
                  |  (iptables) |
                  +-------------+
                         |
                         v
                    Linux Server
```

Every incoming packet must pass through iptables rules.

---

# 1. Viewing firewall rules

Command:

```bash
sudo iptables -L -n
```

Breakdown:

## `sudo`

Run as administrator.

Firewall rules require root privileges because they affect the whole machine.

---

## `iptables`

The firewall management program.

---

## `-L`

Means:

```
List
```

Show existing firewall rules.

Example:

```bash
sudo iptables -L
```

Output:

```
Chain INPUT (policy ACCEPT)
target     prot opt source      destination
ACCEPT     tcp  --  anywhere    anywhere tcp dpt:22
REJECT     all  --  anywhere    anywhere
```

---

## `-n`

Means:

```
numeric output
```

Do not resolve IP addresses or ports into names.

Without `-n`:

```
10.244.49.16
```

might become:

```
some-host.example.com
```

With `-n`:

```
10.244.49.16
```

This is faster and clearer.

---

# 2. Understanding iptables chains

When you ran:

```bash
sudo iptables -L -n
```

you saw:

```
Chain INPUT
Chain FORWARD
Chain OUTPUT
```

These are called **chains**.

They represent different traffic directions.

---

## INPUT chain

Incoming traffic:

```
External machine
       |
       |
       v
   INPUT chain
       |
       |
       v
    Server
```

Example:

Someone connects:

```
ssh server 22
```

The packet enters INPUT.

---

## OUTPUT chain

Traffic leaving your server:

```
Server
   |
   |
   v
OUTPUT chain
   |
   |
   v
Internet
```

Example:

Your server runs:

```bash
curl google.com
```

That traffic uses OUTPUT.

---

## FORWARD chain

Used when your machine acts as a router.

Example:

```
Computer A
     |
     v
Linux Router
     |
     v
Computer B
```

Most servers don't use this.

---

# 3. Adding a firewall rule

Your command:

```bash
sudo iptables -I INPUT -p tcp --dport 8082 -j ACCEPT
```

Let's break every part.

---

## `-I`

Means:

```
Insert rule
```

Example:

Before:

```
1. ACCEPT SSH
2. REJECT everything
```

After:

```
1. ACCEPT port 8082
2. ACCEPT SSH
3. REJECT everything
```

It inserts the rule at the top.

Why?

Because iptables checks rules from top to bottom.

---

# 4. Why order matters

Example:

```
Rule 1:
ACCEPT port 8082

Rule 2:
REJECT all
```

Traffic:

```
Request port 8082
        |
        v
Rule 1 matches
        |
        v
ACCEPT
```

---

But:

```
Rule 1:
REJECT all

Rule 2:
ACCEPT port 8082
```

Traffic:

```
Request port 8082
        |
        v
Rule 1 matches
        |
        v
REJECT
```

Rule 2 is never reached.

That's why `-I` is commonly used.

---

# 5. Protocol option

```bash
-p tcp
```

Means:

```
Only apply this rule to TCP traffic
```

Network protocols:

| Protocol | Used for         |
| -------- | ---------------- |
| TCP      | HTTP, SSH, MySQL |
| UDP      | DNS, DHCP        |
| ICMP     | ping             |

Apache uses TCP:

```
HTTP
 |
 TCP
 |
 Port 8082
```

So we use:

```bash
-p tcp
```

---

# 6. Destination port

```bash
--dport 8082
```

Means:

```
Destination port = 8082
```

Example:

Incoming packet:

```
Source:
jump-host

Destination:
stapp01:8082
```

iptables checks:

```
Is destination port 8082?
```

If yes:

continue.

---

# 7. Action

```bash
-j ACCEPT
```

`-j` means:

```
jump to action
```

The action is:

```
ACCEPT
```

Meaning:

Allow the packet.

Other actions:

## DROP

```bash
-j DROP
```

Silently discard.

Client waits until timeout.

---

## REJECT

```bash
-j REJECT
```

Reject and send a response.

Example:

```
Connection refused
```

---

# 8. Example complete rule

Command:

```bash
sudo iptables -I INPUT -p tcp --dport 8082 -j ACCEPT
```

Meaning:

> Insert a rule at the top of the INPUT chain that allows incoming TCP connections destined for port 8082.

Diagram:

```
Incoming packet

jump-host
    |
    |
    v

INPUT chain

Rule:
TCP?
 |
 YES

Port 8082?
 |
 YES

ACCEPT

    |
    v

Apache
```

---

# 9. Removing a rule

First list rules with numbers:

```bash
sudo iptables -L -n --line-numbers
```

Example:

```
num target  prot port

1   ACCEPT  tcp  8082
2   ACCEPT  tcp  22
3   REJECT
```

Remove rule 1:

```bash
sudo iptables -D INPUT 1
```

`-D` means delete.

---

# 10. Saving iptables rules

When you run:

```bash
iptables -I INPUT ...
```

the rule is stored in memory.

After reboot:

```
Reboot
   |
   v
Rules disappear
```

To save:

Old systems:

```bash
service iptables save
```

New systems:

```bash
iptables-save > /etc/sysconfig/iptables
```

---

# 11. Your specific server rules explained

Your output:

```
Chain INPUT (policy ACCEPT)

ACCEPT all  state RELATED,ESTABLISHED

ACCEPT icmp

ACCEPT all

ACCEPT tcp dpt:22

REJECT all
```

Meaning:

### Existing connections allowed

```
RELATED,ESTABLISHED
```

Example:

You SSH in:

```
jump-host ---> server
```

Return traffic is allowed.

---

### Ping allowed

```
ACCEPT icmp
```

Allows:

```bash
ping stapp01
```

---

### SSH allowed

```
ACCEPT tcp dpt:22
```

Allows:

```bash
ssh tony@stapp01
```

---

### Everything else blocked

```
REJECT all
```

So:

```
HTTP 8082 ❌
HTTP 3004 ❌
Database 3306 ❌
```

unless you add rules.

---

# In your Apache task

The final firewall rule should be:

```bash
sudo iptables -I INPUT -p tcp --dport 8082 -j ACCEPT
```

Then:

```bash
sudo iptables -L -n
```

should show:

```
ACCEPT tcp -- 0.0.0.0/0 0.0.0.0/0 tcp dpt:8082
```

Now traffic path becomes:

```
jump-host
    |
    |
    v
iptables
    |
    | ACCEPT 8082
    |
    v
Apache httpd
    |
    v
Response
```

This is the complete role of iptables in your Stratos troubleshooting task.
