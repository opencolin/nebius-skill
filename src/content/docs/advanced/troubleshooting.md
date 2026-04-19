---
title: Troubleshooting
description: Common issues and solutions for Nebius services
---

## Authentication Issues

### "Invalid API key"

**Cause**: API key is incorrect, expired, or not set

**Solution**:
```bash
# Verify key is set
echo $NEBIUS_API_KEY

# Create a new key in Nebius Console
# Update environment variable
export NEBIUS_API_KEY="new-key"
```

### "UNAUTHENTICATED" Error

**Cause**: Missing or invalid authentication token

**Solution**:
```bash
nebius auth login
# Follow interactive prompts to authenticate
```

## Deployment Issues

### Endpoint Creation Fails

**Error**: "Image not found in registry"

**Solution**:
```bash
# Verify image exists
nebius registry image list

# Push image first
docker push your-registry/image:tag
```

**Error**: "Resource quota exceeded"

**Solution**:
- Check current usage: `nebius quota show`
- Request quota increase in Nebius Console
- Delete unused resources

### Kubernetes Issues

**Pod not starting**

```bash
# Check pod status
nebius kubernetes pod list --cluster my-cluster

# View pod logs
nebius kubernetes logs pod-name --cluster my-cluster

# Describe pod for events
nebius kubernetes describe pod-name --cluster my-cluster
```

**Persistent volume issues**

```bash
# List volumes
nebius storage volume list

# Check volume status
nebius storage volume status volume-name

# Resize if needed
nebius storage volume resize volume-name --size 1T
```

## Networking Issues

### Cannot Connect to Endpoint

**Solution**:
```bash
# Verify endpoint is running
nebius ai endpoint status my-endpoint

# Check security group rules
nebius network security-group rules --sg-id sg-xxx

# Test connectivity
curl -X GET https://my-endpoint-url/health
```

### DNS Resolution Fails

**Solution**:
```bash
# Check DNS configuration
nslookup my-endpoint.nebius.com

# Test with internal DNS
nslookup my-endpoint.nebius.internal
```

## Performance Issues

### High Latency

**Check**:
- Model size and inference time
- Network latency to endpoint
- Instance type capabilities
- Concurrent request load

**Solution**:
```bash
# Scale up instance
nebius ai endpoint scale --name my-endpoint --replicas 3

# Use GPU if available
nebius ai endpoint update --platform gpu-a40
```

### Out of Memory

**Error**: "OOM Killer"

**Solution**:
```bash
# Increase instance memory
nebius ai endpoint update --memory 64G

# Or use larger instance type
nebius ai endpoint update --platform cpu-m3
```

## Monitoring & Debugging

### Check Endpoint Logs

```bash
nebius logs stream endpoint-name
```

### View Metrics

```bash
nebius metrics get endpoint-name --metric cpu_usage
nebius metrics get endpoint-name --metric memory_usage
```

### Debugging Kubernetes

```bash
# Enable debug logging
nebius kubernetes debug pod-name

# Get detailed events
nebius kubernetes events --cluster my-cluster
```

## Cost Issues

### Unexpected High Bills

**Check**:
1. Unused resources running (stop/delete them)
2. Large data transfers out of region
3. Spot instance interruptions (increased costs)
4. Storage growth

**Solution**:
```bash
# Review resource costs
nebius billing costs --group-by resource

# Set budget alerts
nebius billing alert --threshold $1000
```

## Getting Help

- Check [Nebius Documentation](https://docs.nebius.com)
- Search [GitHub Issues](https://github.com/nebius)
- Join [Nebius Community](https://nebius.ai/community)
- Contact [Support](https://support.nebius.com)
