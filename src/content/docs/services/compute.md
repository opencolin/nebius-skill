---
title: Compute VMs
description: Create virtual machines for training and development
---

Launch VMs with GPU support for model training, development, and long-running jobs.

## Quick Start

```bash
# Create H100 GPU VM
nebius compute vm create \
  --name my-training-vm \
  --image-id ubuntu-22-04 \
  --disk-size 200 \
  --machine-type gpu-h100-sxm \
  --ssh-key "$(cat ~/.ssh/nebius.pub)"
```

Get the IP:
```bash
nebius compute vm describe --name my-training-vm \
  --format json | jq -r '.networkInterfaces[0].primaryIpAddress'
```

## Available GPUs

| Type | VRAM | Price/Hour | Best For |
|------|------|-----------|----------|
| H100 SXM | 80GB | $2.50 | Training, inference, general ML |
| H200 SXM | 141GB | $3.50 | Large models, long sequences |
| B200 SXM | 180GB | $4.00 | Cutting-edge models |
| B300 SXM | 192GB | $4.50 | Frontier research |
| L40S PCIe | 48GB | $0.80 | Cost-effective, lighter workloads |

## Disk Options

```bash
# SSD (fast, local)
--disk-type network-ssd --disk-size 200

# Standard (slower, persistent)
--disk-type network-hdd --disk-size 500
```

Disks persist after VM shutdown and can be attached to new VMs.

## Connect via SSH

```bash
# From creation, you have the IP
IP="1.2.3.4"

# SSH as nebius user
ssh -i ~/.ssh/nebius nebius@$IP

# Become root (passwordless)
sudo su -
```

## Install Development Tools

```bash
# On the VM
sudo apt update
sudo apt install -y python3-pip cuda-toolkit

# Install PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

## GPU Monitoring

```bash
# Check GPU status
nvidia-smi

# Monitor continuously
watch -n 1 nvidia-smi

# Get temperature and power
nvidia-smi --query-gpu=name,temperature.gpu,power.draw --format=csv -l 1
```

## Cost Optimization

**Preemptible VMs** (experimental)
```bash
nebius compute vm create \
  --name my-vm \
  --preemptible \
  --machine-type gpu-h100-sxm
```

Saves ~50% but can be interrupted with 2-minute notice.

## Common Operations

**Stop VM (preserve disk)**
```bash
nebius compute vm stop --name my-training-vm
```

**Restart VM**
```bash
nebius compute vm start --name my-training-vm
```

**Delete VM (keeps disk)**
```bash
nebius compute vm delete --name my-training-vm
```

**Delete VM and disk**
```bash
nebius compute vm delete --name my-training-vm --delete-disk
```

## Networking

**Default:** VM gets private IP + optional public IP (limited quota).

```bash
# Assign public IP
nebius compute vm update --name my-training-vm --public-ip

# Remove public IP
nebius compute vm update --name my-training-vm --no-public-ip
```

## Security

- SSH port (22): Protected by key-based auth only
- Access from your IP only: Configure security groups
- No default password login: Keys required

```bash
# SSH from specific IP only
nebius compute vm update \
  --name my-training-vm \
  --security-group ssh-from-office
```
