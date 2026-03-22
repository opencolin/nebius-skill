---
# Claude Code fields
name: nebius
description: >
  Deploy and manage Nebius AI Cloud infrastructure via the nebius CLI.
  Use when the user wants to create, manage, or troubleshoot Nebius compute VMs,
  GPU clusters, Kubernetes clusters, serverless AI endpoints, container registries,
  object storage, networking, or IAM resources. Triggers on mentions of "nebius",
  "nebius cloud", or Nebius service names like mk8s, soperator, token factory.
allowed-tools: Bash(nebius *), Bash(kubectl *), Bash(helm *), Bash(docker *), Bash(ssh *), Bash(curl *), Read, Grep, Glob
disable-model-invocation: false
argument-hint: "[service] [action] or describe what you want to deploy"

# OpenClaw fields (ignored by Claude Code, used by OpenClaw)
metadata:
  openclaw:
    requires:
      bins: [nebius]
      anyBins: [kubectl, helm, docker]
    primaryEnv: NEBIUS_PROFILE
    emoji: "☁️"
    os: [macos, linux]
---

# Nebius AI Cloud CLI Skill

You are an expert at deploying and managing infrastructure on Nebius AI Cloud using the `nebius` CLI.

## Pre-flight Check

Before running ANY nebius commands, verify the CLI is installed and authenticated:

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/check-nebius-cli.sh
```

If the CLI is not installed, guide the user through installation:

```bash
curl -sSL https://storage.eu-north1.nebius.cloud/cli/install.sh | bash
exec -l $SHELL
nebius version
```

If not authenticated, guide them through profile setup:

```bash
nebius init  # Interactive setup with browser-based OAuth
```

Or for non-interactive setup:

```bash
nebius profile create --name <profile-name>
# Then authenticate:
nebius iam login
```

## Always Use `--format json`

When running nebius commands programmatically, ALWAYS append `--format json` to parse output reliably. Use `jq` to extract specific fields.

## Core Services

### 1. Serverless AI Endpoints (Most Common Use Case)

Deploy ML models or agent containers as auto-scaling serverless endpoints.

For detailed commands and parameters, see [references/ai-endpoints-reference.md](references/ai-endpoints-reference.md).

**Quick deploy (CPU-only, uses Token Factory for inference):**

```bash
nebius ai endpoint create \
  --name my-endpoint \
  --image <REGISTRY_IMAGE> \
  --platform cpu-e2 \
  --container-port 8080 \
  --env "TOKEN_FACTORY_API_KEY=<key>" \
  --env "INFERENCE_MODEL=<model>" \
  --public
```

**GPU deploy (self-hosted inference):**

```bash
nebius ai endpoint create \
  --name my-gpu-endpoint \
  --image <REGISTRY_IMAGE> \
  --platform gpu-h100-sxm \
  --preset 1gpu-16vcpu-200gb \
  --container-port 8080 \
  --disk-size 100Gi \
  --shm-size 16Gi \
  --public \
  --auth token \
  --token "<auth-token>"
```

### 2. Compute VMs

Create GPU or CPU virtual machines for training, development, or hosting.

For detailed commands, see [references/compute-reference.md](references/compute-reference.md).

### 3. Managed Kubernetes (mk8s)

Create managed Kubernetes clusters with GPU node groups.

For detailed commands, see [references/kubernetes-reference.md](references/kubernetes-reference.md).

### 4. Container Registry

Build and push container images to Nebius Container Registry.

For detailed commands, see [references/registry-reference.md](references/registry-reference.md).

### 5. Networking (VPC)

Create networks and subnets required by VMs and endpoints.

For detailed commands, see [references/networking-reference.md](references/networking-reference.md).

### 6. IAM & Authentication

Manage service accounts, access keys, and project access.

For detailed commands, see [references/iam-reference.md](references/iam-reference.md).

### 7. gRPC API & SDKs

For programmatic access beyond the CLI, Nebius offers a gRPC API with Go, Python, and Terraform SDKs.

For API details, endpoints, and authentication, see [references/api-reference.md](references/api-reference.md).

## Available GPU Platforms

| Platform | GPU | VRAM | Best For |
|---|---|---|---|
| `gpu-h100-sxm` | H100 | 80 GB | General inference, training |
| `gpu-h200-sxm` | H200 | 141 GB | Large model inference |
| `gpu-b200-sxm` | B200 | 180 GB | Next-gen workloads |
| `gpu-b300-sxm` | B300 | 288 GB | Largest models |
| `gpu-l40s-pcie` | L40S | 48 GB | Cost-effective inference |
| `cpu-e2` | None | N/A | CPU-only (eu-north1, us-central1) |
| `cpu-d3` | None | N/A | CPU-only (eu-west1 only) |

## Regions

| Region | Location | CPU Platform | Notes |
|---|---|---|---|
| `eu-north1` | Finland | `cpu-e2` | Primary region |
| `eu-west1` | Paris | `cpu-d3` | Use `cpu-d3` NOT `cpu-e2` |
| `us-central1` | US | `cpu-e2` | Requires separate project |

## Common Presets

| Preset | vCPU | RAM | GPU |
|---|---|---|---|
| `1gpu-16vcpu-200gb` | 16 | 200 GB | 1x GPU |
| `2gpu-32vcpu-400gb` | 32 | 400 GB | 2x GPU |
| `4gpu-64vcpu-800gb` | 64 | 800 GB | 4x GPU |
| `8gpu-128vcpu-1600gb` | 128 | 1600 GB | 8x GPU |

## End-to-End Deployment Examples

For complete step-by-step deployment workflows, see:

- [examples/deploy-serverless-endpoint.md](examples/deploy-serverless-endpoint.md) - Deploy an AI agent as a serverless endpoint
- [examples/deploy-gpu-vm.md](examples/deploy-gpu-vm.md) - Deploy a GPU VM with vLLM for self-hosted inference

## Safety Rules

1. **Always confirm before creating billable resources** - GPU VMs and endpoints cost money. Show the user what will be created and estimated cost tier before proceeding.
2. **Never delete without explicit confirmation** - Always list what will be deleted and ask for confirmation.
3. **Prefer `--format json`** - Parse output programmatically to avoid errors.
4. **Check existing resources first** - Before creating, check if a resource with the same name already exists using `list` commands.
5. **Suggest cost optimization** - Recommend CPU-only (`cpu-e2`) for agent/orchestration workloads that don't need local GPU. Suggest stopping endpoints/VMs when not in use.
