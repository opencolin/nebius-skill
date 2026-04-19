---
title: Container Registry
description: Private Docker image storage and management
---

Store and manage Docker images in a private registry with built-in access control.

## Setup

List available registries:
```bash
nebius container registry list
```

Create a registry:
```bash
nebius container registry create \
  --name my-registry \
  --region eu-north1
```

## Authentication

**Option 1: Docker login (recommended)**
```bash
nebius container registry auth my-registry | docker login
```

**Option 2: Manual credentials**
```bash
nebius container registry access-key create --registry my-registry
# Returns username and password for docker login
```

## Push Image

```bash
# Build image
docker build -t my-app:latest .

# Tag with registry
docker tag my-app:latest my-registry.nebius.cloud/my-app:latest

# Push to registry
docker push my-registry.nebius.cloud/my-app:latest
```

## Pull Image

```bash
# List images
nebius container registry image list --registry my-registry

# Pull image
docker pull my-registry.nebius.cloud/my-app:latest

# Use in deployment
kubectl set image deployment/my-app \
  app=my-registry.nebius.cloud/my-app:v1.0
```

## Image Management

**List tags:**
```bash
nebius container registry image describe \
  --registry my-registry \
  --name my-app
```

**Delete image:**
```bash
nebius container registry image delete \
  --registry my-registry \
  --name my-app \
  --tag old-version
```

**Delete entire repository:**
```bash
nebius container registry image delete \
  --registry my-registry \
  --name my-app \
  --all-tags
```

## Access Control

Grant team member access:
```bash
nebius container registry access-grant \
  --registry my-registry \
  --user user@example.com \
  --role READER
```

**Roles:**
- `READER`: Pull images only
- `WRITER`: Push and pull images
- `ADMIN`: Manage registry, users, and policies

## S3 Compatibility

Export registry to S3-compatible storage:
```bash
nebius container registry export \
  --registry my-registry \
  --s3-bucket my-backup-bucket \
  --s3-endpoint s3.eu-north1.nebius.cloud
```

## Quotas and Limits

| Limit | Value |
|-------|-------|
| Storage per registry | 1TB |
| Max image size | 100GB |
| Max repositories | 1000 |
| Retention policy | Configurable |

## Garbage Collection

Automatically clean up old images:
```bash
nebius container registry cleanup-policy create \
  --registry my-registry \
  --keep-last-n-tags 10 \
  --delete-untagged-after 7d
```

## Security Best Practices

- ✅ Use specific tags, not `latest`
- ✅ Enable image scanning
- ✅ Restrict access by role
- ✅ Use private registries for proprietary code
- ✅ Scan images for vulnerabilities before pushing
- ❌ Don't store secrets in image layers
- ❌ Don't use overly permissive access policies

## CI/CD Integration

**GitHub Actions:**
```yaml
- name: Push to Registry
  run: |
    echo ${{ secrets.REGISTRY_PASSWORD }} | docker login \
      -u ${{ secrets.REGISTRY_USERNAME }} \
      --password-stdin my-registry.nebius.cloud
    docker push my-registry.nebius.cloud/my-app:${{ github.sha }}
```

**GitLab CI:**
```yaml
push-image:
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD my-registry.nebius.cloud
    - docker push my-registry.nebius.cloud/my-app:$CI_COMMIT_SHA
```

## Troubleshooting

**Authentication failed**
```bash
# Re-authenticate
nebius container registry auth my-registry | docker login

# Verify credentials
docker info | grep Registry
```

**Push timeout**
- Check network: `ping my-registry.nebius.cloud`
- Reduce image size: use multi-stage builds
- Try pushing during off-peak hours

**Image not found**
```bash
# Verify image exists
nebius container registry image list --registry my-registry

# Verify you pulled from correct registry
docker images | grep my-registry
```
