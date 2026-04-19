---
title: Regions & Platforms
description: Understanding Nebius regions and platform availability
---

## Available Regions

Nebius provides services across multiple regions:

### EU Region

- **Primary**: `eu-north1` (Stockholm)
- **Endpoint**: `https://api.nebius.com/v1`
- **Token Factory**: `https://api.tokenfactory.nebius.com/v1`

### US Region

- **Primary**: `us-central1` (Dallas)
- **Endpoint**: `https://api.nebius.us-central1.nebius.com/v1`
- **Token Factory**: `https://api.tokenfactory.us-central1.nebius.com/v1`

## Platform Support

### CPU Platforms

- **cpu-e2**: General purpose CPU instances (3-64 vCPU)
- **cpu-c3**: Compute optimized (4-96 vCPU)
- **cpu-m3**: Memory optimized (2-192 GB RAM)

### GPU Platforms

- **gpu-a40**: NVIDIA A40 (48GB VRAM)
- **gpu-a100**: NVIDIA A100 (40GB/80GB VRAM)
- **gpu-h100**: NVIDIA H100 (80GB VRAM)

## Selecting a Region

Choose based on:

- **Latency**: Pick the closest region
- **Data residency**: Ensure compliance
- **Service availability**: Not all services in all regions
- **Cost**: Pricing varies by region

Example:

```bash
nebius ai endpoint create \
  --region us-central1 \
  --platform gpu-a40
```

## API Endpoint Selection

Always use the correct endpoint for your region:

```bash
# EU Region
export NEBIUS_API_ENDPOINT="https://api.nebius.com/v1"

# US Region
export NEBIUS_API_ENDPOINT="https://api.nebius.us-central1.nebius.com/v1"
```
