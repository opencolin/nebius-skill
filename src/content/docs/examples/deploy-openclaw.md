---
title: Deploy OpenClaw Endpoint
description: Deploy an OpenClaw agent with GPU acceleration
---

Deploy a production OpenClaw inference endpoint with auto-scaling.

## Prerequisites

- Nebius CLI configured
- Docker credentials (if using private image)
- At least $10 credit remaining

## Step-by-Step

### 1. Prepare Model Image

```bash
# Build or pull your OpenClaw image
docker build -t my-openclaw:latest .

# Tag for registry
docker tag my-openclaw:latest my-registry.nebius.cloud/my-openclaw:latest

# Login to registry
nebius container registry auth my-registry | docker login

# Push image
docker push my-registry.nebius.cloud/my-openclaw:latest
```

### 2. Create Endpoint

```bash
nebius ai endpoint create \
  --name openclaw-prod \
  --platform gpu-h100-sxm \
  --image-uri my-registry.nebius.cloud/my-openclaw:latest \
  --replicas-min 1 \
  --replicas-max 5 \
  --port 8080
```

### 3. Monitor Deployment

```bash
# Watch status
while true; do
  status=$(nebius ai endpoint describe --name openclaw-prod \
    --format json | jq -r '.status.state')
  echo "Status: $status"
  [ "$status" = "RUNNING" ] && break
  sleep 10
done

echo "Endpoint is ready!"
```

### 4. Get Endpoint IP

```bash
IP=$(nebius ai endpoint describe --name openclaw-prod \
  --format json | jq -r '.status.ipAddress')
echo "Endpoint IP: $IP"
```

### 5. Test Inference

```bash
curl -X POST http://$IP:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openclaw",
    "messages": [
      {
        "role": "user",
        "content": "What is machine learning?"
      }
    ],
    "max_tokens": 200
  }'
```

### 6. Configure Auto-scaling

```bash
nebius ai endpoint update \
  --name openclaw-prod \
  --target-cpu-utilization 70 \
  --scale-up-delay 1m \
  --scale-down-delay 5m
```

## Monitoring

Check metrics:
```bash
curl http://$IP:8888/metrics | grep -E 'inference_latency|gpu_utilization'
```

View logs:
```bash
nebius ai endpoint logs --name openclaw-prod --lines 100
```

## Cost Estimation

Running for 24 hours:
```
1 replica (min): 1 × $2.50/hour × 24 = $60
5 replicas (peak): 5 × $2.50/hour × 2 = $25
Estimated daily: ~$85
```

Cost optimization:
```bash
# Use min-replicas: 0 to scale to zero when idle
nebius ai endpoint update \
  --name openclaw-prod \
  --replicas-min 0 \
  --replicas-max 5
```

## Troubleshooting

**Endpoint stuck in CREATING**
```bash
# Check logs
nebius ai endpoint logs --name openclaw-prod

# Restart endpoint
nebius ai endpoint restart --name openclaw-prod
```

**Inference returns 500 error**
```bash
# Check if image has all dependencies
docker run -it my-registry.nebius.cloud/my-openclaw:latest /bin/bash

# Verify CUDA is available
nvidia-smi

# Check application logs
nebius ai endpoint logs --name openclaw-prod --level ERROR
```

**High latency (>2 seconds)**
```bash
# Check GPU utilization
curl http://$IP:8888/metrics | grep gpu_utilization_percent

# Increase replicas
nebius ai endpoint update \
  --name openclaw-prod \
  --replicas-min 3 \
  --replicas-max 10

# Profile inference time
curl -w "Time: %{time_total}s\n" http://$IP:8080/v1/models
```

## Cleanup

Delete endpoint and free resources:
```bash
nebius ai endpoint delete --name openclaw-prod
```

## Next Steps

- [Kubernetes](/docs/services/kubernetes/) for multi-node deployment
- [Monitoring](/docs/advanced/monitoring/) for production observability
- [API Reference](/docs/advanced/api-reference/) for OpenClaw client SDKs
