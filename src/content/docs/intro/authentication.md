---
title: Authentication
description: Setup and manage Nebius credentials
---

Nebius uses two types of authentication depending on your use case.

## CLI Authentication

For command-line operations with the Nebius CLI.

### Step 1: Create Profile

```bash
nebius profile create
```

This opens your browser for OAuth login. Once authenticated, it stores credentials locally at `~/.nebius/config`.

### Step 2: Verify Authentication

```bash
nebius iam whoami
```

Expected output:
```
Email: user@example.com
User ID: user-abc123
Roles: member
```

## Token Factory API Keys

For inference and programmatic access.

### Generate API Key

```bash
nebius iam service-account create --name "my-api-key"
```

Returns:
```
Service Account ID: sa-xyz789
API Key: nbc_xxx...
```

### Use in Code

**Python:**
```python
import requests

api_key = "nbc_xxx..."
endpoint_ip = "1.2.3.4"

response = requests.post(
    f"http://{endpoint_ip}:8080/v1/chat/completions",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"model": "gpt-4", "messages": [...]}
)
```

**curl:**
```bash
curl -X POST http://1.2.3.4:8080/v1/chat/completions \
  -H "Authorization: Bearer nbc_xxx..." \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4", "messages": [...]}'
```

## SSH Key Setup

For VM access.

### Generate Key (macOS/Linux)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/nebius -C "nebius"
```

### Add to VM at Creation

```bash
nebius compute vm create \
  --name my-vm \
  --ssh-key "$(cat ~/.ssh/nebius.pub)"
```

### Connect to VM

```bash
ENDPOINT_IP="1.2.3.4"
ssh -i ~/.ssh/nebius nebius@$ENDPOINT_IP
```

## Service Accounts (Advanced)

For CI/CD and headless environments.

### Create Service Account

```bash
nebius iam service-account create --name "ci-deployer"
```

### Generate Access Key

```bash
nebius iam access-key create --service-account-id sa-xyz789
```

Returns:
```
Access Key ID: ak_abc123
Secret Key: sk_xyz789...
```

**Warning:** Secret keys are shown only once. Store securely.

### Use in CI/CD

**GitHub Actions:**
```yaml
env:
  NEBIUS_ACCESS_KEY_ID: ${{ secrets.NEBIUS_KEY_ID }}
  NEBIUS_SECRET_KEY: ${{ secrets.NEBIUS_SECRET_KEY }}

run: nebius iam whoami
```

## Best Practices

- ✅ Use service accounts for CI/CD, not personal credentials
- ✅ Rotate API keys quarterly
- ✅ Store secrets in environment variables, not files
- ✅ Use Ed25519 SSH keys (more secure than RSA)
- ✅ Restrict service account permissions to minimum required

## Troubleshooting

**"Invalid credentials"**
```bash
# Clear cached credentials
rm -rf ~/.nebius/config

# Create new profile
nebius profile create
```

**"Access denied"**
Check service account permissions:
```bash
nebius iam service-account get --id sa-xyz789
```

**SSH key rejected**
Ensure key format is correct:
```bash
ssh-keygen -l -f ~/.ssh/nebius.pub
```
