---
title: IAM & Authentication
description: User and service account management with role-based access control
---

Manage access to Nebius resources using service accounts and role-based access control.

## User Management

List users in organization:
```bash
nebius iam user list --organization my-org
```

Invite user:
```bash
nebius iam user invite \
  --email user@example.com \
  --role member
```

## Service Accounts

For CI/CD, automated tasks, and application access.

Create service account:
```bash
nebius iam service-account create \
  --name ci-deployer \
  --description "GitHub Actions deployment"
```

List service accounts:
```bash
nebius iam service-account list
```

## Access Keys

Generate credentials for service account:

```bash
nebius iam access-key create \
  --service-account-id sa-xyz789
```

Returns:
```
Access Key ID: ak_abc123
Secret Key: sk_xyz789... (shown only once)
```

**Store secret securely:**
```bash
# GitHub Secrets
gh secret set NEBIUS_SECRET_KEY --body "sk_xyz789..."

# Environment file
echo "export NEBIUS_SECRET_KEY=sk_xyz789..." >> ~/.nebius/.env
chmod 600 ~/.nebius/.env
```

List access keys:
```bash
nebius iam access-key list --service-account-id sa-xyz789
```

Delete key (revoke access):
```bash
nebius iam access-key delete --access-key-id ak_abc123
```

## Roles & Permissions

### Built-in Roles

| Role | Permissions |
|------|------------|
| `admin` | Full access to all resources |
| `member` | Deploy and manage resources |
| `developer` | Deploy endpoints/VMs only |
| `viewer` | Read-only access |

### Custom Roles

Create custom role:
```bash
nebius iam role create \
  --name deployment-operator \
  --permissions \
    "ai.endpoint.create" \
    "ai.endpoint.describe" \
    "ai.endpoint.delete"
```

Assign role to service account:
```bash
nebius iam role-binding create \
  --service-account-id sa-xyz789 \
  --role deployment-operator
```

## Resource-Level Access

Restrict service account to specific resources:

```bash
# Allow access only to specific project
nebius iam role-binding create \
  --service-account-id sa-xyz789 \
  --role developer \
  --resource-type project \
  --resource-id my-project
```

## Group Management

Create group:
```bash
nebius iam group create \
  --name ml-team \
  --description "Machine Learning team"
```

Add member:
```bash
nebius iam group member add \
  --group-id ml-team \
  --user-id user-abc123
```

Assign role to group:
```bash
nebius iam role-binding create \
  --group-id ml-team \
  --role developer
```

## Audit Logging

View who accessed what:
```bash
nebius audit-log list \
  --resource-type vm \
  --action DELETE \
  --since 2024-01-01
```

Common events:
- `ResourceCreated`
- `ResourceModified`
- `ResourceDeleted`
- `AccessKeyCreated`
- `RoleBindingCreated`

## Best Practices

- ✅ Use service accounts for automation, not personal accounts
- ✅ Rotate access keys every 90 days
- ✅ Use least-privilege principle
- ✅ Enable audit logging
- ✅ Use groups to manage permissions at scale
- ✅ Review access regularly
- ❌ Don't share access keys
- ❌ Don't commit credentials to git
- ❌ Don't use admin role for routine operations

## Federation (SAML/OIDC)

Enable SSO for your organization:

```bash
nebius iam federation create \
  --name my-saml \
  --type saml \
  --idp-url https://idp.example.com/saml
```

## Multi-Factor Authentication

Enable MFA for user account:
```bash
nebius iam mfa enable
```

Requires TOTP authenticator app.

## Troubleshooting

**"Access denied"**
```bash
# Check your roles
nebius iam whoami

# Check service account permissions
nebius iam role-binding list --service-account-id sa-xyz789
```

**Lost access key**
```bash
# Generate new key
nebius iam access-key create --service-account-id sa-xyz789

# Delete old key if compromised
nebius iam access-key delete --access-key-id ak-old123
```

**Can't invite user**
```bash
# Check organization membership limits
nebius organization describe

# Verify email format
# Ensure user domain is not blocked
```
