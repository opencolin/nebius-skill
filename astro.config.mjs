import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://example.com',
	integrations: [
		starlight({
			title: 'Nebius Skill',
			description: 'Deploy and manage infrastructure on Nebius AI Cloud using Claude Code',
			social: [
				{ label: 'GitHub', href: 'https://github.com/opencolin/nebius-skill', icon: 'github' },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', link: '/intro' },
						{ label: 'Quickstart', link: '/intro/quickstart' },
						{ label: 'Installation', link: '/intro/installation' },
						{ label: 'Authentication', link: '/intro/authentication' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Services', link: '/core-concepts/services' },
						{ label: 'Regions & Platforms', link: '/core-concepts/regions' },
						{ label: 'Conventions', link: '/core-concepts/conventions' },
						{ label: 'Safety & Best Practices', link: '/core-concepts/safety' },
					],
				},
				{
					label: 'Services',
					items: [
						{ label: 'AI Endpoints', link: '/services/endpoints' },
						{ label: 'Compute VMs', link: '/services/compute' },
						{ label: 'Kubernetes', link: '/services/kubernetes' },
						{ label: 'Container Registry', link: '/services/registry' },
						{ label: 'Networking', link: '/services/networking' },
						{ label: 'IAM', link: '/services/iam' },
					],
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Deploy OpenClaw', link: '/examples/openclaw' },
						{ label: 'Deploy GPU VM', link: '/examples/gpu-vm' },
						{ label: 'Deploy Serverless', link: '/examples/serverless' },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ label: 'API & SDKs', link: '/advanced/api-sdks' },
						{ label: 'Troubleshooting', link: '/advanced/troubleshooting' },
						{ label: 'Common Gotchas', link: '/advanced/gotchas' },
					],
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
