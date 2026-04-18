# Documentation Structure

This directory contains the Mintlify documentation for nebius-skill.

## Pages

### Getting Started
- `introduction.mdx` - Overview and key features
- `quickstart.mdx` - 5-minute setup guide
- `installation.mdx` - CLI and tool installation
- `authentication.mdx` - Credential setup and auth methods

### Core Concepts
- `services.mdx` - Overview of all Nebius services
- `regions-platforms.mdx` - GPU types and regions (if added)
- `conventions.mdx` - CLI patterns and conventions (if added)
- `security.mdx` - Security best practices (if added)

### Services (Deep Dives)
- `services/endpoints.mdx` - Serverless endpoints details (if added)
- `services/compute.mdx` - GPU/CPU VM details (if added)
- `services/kubernetes.mdx` - Kubernetes cluster details (if added)
- etc.

### Advanced
- `api-sdks.mdx` - Python, Go, Terraform examples (if added)
- `troubleshooting.mdx` - Common issues and solutions (if added)
- `gotchas.mdx` - Lessons learned and pitfalls (if added)
- `safety-rules.mdx` - Best practices (if added)

## Building Locally

Install Mintlify:
```bash
npm install -g mintlify
```

Run locally:
```bash
mintlify dev
```

Visit http://localhost:3000

## Deploying

### Netlify (Recommended)

```bash
# Connect GitHub repo to Netlify
# Mintlify automatically builds on push
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Self-Hosted

```bash
mintlify build
# Upload /mint directory to web server
```

## Configuration

See `../mint.json` for:
- Navigation structure
- Colors and branding
- Social links
- Versioning

## Assets

Logo and favicon should go in `/public`:
- `logo/dark.svg`
- `logo/light.svg`
- `favicon.svg`
- `background.png`

## Contributing

1. Create `.mdx` files in appropriate directories
2. Update `mint.json` navigation to include new pages
3. Test locally with `mintlify dev`
4. Push to GitHub for auto-deployment
