# Deploy OpenClaw on Nebius Serverless

Deploy an OpenClaw AI agent to Nebius in under 5 minutes using a pre-built public image.

## Quick Deploy (No Docker Build Required)

```bash
# 1. Choose your model
MODEL="zai-org/GLM-5"
# Other options: deepseek-ai/DeepSeek-R1-0528, MiniMaxAI/MiniMax-M2.5, zai-org/GLM-4.5

# 2. Get your Token Factory API key
# Option A: From MysteryBox (if stored):
TF_KEY=$(nebius mysterybox payload get --secret-id <SECRET_ID> --format json \
  | jq -r '.data[0].string_value')
# Option B: Set manually from https://tokenfactory.nebius.com:
TF_KEY="v1.xxx..."

# 3. Generate a gateway password
PASSWORD=$(openssl rand -hex 16)
echo "Save this password: $PASSWORD"

# 4. Deploy
nebius ai endpoint create \
  --name openclaw-agent \
  --image ghcr.io/colygon/openclaw-serverless:latest \
  --platform cpu-e2 \
  --preset 2vcpu-8gb \
  --container-port 8080 \
  --container-port 18789 \
  --disk-size 250Gi \
  --env "TOKEN_FACTORY_API_KEY=${TF_KEY}" \
  --env "TOKEN_FACTORY_URL=https://api.tokenfactory.nebius.com/v1" \
  --env "INFERENCE_MODEL=${MODEL}" \
  --env "OPENCLAW_WEB_PASSWORD=${PASSWORD}" \
  --public \
  --ssh-key "$(cat ~/.ssh/id_ed25519.pub 2>/dev/null || echo '')" \
  --format json

# 5. Wait for RUNNING
ENDPOINT_ID=$(nebius ai endpoint get-by-name openclaw-agent --format json | jq -r '.metadata.id')
while true; do
  STATE=$(nebius ai endpoint get $ENDPOINT_ID --format json | jq -r '.status.state')
  echo "Status: $STATE"
  [ "$STATE" = "RUNNING" ] && break
  sleep 10
done

# 6. Get the public IP
IP=$(nebius ai endpoint get $ENDPOINT_ID --format json \
  | jq -r '.status.instances[0].public_ip' | cut -d/ -f1)
echo "Endpoint IP: $IP"

# 7. Verify
curl http://$IP:8080
# Expected: {"status":"healthy","service":"openclaw-serverless","model":"zai-org/GLM-5",...}
```

## Connect to Your Agent

### Via TUI (recommended)
```bash
# SSH tunnel (avoids plaintext WebSocket warning)
ssh -f -N -L 28789:$IP:18789 nebius@$IP

# Connect
openclaw tui --url ws://localhost:28789 --token $PASSWORD

# First time: approve device pairing
ssh nebius@$IP "sudo docker exec \$(sudo docker ps -q | head -1) openclaw devices approve --latest"
```

### Via Browser Dashboard
```
http://<IP>:18789/#token=<PASSWORD>&gatewayUrl=ws://<IP>:18789
```

Note: Browser requires HTTPS for device identity. Use SSH tunnel (`http://localhost:28789`) or set up a reverse proxy with a self-signed cert.

## Deploy NemoClaw (NVIDIA Plugin)

NemoClaw wraps OpenClaw with NVIDIA's enhanced agent capabilities. Ideal for GPU endpoints with local models.

```bash
# Same command, different image:
nebius ai endpoint create \
  --name nemoclaw-agent \
  --image ghcr.io/colygon/nemoclaw-serverless:latest \
  --platform cpu-e2 \
  --preset 2vcpu-8gb \
  --container-port 8080 \
  --container-port 18789 \
  --disk-size 250Gi \
  --env "TOKEN_FACTORY_API_KEY=${TF_KEY}" \
  --env "TOKEN_FACTORY_URL=https://api.tokenfactory.nebius.com/v1" \
  --env "INFERENCE_MODEL=${MODEL}" \
  --env "OPENCLAW_WEB_PASSWORD=${PASSWORD}" \
  --public \
  --ssh-key "$(cat ~/.ssh/id_ed25519.pub 2>/dev/null || echo '')" \
  --format json
```

## Region → Platform Mapping

| Region | Platform | Notes |
|--------|----------|-------|
| `eu-north1` (Finland) | `cpu-e2` | Default region |
| `eu-west1` (Paris) | `cpu-d3` | Different CPU — must match! |
| `us-central1` (US) | `cpu-e2` | US-based workloads |

## Token Factory Models

```bash
# List all available models:
curl -s https://api.tokenfactory.nebius.com/v1/models \
  -H "Authorization: Bearer $TF_KEY" | jq '.data[].id'
```

Common models:
- `zai-org/GLM-5` — Latest GLM, strong reasoning
- `deepseek-ai/DeepSeek-R1-0528` — DeepSeek reasoning model
- `MiniMaxAI/MiniMax-M2.5` — Fast, powerful
- `zai-org/GLM-4.5` — Lighter, faster responses

**Important:** Use Token Factory model IDs (e.g., `zai-org/GLM-5`), NOT HuggingFace IDs (e.g., `THUDM/GLM-4-9B-0414`). Wrong format causes silent 404 errors.

## Store API Key in MysteryBox

```bash
PROJECT_ID=$(nebius config get parent-id)

nebius mysterybox secret create \
  --name token-factory-key \
  --parent-id $PROJECT_ID \
  --secret-version-payload \
    '[{"key":"TOKEN_FACTORY_API_KEY","string_value":"v1.xxx..."}]' \
  --format json
```

## Managing Your Endpoint

```bash
nebius ai endpoint list --format json | jq '.items[] | {name: .metadata.name, state: .status.state}'
nebius ai endpoint stop <ID>      # Pause billing
nebius ai endpoint start <ID>     # Resume
nebius ai endpoint delete <ID>    # Remove
nebius ai endpoint logs <ID> --follow --since 5m
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Health check works but gateway unreachable | Add `--container-port 18789` (both ports needed) |
| "pairing required" | `ssh nebius@<IP> "sudo docker exec $(docker ps -q) openclaw devices approve --latest"` |
| "gateway token mismatch" | Token lost after restart. SSH in and set in config: `openclaw config set gateway.auth.token <password>` |
| 404 on inference | Wrong model ID format. Use `zai-org/GLM-5` not `THUDM/...` |
| "Config invalid - plugins" | Remove `plugins` key from `openclaw.json`. NemoClaw auto-loads via npm. |
| Endpoint won't start | Check platform matches region: `cpu-e2` for eu-north1/us-central1, `cpu-d3` for eu-west1 |
