# Nebius gRPC API Reference

The Nebius CLI wraps the gRPC API. For programmatic access beyond the CLI, you can use the API directly via SDKs or gRPC clients.

## API Endpoint Format

All services follow: `<service_name>.api.nebius.cloud:443`

| Service | Endpoint |
|---|---|
| IAM Tokens | `tokens.iam.api.nebius.cloud:443` |
| IAM Profiles | `cpl.iam.api.nebius.cloud:443` |
| Compute | `compute.api.nebius.cloud:443` |

Full endpoint list: https://github.com/nebius/api/blob/main/endpoints.md

## Authentication

All API calls require: `Authorization: Bearer <access_token>`

### Get a Token (User Account)

```bash
# Via CLI (valid 12 hours)
nebius iam get-access-token
```

### Get a Token (Service Account)

1. Create RSA key pair:
```bash
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -outform PEM -pubkey -out public.pem
```

2. Upload public key to service account via console or CLI
3. Generate JWT signed with private key (RS256, 5-min expiry)
4. Exchange JWT for access token via TokenExchangeService

### Example API Call

```bash
ACCESS_TOKEN=$(nebius iam get-access-token)

grpcurl -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  cpl.iam.api.nebius.cloud:443 \
  nebius.iam.v1.ProfileService/Get
```

## Available SDKs

| Language | Package |
|---|---|
| Go | `github.com/nebius/gosdk` |
| Python | `github.com/nebius/pysdk` |
| CLI | `nebius` (wraps the API) |
| Terraform | Nebius Terraform Provider |

## Proto Definitions

All service definitions are in: https://github.com/nebius/api

Key directories:
- `nebius/iam/v1/` - IAM services
- `nebius/compute/v1/` - Compute services
- `nebius/common/v1/` - Common operations

## API Features

- **Idempotency**: Use `X-Idempotency-Key` header for safe retries
- **Field masks**: Use `X-ResetMask` header for partial updates
- **Async operations**: Long operations return an Operation object to poll
- **Error handling**: Errors follow `google.rpc.Status` format

## CLI Exit Codes (for error handling)

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Unknown error |
| 2 | Invalid input (bad flags, args) |
| 3 | Invalid value |
| 4 | Configuration issue |
| 7 | Authentication failure |
| 13 | Not found |
| 14 | Already exists |
| 15 | Permission denied |
| 16 | Resource exhausted (quota) |
| 24 | Quota failure |
| 25 | Not enough resources |

Use exit codes to handle errors programmatically in scripts.
