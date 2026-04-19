---
title: Quickstart
description: Deploy your first resource in 5 minutes
---

Get up and running with Nebius Skill in 5 minutes.

## Prerequisites

- Claude Code installed
- Nebius account (free at nebius.cloud)
- Basic CLI familiarity

## Step 1: Install Nebius CLI

```bash
curl -sSL https://storage.eu-north1.nebius.cloud/cli/install.sh | bash
exec -l $SHELL
nebius version
```

## Step 2: Authenticate

```bash
nebius profile create
# Follow prompts to login via browser
```

Verify:
```bash
nebius iam whoami
```

## Step 3: Deploy Your First Endpoint

Open Claude Code and describe what you want:

```
Deploy a serverless OpenClaw endpoint with GPU
```

Claude will:
1. Create the endpoint
2. Wait for it to be RUNNING
3. Return the dashboard URL

**Expected output:**
```
✓ Endpoint created: endpoint-abc123
✓ Status: RUNNING
✓ Dashboard: http://1.2.3.4:18789
✓ Metrics: http://1.2.3.4:8888/metrics
```

## Step 4: Access Your Endpoint

```bash
ENDPOINT_IP="1.2.3.4"

# SSH access
ssh nebius@$ENDPOINT_IP

# API access
curl http://$ENDPOINT_IP:8080/v1/models
```

## Common First Tasks

**Deploy a GPU VM:**
```
Create a GPU VM with 80GB H100 for model development
```

**Setup Kubernetes:**
```
Deploy a managed Kubernetes cluster with 3 nodes
```

**Create Container Registry:**
```
Setup a container registry for my Docker images
```

## Next Steps

- [Installation Guide](/intro/installation/)
- [Authentication Methods](/intro/authentication/)
- [Service Overview](/core-concepts/services/)
- [Full Examples](/examples/openclaw/)

## Costs

First-time users get **$100 credit**. Learn more about [pricing](https://nebius.cloud/pricing).

**Example costs:**
- CPU endpoint (1 hour): ~$0.10
- GPU endpoint (1 hour): ~$2.50
