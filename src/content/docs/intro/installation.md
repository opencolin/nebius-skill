---
title: Installation
description: Install and configure Nebius Skill
---

## Prerequisites

- **OS**: macOS or Linux (Windows requires WSL2)
- **Claude Code**: Latest version
- **Nebius Account**: Free at nebius.cloud

## Install Nebius CLI

### macOS / Linux

```bash
# Download and install
curl -sSL https://storage.eu-north1.nebius.cloud/cli/install.sh | bash

# Reload shell
exec -l $SHELL

# Verify
nebius version
```

### Windows (WSL2)

```bash
# Inside WSL2 terminal
curl -sSL https://storage.eu-north1.nebius.cloud/cli/install.sh | bash
exec -l $SHELL
nebius version
```

## Optional Tools

| Tool | Install | Purpose |
|------|---------|---------|
| **docker** | `sudo apt install docker.io` | Container operations |
| **kubectl** | `curl -LO https://dl.k8s.io/release/v1.28.0/bin/linux/amd64/kubectl` | Kubernetes management |
| **jq** | `sudo apt install jq` | JSON parsing (recommended) |
| **helm** | `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 \| bash` | Kubernetes packages |

## Verify Installation

Run the pre-flight check:

```bash
bash ~/.claude/skills/nebius/scripts/check-nebius-cli.sh
```

**Expected output:**
```
✓ nebius CLI installed
✓ nebius profile found
✓ Project ID set
✓ API connectivity verified
```

## Troubleshooting

### "nebius: command not found"

```bash
# Add to PATH
export PATH="$HOME/.nebius/bin:$PATH"

# Permanently (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH="$HOME/.nebius/bin:$PATH"' >> ~/.bashrc
```

### macOS Permission Issues

```bash
# Allow installer
sudo spctl --add-exemption /path/to/installer
```

## Next Steps

- [Quickstart](/intro/quickstart/) - Deploy in 5 minutes
- [Authentication](/intro/authentication/) - Setup credentials
- [Services](/core-concepts/services/) - Explore services
