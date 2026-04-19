import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://example.com',
	integrations: [
		starlight({
			title: 'Nebius Skill',
			description: 'Deploy and manage infrastructure on Nebius AI Cloud using Claude Code',
			logo: {
				src: './src/assets/logo.svg',
				alt: 'Nebius Skill Logo',
			},
			social: {
				github: 'https://github.com/opencolin/nebius-skill',
				slack: 'https://slack.com',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'intro' },
						{ label: 'Quickstart', slug: 'quickstart' },
						{ label: 'Installation', slug: 'installation' },
						{ label: 'Authentication', slug: 'authentication' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Services', slug: 'services' },
						{ label: 'Regions & Platforms', slug: 'regions' },
						{ label: 'Conventions', slug: 'conventions' },
						{ label: 'Safety Rules', slug: 'safety' },
					],
				},
				{
					label: 'Services',
					collapsed: false,
					items: [
						{ label: 'AI Endpoints', slug: 'services/endpoints' },
						{ label: 'Compute VMs', slug: 'services/compute' },
						{ label: 'Kubernetes', slug: 'services/kubernetes' },
						{ label: 'Container Registry', slug: 'services/registry' },
						{ label: 'Networking', slug: 'services/networking' },
						{ label: 'IAM', slug: 'services/iam' },
					],
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Deploy OpenClaw', slug: 'examples/openclaw' },
						{ label: 'Deploy GPU VM', slug: 'examples/gpu-vm' },
						{ label: 'Deploy Serverless', slug: 'examples/serverless' },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ label: 'API & SDKs', slug: 'advanced/api-sdks' },
						{ label: 'Troubleshooting', slug: 'advanced/troubleshooting' },
						{ label: 'Common Gotchas', slug: 'advanced/gotchas' },
					],
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#0D9488',
					},
				},
			],
		}),
	],
});
