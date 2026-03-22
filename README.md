# nebius-cloud-skill

A dual-compatible skill for **Claude Code** and **OpenClaw** that enables AI agents to deploy and manage infrastructure on [Nebius AI Cloud](https://nebius.com) via the `nebius` CLI.

## Supported Services

- **Serverless AI Endpoints** - Deploy ML models and agent containers with auto-scaling
- **Compute VMs** - Create GPU/CPU virtual machines (H100, H200, B200, L40S)
- **Managed Kubernetes (mk8s)** - Create clusters with GPU node groups
- **Soperator** - Run Slurm on Kubernetes for HPC/AI training
- **Container Registry** - Build and push Docker images
- **Object Storage** - S3-compatible storage
- **VPC Networking** - Networks, subnets, security groups
- **IAM** - Service accounts, access keys, authentication

## Installation

### Claude Code

Copy the skill to your personal skills directory:

```bash
cp -r . ~/.claude/skills/nebius-cloud/
```

Or for project-level use:

```bash
cp -r . <your-project>/.claude/skills/nebius-cloud/
```

### OpenClaw

Copy to your workspace skills:

```bash
cp -r . ~/.openclaw/workspace/skills/nebius-cloud/
```

## Prerequisites

1. **Nebius CLI** installed and authenticated:
   ```bash
   curl -sSL https://storage.eu-north1.nebius.cloud/cli/install.sh | bash
   nebius init
   ```

2. **Docker** (for building and pushing container images)

3. **kubectl** (for Kubernetes operations)

## Usage

### Claude Code

```
# Auto-triggered when you mention Nebius
Deploy a serverless endpoint on Nebius for my FastAPI app

# Or invoke directly
/nebius-cloud deploy a GPU VM with H200
```

### OpenClaw

The skill activates automatically when you mention Nebius services.

## Project Structure

```
nebius-cloud-skill/
├── SKILL.md                    # Main skill (dual Claude Code + OpenClaw)
├── references/
│   ├── iam-reference.md        # Authentication & IAM commands
│   ├── ai-endpoints-reference.md   # Serverless endpoint commands
│   ├── compute-reference.md    # VM creation & management
│   ├── kubernetes-reference.md # mk8s cluster commands
│   ├── networking-reference.md # VPC, subnet, security groups
│   └── registry-reference.md  # Container registry commands
├── scripts/
│   └── check-nebius-cli.sh     # Pre-flight check script
└── examples/
    ├── deploy-serverless-endpoint.md  # End-to-end serverless deploy
    └── deploy-gpu-vm.md              # End-to-end GPU VM deploy
```

## Credits

Built with reference to the [nemoclaw](https://github.com/colygon/nemoclaw) deployment toolkit and [Nebius AI Cloud documentation](https://docs.nebius.com/cli/).
