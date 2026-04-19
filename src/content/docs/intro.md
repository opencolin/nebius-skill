---
title: Nebius Skill
description: Deploy and manage infrastructure on Nebius AI Cloud using Claude Code
---

Nebius Skill teaches Claude Code how to work with **Nebius AI Cloud** services. It enables you to deploy infrastructure simply by describing what you want in natural language.

## What is Nebius Skill?

Instead of writing complex CLI commands, just tell Claude Code what you want:

```
"Deploy OpenClaw endpoint with GPU and monitoring"
```

Claude handles all the infrastructure setup automatically.

## Supported Services

| Service | Purpose | Use Case |
|---------|---------|----------|
| **AI Endpoints** | Serverless ML inference | Deploy LLMs, OpenClaw agents |
| **Compute VMs** | Virtual machines with GPU | Training, development, inference |
| **Managed Kubernetes** | Enterprise k8s clusters | Production workloads, scaling |
| **Container Registry** | Docker image storage | Version control, deployment |
| **VPC Networking** | Networks and subnets | Isolation, security |
| **IAM** | Authentication & access | Service accounts, permissions |

## Key Features

🎯 **Natural Language Interface** — Describe what you want, Claude handles the CLI

🚀 **Quick Deployment** — Endpoints in minutes, clusters in ~10 minutes

💾 **Multiple Inference Options** — Token Factory, OpenRouter, HuggingFace

🔒 **Secure Authentication** — Federation, service accounts, API keys

📊 **Enterprise Ready** — Auto-scaling, load balancing, monitoring integration

## Example Workflows

### Deploy OpenClaw with GPU
```
User: "Deploy OpenClaw endpoint with H100 GPU"

Claude handles:
1. nebius ai endpoint create --platform gpu-h100-sxm
2. Waits for endpoint to be RUNNING
3. Returns dashboard URL
```

### Create GPU VM for Training
```
User: "Create GPU VM for model training"

Claude handles:
1. Creates disk with Ubuntu + CUDA
2. Launches VM with H100
3. Sets up SSH access
4. Returns IP address
```

## Pricing

**Pay-as-you-go** with no upfront costs:

- **CPU instances**: ~$0.10/hour
- **GPU instances**: ~$2.50/hour (H100)
- **Kubernetes clusters**: ~$0.50/hour + per-node

New users get **$100 credit** to try for free.

## Next Steps

import { LinkCard, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <LinkCard title="Quickstart" description="Deploy your first resource in 5 minutes" href="/intro/quickstart/" />
  <LinkCard title="Services" description="Learn about each Nebius service" href="/core-concepts/services/" />
  <LinkCard title="Installation" description="Setup the Nebius CLI" href="/intro/installation/" />
  <LinkCard title="Examples" description="Copy-paste ready deployments" href="/examples/openclaw/" />
</CardGrid>
