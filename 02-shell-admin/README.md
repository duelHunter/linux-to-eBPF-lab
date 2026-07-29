### 02 — Shell & System Administration

This section focuses on how users interact with Linux systems through the shell. The goal is to understand how commands are interpreted, executed, automated, and administered.

### 1. Bash Fundamentals

### What is Bash?

Bash (Bourne Again SHell) is the default command interpreter on many Linux distributions.

### Why it matters

* Runs commands

* Executes scripts

* Automates tasks

* Manages environment variables

### Practice

`echo $SHELL bash --version pwd whoami date`

### Mini Experiment

Create a variable:

`name="Lahiru" echo "Hello $name"`

### Key Takeaway

Bash is both a command interpreter and a scripting language.

### 2. Shell vs Terminal

### Terminal

The application window.

Examples:

* GNOME Terminal

* Windows Terminal

* Konsole

### Shell

The program running inside the terminal.

Examples:

* bash

* zsh

* fish

### Check Your Shell

`echo $SHELL ps -p $$`

### Key Takeaway

* Terminal = interface

* Shell = command processor

### 3. Shell Builtins vs External Commands

### Builtins

Implemented inside Bash.

Examples:

`cd pwd echo history exit`

### External Commands

Executable files on disk.

Examples:

`ls cp mv git python3`

### Practice

`type cd type ls type echo which ls`

### Mini Experiment

Compare:

`echo hello /bin/echo hello`

### Key Takeaway

Builtins run inside the current shell; external commands run as separate processes.

### 4. Command Execution Flow

When you type a command, Bash searches in this order:

Execution order

1. Alias

2. Function

3. Builtin

4. External executable

### Practice

`alias ll='ls -alF' myfunc() { echo "function"; } type ll type myfunc type cd type ls`

### Visual

You type: ls

Check alias

Check function

Check builtin

Search PATH → /usr/bin/ls

### Key Takeaway

Understanding this order helps debug “wrong command executed” problems.

### 5. PATH and Command Lookup

### What is PATH?

A list of directories searched for executables.

### View PATH

`echo $PATH`

### Find Commands

`which python3 whereis bash`

### Add Custom Command

Create a personal bin directory:

`mkdir -p ~/bin`

Create a script:

`cat > ~/bin/hello <<'EOF' #!/bin/bash echo "Hello from PATH" EOF`

Make it executable:

`chmod +x ~/bin/hello`

Add to PATH:

`export PATH="$HOME/bin:$PATH"`

Run:

`hello`

### Key Takeaway

PATH controls how Linux finds programs.

### 6. Aliases and Functions

### Alias

Short text replacement.

`alias gs='git status' gs`

### Function

Reusable logic.

`mkcd() { mkdir -p "$1" cd "$1" }`

Use:

`mkcd test-project`

### Persist Them

Add to `~/.bashrc`.

### Key Takeaway

* Alias → shortcuts

* Function → reusable workflows

### 7. Bash Scripting

Create `backup.sh`:

`#!/bin/bash echo "Starting backup..." tar -czf backup.tar.gz ~/Documents echo "Backup completed"`

Make executable:

`chmod +x backup.sh`

Run:

`./backup.sh`

### Learn These First

Variables

`name="Lahiru"`

Conditions

`if [ -f file ]`

Loops

`for i in *`

Functions

`backup() { }`

### Mini Project

Write a script that:

* Creates a folder

* Copies a file

* Logs the time

* Prints success/failure

### 8. SSH (Secure Shell)

### Connect to a Remote Server

`ssh user@server-ip`

### Generate a Key Pair

`ssh-keygen -t ed25519`

### Copy the Public Key

`ssh-copy-id user@server-ip`

### Useful Options

`ssh -p 2222 user@host ssh -i ~/.ssh/id_ed25519 user@host`

### Mini Experiment

SSH into another Linux VM or localhost:

`ssh localhost`

### Key Takeaway

SSH is the standard tool for secure remote administration.

### 9. Cron Jobs

### What is Cron?

Runs commands automatically at scheduled times.

### Edit Crontab

`crontab -e`

### Example: Every Day at 2 AM

`0 2 * * * /home/lahiru/backup.sh`

### Test Job

Run every minute:

`* * * * * echo "Cron works" >> /tmp/cron.log`

Check:

`tail -f /tmp/cron.log`

### Key Takeaway

Cron is essential for automation and maintenance tasks.

### 10. User Management

### Create a User

`sudo useradd -m alice`

### Set Password

`sudo passwd alice`

### Switch User

`su - alice`

### Add to Sudo Group

Ubuntu:

`sudo usermod -aG sudo alice`

### Check Groups

`id alice groups alice`

### Mini Experiment

Create a temporary user, log in, and remove it:

`sudo useradd -m testuser sudo passwd testuser su - testuser exit sudo userdel -r testuser`

### Key Takeaway

Linux security is heavily based on users, groups, and permissions.

### Suggested Folder Structure

`02-shell-admin/ ├── 01-bash-fundamentals ├── 02-shell-vs-terminal ├── 03-builtins-vs-external ├── 04-command-execution ├── 05-path-and-lookup ├── 06-aliases-and-functions ├── 07-bash-scripting ├── 08-ssh ├── 09-cron └── 10-user-management`

Each subfolder can contain:

`README.md commands.md experiment.sh notes.md`


### Final Goal

By the end of this section, you should be able to:

* Explain how a command is executed

* Create reusable shell functions

* Write basic Bash scripts

* Connect to remote servers securely

* Automate tasks with cron

* Manage Linux users and permissions

* Debug common shell and PATH problems

This section will give you a real Linux administration foundation, which is the prerequisite for Docker, Kubernetes, observability, and eBPF.
