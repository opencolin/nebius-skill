# Mintlify Documentation Setup

This project uses **Mintlify** for beautiful, modern documentation.

## View Locally

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Setup

```bash
# Install Mintlify CLI globally
npm install -g mintlify

# Navigate to project root
cd nebius-skill

# Start dev server
mintlify dev
```

Visit **http://localhost:3000** in your browser.

## Deployment Options

### Option 1: Netlify (Recommended - Free)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repo
   - Netlify auto-detects Mintlify projects

2. **Configure Build Settings**
   - Build command: `mintlify build`
   - Publish directory: `mint`

3. **Deploy**
   - Push to GitHub → Netlify auto-builds
   - Site automatically updates on every commit

**Result:** `https://<your-site>.netlify.app`

### Option 2: Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow prompts to connect GitHub and deploy.

**Result:** `https://<your-site>.vercel.app`

### Option 3: Custom Domain

Point DNS to Netlify/Vercel, then update domain in deployment settings.

## Documentation Structure

```
nebius-skill/
├── mint.json                 # Configuration
├── docs/
│   ├── introduction.mdx      # Getting started
│   ├── quickstart.mdx        # 5-minute setup
│   ├── installation.mdx      # Install CLI
│   ├── authentication.mdx    # Auth methods
│   ├── services.mdx          # Service overview
│   └── README.md             # Docs guide
├── examples/                 # Example deployments
│   ├── deploy-openclaw.md
│   ├── deploy-gpu-vm.md
│   └── deploy-serverless-endpoint.md
└── DOCS.md                   # This file
```

## Editing Documentation

1. **Create or edit** `.mdx` files in `/docs`
2. **Update navigation** in `mint.json` if adding new pages
3. **Test locally** with `mintlify dev`
4. **Push to GitHub** → Auto-deploys

## Features

✨ **Beautiful Design**
- Modern, responsive layout
- Dark/light mode toggle
- Mobile-optimized

🚀 **Developer Experience**
- Search across all docs
- Code syntax highlighting
- API reference support
- Versioning support

📊 **Analytics**
- Track page views
- Monitor user behavior
- See popular sections

## Customization

### Colors

Edit `mint.json`:
```json
"colors": {
  "primary": "#0D9488",
  "light": "#67E8F9",
  "dark": "#06B6D4"
}
```

### Logo & Favicon

Add to `/public`:
```
public/
├── logo/
│   ├── dark.svg
│   └── light.svg
├── favicon.svg
└── background.png
```

Update `mint.json`:
```json
"logo": {
  "dark": "/logo/dark.svg",
  "light": "/logo/light.svg"
}
```

### Navigation

Edit `mint.json` `navigation` section:
```json
"navigation": [
  {
    "group": "Getting Started",
    "pages": ["docs/introduction", "docs/quickstart"]
  }
]
```

## Advanced Features

### API Reference

Add OpenAPI schema to `openapi.json`:
```json
"openapi": "openapi.json"
```

Then reference in `mint.json`:
```json
{
  "group": "API",
  "pages": ["api/endpoints", "api/compute"]
}
```

### Versioning

Update `mint.json`:
```json
"versions": ["v1.2.0", "v1.1.0"]
```

### MDX Components

Use Mintlify components in `.mdx` files:

```mdx
<Card title="Title" icon="rocket" href="/docs/page">
  Description
</Card>

<CardGroup cols={2}>
  <Card>...</Card>
  <Card>...</Card>
</CardGroup>

<Tip>Helpful tip</Tip>
<Warning>Important warning</Warning>
<Error>Error message</Error>
```

## Troubleshooting

### Port 3000 already in use

```bash
mintlify dev --port 3001
```

### Build fails

```bash
# Clear cache and rebuild
rm -rf .mintlify
mintlify dev
```

### Pages not showing

1. Check `mint.json` navigation structure
2. Verify file paths exist
3. Restart dev server

## Resources

- **Mintlify Docs:** [mintlify.com/docs](https://mintlify.com/docs)
- **GitHub Issues:** [Report bugs](https://github.com/mintlify/mintlify/issues)
- **Slack Community:** [Join chat](https://slack.mintlify.com)

## Next Steps

1. ✅ Local setup: `mintlify dev`
2. ✅ Push to GitHub
3. ✅ Deploy to Netlify/Vercel
4. ✅ Share documentation link
5. ✅ Monitor analytics

---

**Questions?** Check [Mintlify docs](https://mintlify.com/docs) or open an issue.
