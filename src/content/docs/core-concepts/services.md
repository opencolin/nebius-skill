---
title: Services
description: Overview of Nebius AI Cloud services
---

Nebius AI Cloud provides several services for deploying and managing infrastructure.

## Serverless AI Endpoints

Deploy ML models and agent containers with auto-scaling.

**Best for:**
- LLM inference servers
- OpenClaw/NemoClaw deployments
- Variable load applications
- Real-time processing

**Quick deploy:**
```
Deploy OpenClaw endpoint with GPU and Token Factory
```

## Compute VMs

Create virtual machines for training and development.

**Best for:**
- Model training (PyTorch, TensorFlow)
- Development environments
- Batch processing
- Long-running jobs

**Available GPUs:**
- H100 SXM (80GB) - General inference/training
- H200 SXM (141GB) - Large models
- B200 SXM (180GB) - Next-gen models
- L40S PCIe (48GB) - Cost-effective

## Managed Kubernetes (mk8s)

Enterprise Kubernetes clusters with GPU support.

**Best for:**
- Production workloads
- Microservices
- Auto-scaling applications
- Multi-tenant environments

**Features:**
- Managed control plane
- Auto-scaling node groups
- GPU node support
- Built-in networking

## Container Registry

Private Docker image registry.

**Best for:**
- Docker image storage
- CI/CD pipelines
- Image lifecycle management
- Access control

## VPC Networking

Virtual networks and subnets.

**Best for:**
- Network isolation
- Security groups
- Custom routing
- Multi-region networks

## IAM & Authentication

User and service account management.

**Best for:**
- CI/CD authentication
- Service-to-service access
- Multi-user projects
- Audit logging

## Service Comparison

| Service | Startup | Auto-Scale | Cost | Best For |
|---------|---------|-----------|------|----------|
| **Endpoints** | 1-2 min | ✅ | $2.50/h GPU | Inference |
| **VMs** | 3-5 min | ❌ | $2.50/h GPU | Training |
| **Kubernetes** | 10-15 min | ✅ | $0.50/h + nodes | Production |
| **Registry** | Instant | ✅ | $0.10/GB | Images |
| **VPC** | Instant | N/A | Free | Networking |

## Decision Tree

**Need inference?**
→ Use Endpoints (auto-scaling, serverless)

**Need development?**
→ Use VMs (SSH access, persistent state)

**Need production platform?**
→ Use Kubernetes (multi-tenant, orchestration)

## Pricing

**Pay-as-you-go:**
- H100 GPU: $2.50/hour
- CPU instance: $0.10/hour
- Kubernetes cluster: $0.50/hour + per-node

**New users get $100 credit.**

## Regional Availability

| Region | CPUs | GPUs | K8s |
|--------|------|------|-----|
| **eu-north1** | cpu-e2 | H100, H200, B200, L40S | ✅ |
| **eu-west1** | cpu-d3 | H100, H200, B200, L40S | ✅ |
| **us-central1** | cpu-e2 | H100, H200, B200, L40S | ✅ |

## Next Steps

- [Endpoints](/services/endpoints/)
- [Compute VMs](/services/compute/)
- [Kubernetes](/services/kubernetes/)
- [Examples](/examples/openclaw/)
