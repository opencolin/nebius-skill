---
title: Managed Kubernetes
description: Enterprise Kubernetes clusters with GPU support
---

Deploy production-grade Kubernetes clusters with automatic scaling and GPU support.

## Create Cluster

```bash
nebius mk8s cluster create \
  --name my-cluster \
  --region eu-north1 \
  --network my-vpc
```

Get kubeconfig:
```bash
nebius mk8s cluster kubeconfig --name my-cluster > ~/.kube/config
```

## Node Groups

Create a node group with GPUs:

```bash
nebius mk8s node-group create \
  --name gpu-nodes \
  --cluster my-cluster \
  --machine-type gpu-h100-sxm \
  --disk-size 100 \
  --min-nodes 1 \
  --max-nodes 10 \
  --node-labels workload=gpu
```

Create CPU node group for general workloads:

```bash
nebius mk8s node-group create \
  --name cpu-nodes \
  --cluster my-cluster \
  --machine-type cpu-e2 \
  --disk-size 50 \
  --min-nodes 3 \
  --max-nodes 20
```

## Deploy Application

```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      nodeSelector:
        workload: gpu  # Uses GPU nodes
      containers:
      - name: app
        image: my-registry.nebius.cloud/my-image:latest
        resources:
          requests:
            nvidia.com/gpu: 1
          limits:
            nvidia.com/gpu: 1
EOF
```

## Verify Deployment

```bash
kubectl get nodes
kubectl get pods
kubectl describe node gpu-node-1
```

## Scaling

Clusters scale automatically based on demand.

Configure cluster autoscaler:
```bash
nebius mk8s cluster update \
  --name my-cluster \
  --autoscaling-enabled \
  --scale-up-delay 1m \
  --scale-down-delay 10m
```

## Monitoring

**Install metrics-server** (usually pre-installed):
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.1/components.yaml
```

**View resource usage:**
```bash
kubectl top nodes
kubectl top pods --all-namespaces
```

## Networking

Clusters include:
- Private network isolation
- Built-in DNS
- Service discovery
- Load balancer support

```bash
# Expose service
kubectl expose deployment my-app --type LoadBalancer --port 80
```

## Cost Breakdown

| Component | Cost |
|-----------|------|
| Control plane | $0.50/hour |
| CPU node (H100) | $2.50/hour |
| Network egress | $0.10/GB |
| Persistent volume | $0.05/GB/month |

**Tip:** Use reserved instances for 30%+ savings on long-running clusters.

## Troubleshooting

**Pods pending**
```bash
kubectl describe pod <pod-name>
# Check node resources, affinity rules
```

**Node not ready**
```bash
kubectl describe node <node-name>
kubectl logs -n kube-system kubelet
```

**GPU not detected**
```bash
kubectl get nodes -o json | jq '.items[].status.capacity'
# Should show nvidia.com/gpu: 1 for GPU nodes
```

## Best Practices

- ✅ Use resource requests/limits
- ✅ Deploy monitoring (Prometheus)
- ✅ Use multiple node groups for workload isolation
- ✅ Enable cluster autoscaling
- ✅ Use pod disruption budgets for reliability
- ❌ Don't run workloads on control plane
- ❌ Don't use taint mode without proper toleration understanding
