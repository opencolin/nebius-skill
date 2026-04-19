---
title: Troubleshooting
description: Common issues and solutions
---

Solutions for common Nebius problems.

## Installation Issues

### "nebius: command not found"

```bash
# Check if installed
which nebius

# Add to PATH
export PATH="$HOME/.nebius/bin:$PATH"

# Permanently (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH="$HOME/.nebius/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### "Permission denied" on macOS

```bash
# Allow installer
sudo spctl --add-exemption /path/to/installer

# Or remove quarantine flag
xattr -d com.apple.quarantine ~/.nebius/bin/nebius
```

## Authentication Issues

### "Invalid credentials" / "Unauthorized"

```bash
# Clear old config
rm -rf ~/.nebius/config

# Re-authenticate
nebius profile create

# Verify
nebius iam whoami
```

### "Access denied" to resource

Check service account permissions:
```bash
# Get service account details
nebius iam service-account get --id sa-xyz789

# List role bindings
nebius iam role-binding list --service-account-id sa-xyz789

# Grant permission
nebius iam role-binding create \
  --service-account-id sa-xyz789 \
  --role developer
```

### API key not working in scripts

```bash
# Verify key format
echo "NEBIUS_API_KEY=$NEBIUS_API_KEY"  # Should be ak_xxx:sk_xxx

# Test authentication
curl -H "Authorization: Bearer $NEBIUS_API_KEY" \
  https://api.eu-north1.nebius.cloud/v1/iam/whoami

# If 401, try re-creating key
nebius iam access-key create --service-account-id sa-xyz789
```

## Endpoint Issues

### Endpoint stuck in CREATING

```bash
# Check logs
nebius ai endpoint logs --name my-endpoint --lines 50

# Common cause: image not found or no CUDA support
docker inspect my-image | grep -i "CUDA\|GPU"

# Restart endpoint
nebius ai endpoint restart --name my-endpoint

# If still stuck, delete and recreate
nebius ai endpoint delete --name my-endpoint
```

### High latency (>5 seconds per request)

```bash
# Check GPU utilization
curl http://$ENDPOINT_IP:8888/metrics | grep gpu_utilization

# Check queue depth
curl http://$ENDPOINT_IP:8888/metrics | grep queue_depth

# Solutions:
# - Increase min replicas
nebius ai endpoint update --name my-endpoint --replicas-min 2

# - Check if model is too large for GPU memory
nvidia-smi --query-gpu=memory.total --format=csv

# - Reduce batch size in inference
```

### Out of memory errors

```bash
# Get GPU memory info
curl http://$ENDPOINT_IP:8888/metrics | grep memory

# Solutions:
# 1. Use smaller GPU
nebius ai endpoint update --name my-endpoint --platform gpu-l40s-pcie

# 2. Optimize model (quantization)
pip install bitsandbytes  # For 8-bit quantization

# 3. Use larger GPU
nebius ai endpoint update --name my-endpoint --platform gpu-h200-sxm
```

### "Connection refused" when accessing endpoint

```bash
# Verify endpoint is running
nebius ai endpoint describe --name my-endpoint

# Get correct IP
IP=$(nebius ai endpoint describe --name my-endpoint \
  --format json | jq -r '.status.ipAddress')

# Test connectivity
ping $IP
nc -zv $IP 8080

# If no response, endpoint may still be starting
# Wait a few more minutes
```

## VM Issues

### Can't SSH to VM

```bash
# Verify key permissions
ls -la ~/.ssh/nebius
# Should be: -rw------- (600)
chmod 600 ~/.ssh/nebius

# Test SSH connectivity
ssh -v -i ~/.ssh/nebius nebius@$IP

# If "permission denied", SSH key might not be correctly configured
# Recreate VM with correct key
nebius compute vm delete --name my-vm

nebius compute vm create \
  --name my-vm \
  --ssh-key "$(cat ~/.ssh/nebius.pub)"
```

### VM slow or unresponsive

```bash
# Check resource utilization
free -h              # Memory
df -h                # Disk space
top -b -n 1         # CPU

