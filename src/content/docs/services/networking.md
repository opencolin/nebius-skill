---
title: VPC Networking
description: Virtual networks and subnets for infrastructure isolation
---

Create isolated networks for your infrastructure with built-in security controls.

## Create VPC

```bash
nebius vpc network create \
  --name my-network \
  --description "Production network" \
  --ipv4-cidr 10.0.0.0/16
```

## Create Subnets

```bash
# Subnet for compute resources
nebius vpc subnet create \
  --name compute-subnet \
  --network my-network \
  --ipv4-cidr 10.0.1.0/24 \
  --region eu-north1

# Subnet for databases
nebius vpc subnet create \
  --name db-subnet \
  --network my-network \
  --ipv4-cidr 10.0.2.0/24 \
  --region eu-north1
```

## Security Groups

Create firewall rules:

```bash
# Allow SSH from office
nebius vpc security-group create \
  --name office-ssh \
  --network my-network \
  --description "SSH from office"

nebius vpc security-group-rule add \
  --security-group office-ssh \
  --direction INGRESS \
  --protocol TCP \
  --port-min 22 \
  --port-max 22 \
  --source-cidr 203.0.113.0/24
```

## Attach to VM

```bash
nebius compute vm create \
  --name my-vm \
  --subnet compute-subnet \
  --security-groups office-ssh,default
```

## Common Rules

**Allow HTTP/HTTPS:**
```bash
nebius vpc security-group-rule add \
  --security-group web-server \
  --direction INGRESS \
  --protocol TCP \
  --port-min 80 \
  --port-max 443 \
  --source-cidr 0.0.0.0/0
```

**Allow database access from app tier:**
```bash
nebius vpc security-group-rule add \
  --security-group database \
  --direction INGRESS \
  --protocol TCP \
  --port-min 5432 \
  --port-max 5432 \
  --source-security-group app-tier
```

## Private Networks (No Public IP)

VMs can operate entirely within private networks:

```bash
nebius compute vm create \
  --name private-vm \
  --subnet db-subnet \
  --no-public-ip
```

Access via bastion host:
```bash
# Bastion VM with public IP
ssh -i ~/.ssh/nebius nebius@bastion.example.com

# Then SSH to private VM from bastion
ssh 10.0.2.10
```

## Route Tables

Customize traffic routing:

```bash
nebius vpc route-table create \
  --name custom-routes \
  --network my-network

nebius vpc route create \
  --route-table custom-routes \
  --destination-cidr 10.1.0.0/16 \
  --next-hop-vpn my-vpn-connection
```

## Peering

Connect two VPCs:

```bash
nebius vpc peering create \
  --name network-peering \
  --network-a my-network \
  --network-b partner-network
```

## VPN Gateway

Connect to on-premises network:

```bash
nebius vpc vpn-gateway create \
  --name my-vpn \
  --network my-network

# Get VPN configuration
nebius vpc vpn-gateway describe --name my-vpn
```

## Best Practices

- ✅ Use `/24` or smaller subnets for isolation
- ✅ Create dedicated security groups per tier
- ✅ Use private networks for databases
- ✅ Implement least-privilege firewall rules
- ✅ Monitor security group changes
- ❌ Don't use `0.0.0.0/0` for database access
- ❌ Don't mix dev/prod in same VPC
- ❌ Don't expose admin ports publicly

## Troubleshooting

**VM can't reach another VM**
```bash
# Check security groups
nebius compute vm describe --name my-vm | grep security-group

# Check if rule exists
nebius vpc security-group-rule list --security-group target-group

# Check route table
nebius vpc route list --route-table default
```

**No internet access from VM**
```bash
# Check if public IP assigned
nebius compute vm describe --name my-vm | grep publicIpAddress

# Check NAT gateway
nebius vpc nat-gateway describe --name my-nat
```
