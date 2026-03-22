# IAM & Authentication Reference

## Initial Setup

```bash
# Interactive setup (recommended for first time)
nebius init

# Browser-based OAuth login
nebius iam login

# Verify authentication
nebius iam whoami --format json

# Get current access token
nebius iam get-access-token

# Get user display name (note: it's deeply nested)
nebius iam whoami --format json | jq -r '.user_profile.attributes.name'
# NOT .identity.display_name — that field doesn't exist
```

## Profiles

```bash
# Create a profile (interactive — not scriptable)
nebius profile create --name <profile-name>

# For scripted/automated profile creation, write directly to config:
# Edit ~/.nebius/config.yaml and add under "profiles:":
#   my-profile:
#     endpoint: api.nebius.cloud
#     auth-type: federation
#     federation-endpoint: auth.nebius.com
#     parent-id: <project-id>
#     tenant-id: <tenant-id>

# List profiles
nebius profile list

# Set active profile
nebius config set profile <profile-name>

# Set project ID for current profile
nebius config set parent-id <PROJECT_ID>
```

Create a separate profile for each region/project:

```bash
nebius profile create --name eu-north1-prod
nebius config set parent-id <PROJECT_ID>
```

## Projects

```bash
# List all projects
nebius iam project list --format json

# List projects under a specific tenant
nebius iam project list --parent-id <TENANT_ID> --format json

# Create a project
nebius iam project create --name "<name>" --parent-id <TENANT_ID> --format json

# Get project details
nebius iam project get --id <PROJECT_ID> --format json
```

## Service Accounts

```bash
# Create service account
nebius iam service-account create \
  --name <sa-name> \
  --parent-id <PROJECT_ID> \
  --format json

# List service accounts
nebius iam service-account list --format json

# Generate auth key pair for service account
nebius iam auth-public-key generate \
  --parent-id <SERVICE_ACCOUNT_ID> \
  --format json > sa-key.json

# Create access key
nebius iam access-key create \
  --parent-id <SERVICE_ACCOUNT_ID> \
  --format json
```

## Static Keys (for S3-compatible access)

```bash
# Issue a static key (for Object Storage S3 access)
nebius iam static-key issue \
  --parent-id <SERVICE_ACCOUNT_ID> \
  --format json
```

## Cross-Region Notes

- Each region may require its own project
- Use `nebius iam project list --parent-id <TENANT_ID>` to see all projects across regions
- Profiles should be region-specific for clarity
