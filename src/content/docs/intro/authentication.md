---
title: Authentication
description: Setting up authentication for Nebius CLI and API access
---

## Overview

To use Nebius services, you need to authenticate with the Nebius API. This guide covers setting up authentication for both the CLI and programmatic API access.

## Nebius CLI Authentication

### 1. Create API Key

Visit the [Nebius Console](https://console.nebius.com) and create an API key:

1. Go to **Profile** → **API Keys**
2. Click **Create API Key**
3. Copy your API key securely
4. Save it in a safe location

### 2. Set Environment Variable

```bash
export NEBIUS_API_KEY="your-api-key"
```

Or add to your shell profile:

```bash
echo 'export NEBIUS_API_KEY="your-api-key"' >> ~/.zshrc
source ~/.zshrc
```

### 3. Verify Authentication

```bash
nebius auth login
nebius project list
```

## Programmatic Authentication

For SDK/API usage:

```python
import nebius

client = nebius.Client(api_key="your-api-key")
```

```go
package main

import "github.com/nebius/go-sdk"

client := nebius.NewClient("your-api-key")
```

## Token Factory Authentication

Token Factory uses separate API keys:

```bash
export TOKEN_FACTORY_API_KEY="your-token-factory-key"
```

See [Token Factory Docs](https://nebius.ai/token-factory) for details.

## Security Best Practices

- **Never commit API keys** to version control
- **Rotate keys regularly** through the Nebius Console
- **Use different keys** for different environments
- **Restrict key permissions** to only needed services
- **Audit key usage** through activity logs

## Troubleshooting

### "Invalid API key"

Verify your key is set correctly:

```bash
echo $NEBIUS_API_KEY
```

### "Unauthorized"

Check key permissions in the Nebius Console.

### "Key expired"

Generate a new API key and update your environment.
