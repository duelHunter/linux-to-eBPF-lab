Complete hardware review:
```bash
sudo lshw
```

A shorter, easier-to-read version:
```bash
sudo lshw -short
```

Show only selected hardware:
```bash
sudo lshw -class processor
sudo lshw -class memory
sudo lshw -class disk
sudo lshw -class network
sudo lshw -class display
```

# CPU

This `lscpu` command gives CPU hardware details of your machine.
```bash
lahiru-here@blackbox-Z790-EAGLE-AX:~$ lscpu
Architecture:                x86_64
  CPU op-mode(s):            32-bit, 64-bit
  Address sizes:             46 bits physical, 48 bits virtual
  Byte Order:                Little Endian
CPU(s):                      32
  On-line CPU(s) list:       0-31
Vendor ID:                   GenuineIntel
  Model name:                Intel(R) Core(TM) i9-14900K
    CPU family:              6
    Model:                   183
    Thread(s) per core:      2
    Core(s) per socket:      24
    Socket(s):               1
    Stepping:                1
    CPU(s) scaling MHz:      71%
    CPU max MHz:             6000.0000
    CPU min MHz:             800.0000
    BogoMIPS:                6374.40
    Flags:                   fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdts
                             cp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor d
                             s_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm
                              abm 3dnowprefetch cpuid_fault ssbd ibrs ibpb stibp ibrs_enhanced tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bm
                             i2 erms invpcid rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsaves split_lock_detect user_shstk avx_vnni dtherm ida
                              arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid movdiri movdir64b fs
                             rm md_clear serialize pconfig arch_lbr ibt flush_l1d arch_capabilities
Virtualization features:     
  Virtualization:            VT-x
Caches (sum of all):         
  L1d:                       896 KiB (24 instances)
  L1i:                       1.3 MiB (24 instances)
  L2:                        32 MiB (12 instances)
  L3:                        36 MiB (1 instance)
NUMA:                        
  NUMA node(s):              1
  NUMA node0 CPU(s):         0-31
Vulnerabilities:             
  Gather data sampling:      Not affected
  Ghostwrite:                Not affected
  Indirect target selection: Not affected
  Itlb multihit:             Not affected
  L1tf:                      Not affected
  Mds:                       Not affected
  Meltdown:                  Not affected
  Mmio stale data:           Not affected
  Old microcode:             Not affected
  Reg file data sampling:    Mitigation; Clear Register File
  Retbleed:                  Not affected
  Spec rstack overflow:      Not affected
  Spec store bypass:         Mitigation; Speculative Store Bypass disabled via prctl
  Spectre v1:                Mitigation; usercopy/swapgs barriers and __user pointer sanitization
  Spectre v2:                Mitigation; Enhanced / Automatic IBRS; IBPB conditional; PBRSB-eIBRS SW sequence; BHI BHI_DIS_S
  Srbds:                     Not affected
  Tsa:                       Not affected
  Tsx async abort:           Not affected
  Vmscape:                   Mitigation; IBPB before exit to userspace
``` 
Let's explore above output:
- This CPU use 64-bit and x86 architecture.
- This CPU can operate on both 64-bit and 32-bit execution modes.

```bash
uname -m
```


# GPU

```bash
lspci | grep -Ei "vga|3d|display"
```
```bash
lahiru-here@blackbox-Z790-EAGLE-AX:~$ nvidia-smi
Wed Jul 29 12:56:20 2026       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 595.71.05              Driver Version: 595.71.05      CUDA Version: 13.2     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 5090        Off |   00000000:01:00.0  On |                  N/A |
|  0%   42C    P8              6W /  575W |   20994MiB /  32607MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A           12301    C+G   ...rack-uuid=3190708988185955192        111MiB |
|    0   N/A  N/A           78975      G   /usr/bin/gnome-shell                    143MiB |
|    0   N/A  N/A           79510      G   /usr/bin/Xwayland                        12MiB |
|    0   N/A  N/A           80283    C+G   ...exec/xdg-desktop-portal-gnome         10MiB |
|    0   N/A  N/A          136472      C   ...ing-attacks/.venv/bin/python3      14160MiB |
|    0   N/A  N/A          489769    C+G   /usr/bin/loupe                          271MiB |
|    0   N/A  N/A          875288      G   /opt/antigravity/antigravity-ide        127MiB |
|    0   N/A  N/A         1125518      C   .../versions/3.10.13/bin/python3       5246MiB |
|    0   N/A  N/A         1941930    C+G   ptyxis                                   57MiB |
|    0   N/A  N/A         2885200      G   /usr/bin/gnome-shell                     75MiB |
|    0   N/A  N/A         2885905      G   /usr/bin/Xwayland                         8MiB |
|    0   N/A  N/A         2886296    C+G   ...exec/xdg-desktop-portal-gnome         10MiB |
|    0   N/A  N/A         3439673    C+G   ...rack-uuid=3190708988185955192         91MiB |
|    0   N/A  N/A         3613344    C+G   /usr/bin/gnome-text-editor               50MiB |
|    0   N/A  N/A         3732587    C+G   /usr/bin/nautilus                        54MiB |
|    0   N/A  N/A         4071533      G   ...rack-uuid=3190708988185955192        126MiB |
+-----------------------------------------------------------------------------------------+
```


More compact live monitoring:
```bash
nvidia-smi dmon
```

# RAM

Show current memory usage:
```bash
free -h
```

cat /proc/meminfo

sudo dmidecode --type memory


# Storage devices

```bash
lsblk
```

Show disk usage:
```bash
df -h
```


Write about this logical CPUs,
https://chatgpt.com/c/6a699edc-0a30-83ee-a5e4-4bdd5bd838b2