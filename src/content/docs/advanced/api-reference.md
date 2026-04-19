---
title: API Reference
description: Direct API access with Go, Python, Terraform, and gRPC
---

Access Nebius services directly via API instead of CLI.

## Authentication

All APIs require authentication via API key:

```bash
# Generate key
nebius iam access-key create --service-account-id sa-xyz789

# Set environment variable
export NEBIUS_API_KEY="ak_abc123:sk_xyz789..."
```

## REST API

Base URL: `https://api.eu-north1.nebius.cloud/v1`

### Create Endpoint

```bash
curl -X POST https://api.eu-north1.nebius.cloud/v1/ai/endpoints \
  -H "Authorization: Bearer $NEBIUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-endpoint",
    "platform": "gpu-h100-sxm",
    "imageUri": "my-registry.nebius.cloud/my-image:latest",
    "replicas": {
      "min": 1,
      "max": 5
    }
  }'
```

### Get Endpoint Status

```bash
curl https://api.eu-north1.nebius.cloud/v1/ai/endpoints/my-endpoint \
  -H "Authorization: Bearer $NEBIUS_API_KEY"
```

Response:
```json
{
  "name": "my-endpoint",
  "state": "RUNNING",
  "ipAddress": "1.2.3.4",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Python SDK

Install:
```bash
pip install nebius-ai
```

Usage:
```python
from nebius import AIClient

client = AIClient(api_key="ak_abc123:sk_xyz789...")

# Create endpoint
endpoint = client.ai.endpoints.create(
    name="my-endpoint",
    platform="gpu-h100-sxm",
    image_uri="my-registry.nebius.cloud/my-image:latest",
    replicas={"min": 1, "max": 5}
)

# Wait for ready
endpoint.wait_until_running()

# Get IP
print(f"IP: {endpoint.ip_address}")

# List endpoints
for ep in client.ai.endpoints.list():
    print(f"{ep.name}: {ep.state}")

# Delete endpoint
endpoint.delete()
```

## Go SDK

Install:
```bash
go get github.com/nebius/nebius-go
```

Usage:
```go
package main

import (
	"context"
	"fmt"
	"github.com/nebius/nebius-go"
)

func main() {
	client := nebius.NewClient("ak_abc123:sk_xyz789...")
	ctx := context.Background()

	// Create endpoint
	endpoint, err := client.AI.Endpoints.Create(ctx, &nebius.CreateEndpointRequest{
		Name:      "my-endpoint",
		Platform:  "gpu-h100-sxm",
		ImageURI:  "my-registry.nebius.cloud/my-image:latest",
		ReplicasMin: 1,
		ReplicasMax: 5,
	})
	if err != nil {
		panic(err)
	}

	// Wait for running
	endpoint.WaitUntilRunning(ctx)

	// Describe
	desc, err := client.AI.Endpoints.Describe(ctx, "my-endpoint")
	fmt.Printf("IP: %s\n", desc.IPAddress)
	
	// List endpoints
	endpoints, _ := client.AI.Endpoints.List(ctx)
	for _, ep := range endpoints.Items {
		fmt.Printf("%s: %s\n", ep.Name, ep.State)
	}
}
```

## Terraform

Install Nebius provider:
```hcl
terraform {
  required_providers {
    nebius = {
      source  = "nebius/nebius"
      version = "~> 1.0"
    }
  }
}

provider "nebius" {
  api_key = var.nebius_api_key
  region  = "eu-north1"
}
```

Create endpoint:
```hcl
resource "nebius_ai_endpoint" "my_endpoint" {
  name       = "my-endpoint"
  platform   = "gpu-h100-sxm"
  image_uri  = "my-registry.nebius.cloud/my-image:latest"
  
  replicas {
    min = 1
    max = 5
  }

  env_vars = {
    LOG_LEVEL = "DEBUG"
  }
}

output "endpoint_ip" {
  value = nebius_ai_endpoint.my_endpoint.ip_address
}
```

Create VM:
```hcl
resource "nebius_compute_vm" "training_vm" {
  name           = "ml-vm"
  image_id       = "ubuntu-22-04"
  machine_type   = "gpu-h100-sxm"
  disk_size      = 200
  ssh_public_key = file("~/.ssh/nebius.pub")
}

output "vm_ip" {
  value = nebius_compute_vm.training_vm.ip_address
}
```

## gRPC

For high-performance applications.

### Generate Client Code

```bash
# Download proto files
git clone https://github.com/nebius/nebius-proto.git

# Generate Python client
python -m grpc_tools.protoc \
  -I nebius-proto \
  --python_out=. \
  --pyi_out=. \
  --grpc_python_out=. \
  nebius-proto/nebius/ai/v1/endpoint.proto
```

### Python gRPC Client

```python
import grpc
from nebius.ai.v1 import endpoint_pb2, endpoint_pb2_grpc

channel = grpc.secure_channel(
    'api.eu-north1.nebius.cloud:443',
    grpc.ssl_channel_credentials()
)
stub = endpoint_pb2_grpc.EndpointServiceStub(channel)

# Create endpoint
request = endpoint_pb2.CreateEndpointRequest(
    name="my-endpoint",
    platform="gpu-h100-sxm",
    image_uri="my-registry.nebius.cloud/my-image:latest"
)

response = stub.CreateEndpoint(request, metadata=[
    ('authorization', f'Bearer {api_key}')
])

print(f"Created: {response.name}")
```

## SDK Documentation

| Language | Docs | Package |
|----------|------|---------|
| Python | [nebius-ai](https://docs.nebius.cloud/python) | `pip install nebius-ai` |
| Go | [nebius-go](https://docs.nebius.cloud/go) | `go get github.com/nebius/nebius-go` |
| Node.js | [nebius-js](https://docs.nebius.cloud/js) | `npm install @nebius/sdk` |

## Rate Limits

- API requests: 100 req/sec per account
- Endpoint creation: 10 per minute
- VM creation: 5 per minute

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad request | Check parameter format |
| 401 | Unauthorized | Verify API key |
| 403 | Forbidden | Check service account permissions |
| 404 | Not found | Verify resource name/ID |
| 429 | Rate limited | Retry with exponential backoff |
| 500 | Server error | Retry; contact support if persistent |

## Best Practices

- ✅ Use gRPC for high-throughput applications
- ✅ Implement retry logic with exponential backoff
- ✅ Cache metadata to reduce API calls
- ✅ Use service accounts for production access
- ✅ Monitor API quota usage
- ❌ Don't hardcode API keys
- ❌ Don't make synchronous API calls in tight loops
