---
title: Serverless AI Endpoints
description: Deploy ML models and agents with auto-scaling
---

Deploy inference endpoints with automatic scaling and zero DevOps overhead.

## Quick Deploy

```bash
nebius ai endpoint create \
  --name my-endpoint \
  --platform gpu-h100-sxm \
  --image-uri gcr.io/my-project/my-model:latest
```

Monitor deployment:
```bash
nebius ai endpoint describe --name my-endpoint
```

## Supported Platforms

| Platform | GPU | VRAM | Best For |
|----------|-----|------|----------|
| `gpu-h100-sxm` | H100 | 80GB | General inference, code generation |
| `gpu-h200-sxm` | H200 | 141GB | Large models, long context |
| `gpu-b200-sxm` | B200 | 180GB | Next-gen models |
| `cpu-e2` | CPU | 8GB | Light workloads, testing |

## Inference Request

Once endpoint is `RUNNING`:

```bash
ENDPOINT_IP=$(nebius ai endpoint describe --name my-endpoint \
  --format json | jq -r '.status.ip')

curl -X POST http://$ENDPOINT_IP:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 100
  }'
```

## Scaling

Endpoints scale automatically based on load. Configure scaling bounds:

```bash
nebius ai endpoint update \
  --name my-endpoint \
  --min-replicas 1 \
  --max-replicas 10 \
  --target-cpu-utilization 70
```

## Cost Management

**Pay per replica per hour:**
- H100: $2.50/hour
- CPU: $0.10/hour

**Tip:** Use `min-replicas: 0` to scale to zero when idle.

```bash
nebius ai endpoint update \
  --name my-endpoint \
  --min-replicas 0 \
  --max-replicas 5
```

## Health Checks

Endpoints include built-in health monitoring:

```bash
# Health status
curl http://$ENDPOINT_IP:8080/health

# Metrics
curl http://$ENDPOINT_IP:8888/metrics
```

## Limits

- Max request size: 100MB
- Max response time: 5 minutes
- Max concurrent requests: 100 per replica
- Startup time: 1-2 minutes

## Common Issues

**Endpoint stuck in CREATING**
```bash
# Check logs
nebius ai endpoint logs --name my-endpoint --lines 50

# Restart if necessary
nebius ai endpoint restart --name my-endpoint
```

**Out of memory during inference**
- Reduce batch size
- Use smaller model
- Scale to more replicas

**Network timeout**
- Increase timeout: `--request-timeout 300s`
- Check endpoint health: `curl http://$IP:8080/health`
