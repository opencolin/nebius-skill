---
title: Common Gotchas
description: Subtle issues and gotchas to watch out for
---

## API & Configuration

### Region Endpoints

Forgetting to change the endpoint for different regions:

```bash
# ❌ Wrong - using EU endpoint in US region
export NEBIUS_API_ENDPOINT="https://api.nebius.com/v1"
nebius ai endpoint create --region us-central1  # Will fail

# ✅ Correct - matching endpoint to region
export NEBIUS_API_ENDPOINT="https://api.nebius.us-central1.nebius.com/v1"
```

### Token Expiration

API tokens expire even after successful authentication:

```bash
# ✅ Refresh token before use
nebius auth refresh

# ✅ Check token expiry
nebius auth token-info
```

## Resource Management

### Instance Type Availability

Not all instance types are available in all regions:

```bash
# ❌ May fail in some regions
nebius ai endpoint create --platform gpu-h100

# ✅ Check availability first
nebius platform list --region us-central1
```

### Spot Instance Interruptions

Spot instances can be interrupted anytime - use replicas for availability:

```bash
# ❌ Single replica with spot
nebius ai endpoint create --replicas 1 --spot

# ✅ Multiple replicas with auto-restart
nebius ai endpoint create --replicas 3 --spot --auto-restart
```

## Networking & Security

### Firewall Rules Default to Deny

When creating a new VPC, traffic is blocked by default:

```bash
# ✅ Explicitly allow needed traffic
nebius network security-group rule add \
  --protocol tcp \
  --port 8080 \
  --cidr 0.0.0.0/0
```

### Data Transfer Costs

Cross-region data transfer is expensive:

```bash
# ❌ Expensive
nebius ai endpoint create --region us-central1
# ... accessing data from eu-north1

# ✅ Keep data in same region
nebius storage bucket create --region us-central1
```

## Kubernetes Issues

### Scaling During Updates

Scaling while updating your deployment can cause issues:

```bash
# ❌ Don't scale and update simultaneously
nebius kubernetes scale deployment my-app --replicas 5
nebius kubernetes apply deployment-update.yaml

# ✅ Wait for previous operation
nebius kubernetes wait deployment my-app --condition=Available
nebius kubernetes apply deployment-update.yaml
```

### Node Pool Unavailability

Deleting node pools without draining first:

```bash
# ❌ Will disrupt workloads
nebius kubernetes node-pool delete node-pool-1

# ✅ Drain before deletion
nebius kubernetes drain node-pool-1 --ignore-daemonsets
nebius kubernetes node-pool delete node-pool-1
```

## Storage Issues

### Unattached Volumes Accumulate

Deleting an instance leaves volumes behind:

```bash
# ✅ Clean up unused volumes
nebius storage volume list
nebius storage volume delete volume-id

# ✅ Or set auto-delete on creation
nebius ai endpoint create --auto-delete-volumes
```

### Snapshot Retention

Snapshots aren't automatically deleted:

```bash
# ✅ Clean up old snapshots
nebius storage snapshot list --older-than 90d --delete
```

## Model & Inference Issues

### Model Card Compatibility

Models may have specific requirement versions:

```bash
# ✅ Check model requirements
nebius ai model info llama2-70b

# ✅ Install correct versions
pip install -r requirements-llama2-70b.txt
```

### Token Limits

Different models have different token limits:

```bash
# ❌ May exceed limit
nebius ai completion \
  --model gpt-3.5 \
  --max-tokens 10000  # Only supports 4096

# ✅ Check limits first
nebius ai model info gpt-3.5 --field max_tokens
```

## Monitoring & Debugging

### Logs Not Available Immediately

It takes a few seconds for logs to appear:

```bash
# ❌ Checking immediately after deploy
nebius logs get endpoint-name

# ✅ Wait a moment
sleep 2 && nebius logs get endpoint-name
```

### Metrics Aggregation Delay

Metrics are aggregated every minute (not real-time):

```bash
# ✅ Be aware of 1-minute delay
nebius metrics get endpoint-name --since 5m
```

## Billing & Cost

### Pre-paid Vs. Pay-as-you-go

Mixing billing models can be confusing:

```bash
# ✅ Be clear about your billing model
nebius billing info
nebius billing estimate --resource-type gpu-a40 --hours 100
```

### Data Transfer Charges

Easy to forget about egress charges:

```bash
# ✅ Monitor outbound data
nebius billing costs --group-by data-transfer

# ✅ Use content delivery networks
# Cache at edge to reduce transfer
```

## Best Practices Summary

1. **Always specify region explicitly**
2. **Test in staging before production**
3. **Monitor costs from day one**
4. **Use replicas for high availability**
5. **Keep resources in same region**
6. **Delete unused resources regularly**
7. **Implement proper logging/monitoring**
8. **Rotate API keys frequently**
9. **Document your infrastructure**
10. **Have a disaster recovery plan**