# If out of disk space
du -sh /*           # Find large directories
rm -rf /tmp/*       # Clean temp files

# If high memory usage
kill -9 $(pgrep -f "heavy-process")
```

### GPU not detected in VM

```bash
# Check NVIDIA drivers
nvidia-smi

# If not found, install drivers
sudo apt update
sudo apt install -y nvidia-driver-545

# Reboot to apply
sudo reboot
```

### High costs / Unexpected charges

```bash
# List running VMs
nebius compute vm list

# Check hours they've been running
nebius compute vm describe --name my-vm | grep createdAt

# Stop unused VMs
nebius compute vm stop --name unused-vm

# Or delete
nebius compute vm delete --name unused-vm
```

## Kubernetes Issues

### Cluster stuck in CREATING

```bash
# Check logs
nebius mk8s cluster logs --name my-cluster --lines 50

# Verify network exists
nebius vpc network describe --name my-vpc

# Delete and recreate cluster
nebius mk8s cluster delete --name my-cluster
```

### Nodes not ready

```bash
# Check node status
kubectl get nodes -o wide

# Describe problematic node
kubectl describe node node-1

# Check kubelet logs
kubectl logs -n kube-system kubelet

# Solutions:
# - Wait 5 minutes for node to stabilize
# - Check security groups (port 10250 must be open)
# - Recreate node group
nebius mk8s node-group delete --name gpu-nodes
nebius mk8s node-group create --name gpu-nodes --machine-type gpu-h100-sxm
```

### Pods not starting

```bash
# Get pod details
kubectl describe pod my-pod

# Check events
kubectl get events

# Common causes:
# 1. Image not found
kubectl set image deployment/my-app app=correct-image:latest

# 2. Resource constraints
kubectl describe node  # Check available resources

# 3. Wrong image registry credentials
kubectl create secret docker-registry my-secret \
  --docker-server=my-registry.nebius.cloud \
  --docker-username=user \
  --docker-password=token

# 4. Port already in use
netstat -tln | grep 8080
```

### GPU not available in cluster

```bash
# Check GPU node labels
kubectl get nodes -L accelerator

# Check if GPU resource available
kubectl describe node gpu-node-1 | grep gpu

# Add node affinity to pod
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  nodeSelector:
    accelerator: nvidia-gpu
  containers:
  - name: app
    image: my-image
    resources:
      limits:
        nvidia.com/gpu: 1
EOF
```

## Registry Issues

### Docker login fails

```bash
# Re-authenticate
nebius container registry auth my-registry | docker login

# Verify credentials stored
cat ~/.docker/config.json | jq '.auths'

# Manual login
docker login my-registry.nebius.cloud -u $USERNAME -p $PASSWORD
```

### Push/pull timeout

```bash
# Check network connectivity
ping my-registry.nebius.cloud

# Check if rate limited
# Wait 1 minute and retry

# Try with retry logic
for i in {1..5}; do
  docker push my-registry.nebius.cloud/my-image:latest && break
  sleep $((i * 10))
done
```

### Image not found after push

```bash
# Verify image was pushed
nebius container registry image list --registry my-registry

# Verify correct tag used
docker tag my-image:latest my-registry.nebius.cloud/my-image:latest

# Verify correct image pulled
docker pull my-registry.nebius.cloud/my-image:latest
```

## Networking Issues

### Can't reach VM from outside

```bash
# Check if public IP assigned
nebius compute vm describe --name my-vm | grep publicIpAddress

# If none, assign one
nebius compute vm update --name my-vm --public-ip

# Check security groups
nebius vpc security-group-rule list --security-group default

# Allow SSH
nebius vpc security-group-rule add \
  --security-group default \
  --direction INGRESS \
  --protocol TCP \
  --port 22 \
  --source-cidr 0.0.0.0/0
```

### VMs can't communicate

```bash
# Check subnet is same
nebius compute vm describe --name vm1 | grep subnet
nebius compute vm describe --name vm2 | grep subnet

# Check security groups allow internal traffic
nebius vpc security-group-rule add \
  --security-group internal \
  --direction INGRESS \
  --protocol TCP \
  --port 0 \
  --port 65535 \
  --source-security-group internal

# Test connectivity from vm1
ssh -i ~/.ssh/nebius nebius@$IP1
ping 10.0.1.10  # vm2 private IP
```

## General Debugging

### Enable verbose logging

```bash
# CLI debug mode
nebius --debug ai endpoint create ...

# Set log level
export NEBIUS_LOG_LEVEL=DEBUG

# Python SDK debugging
import logging
logging.basicConfig(level=logging.DEBUG)

# Terraform debug
export TF_LOG=DEBUG
terraform apply
```

### Collect diagnostic information

```bash
# System info
uname -a
nebius version

# Authentication
nebius iam whoami

# Resources
nebius ai endpoint list
nebius compute vm list
nebius mk8s cluster list

# Recent operations
nebius audit-log list --limit 20
```

### Contact Support

When contacting Nebius support, include:
```bash
# Save diagnostic info
{
  nebius version
  nebius iam whoami
  nebius audit-log list --limit 50
  nebius ai endpoint logs --name problematic-resource --lines 100
} > support-info.txt

# Attach to support ticket
```
