---
title: Conventions
description: Naming and resource conventions for Nebius
---

## Naming Conventions

### Projects

- Format: `[team]-[purpose]`
- Example: `ml-training`, `api-staging`
- Length: 3-32 characters
- Allowed: lowercase letters, numbers, hyphens (no underscores)

### Resources

- **Endpoints**: `[service]-[env]-[version]`
  - Example: `llama-prod-v2`
- **VMs**: `[service]-[role]-[number]`
  - Example: `gpu-worker-01`, `cpu-api-03`
- **Kubernetes Clusters**: `[service]-[region]-[env]`
  - Example: `app-eu-prod`, `batch-us-staging`

## Environment Naming

Use consistent environment names:

- `prod` / `production` - Production workloads
- `staging` / `pre-prod` - Pre-production testing
- `dev` / `development` - Development/testing
- `test` - Automated testing environment

## Tagging Strategy

Tag resources for organization and cost tracking:

```bash
--tags \
  environment=prod \
  team=ml \
  cost-center=research \
  version=1.0
```

## Port Conventions

Standard ports by service type:

- **HTTP/REST**: 8080
- **gRPC**: 50051
- **Metrics**: 9090
- **Debugging**: 40000

## Resource Sizing

Recommended configurations:

### Small Workloads
- CPU: cpu-e2 (4-8 vCPU)
- Memory: 16-32 GB
- Storage: 100 GB

### Medium Workloads
- CPU: cpu-c3 (16-32 vCPU)
- Memory: 64-128 GB
- Storage: 500 GB

### Large Workloads
- GPU: gpu-a40 or gpu-a100
- Memory: 256+ GB
- Storage: 2+ TB
