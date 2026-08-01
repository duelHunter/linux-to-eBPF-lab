### What are Containers?

A group of processes run in isolation. All processes must be able to run on a shared kernel. 

Each container has it's own set of "namespaces"(isolated view)
    - PID
    - USER
    - UTS
    - NS
    - NET
    - IPC

1. What is Docker SWARM?
    Docker SWARM is Docker's builtin container orchestration system.

2. What problems does it solve?

Without Swarm:
- You start containers manually on each server.
- You track failures yourself.
- You balance traffic yourself.

With Swarm:
- Scaling – run many replicas of a container.
- Load balancing – distribute requests automatically.
- Self-healing – restart failed containers.
- Rolling updates – update containers with little or no downtime.
- Cluster management – manage many servers as one.    


####################################################
Lab 1: Run your first container and learn how to inspect it. Explore the Docker Hub and discover common images ready to be run.

Lab 2: Create a custom Docker Image built from a Dockerfile and push it to a central registry where it can be pulled to be deployed on other environments. Learn about the union file system and copy-on-write, and how they help you deliver applications faster.

Lab 3: Deploy containers using Docker swarm and learn how Docker Swarm helps solve problems such as reconciliation, scaling, high availability and service discovery. In this lab, you'll use Play-with-Docker for a multi-node cluster rather than use your locally installed Docker.

#####################################################3