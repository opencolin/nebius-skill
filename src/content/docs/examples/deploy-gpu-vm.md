---
title: Deploy GPU VM for Training
description: Launch a GPU VM with PyTorch and monitoring
---

Set up a GPU VM for model training with all dependencies pre-installed.

## Prerequisites

- SSH key generated: `ssh-keygen -t ed25519 -f ~/.ssh/nebius`
- At least $20 credit remaining
- 100GB free local disk for training data

## Step-by-Step

### 1. Create VM

```bash
nebius compute vm create \
  --name ml-training-vm \
  --image-id ubuntu-22-04 \
  --machine-type gpu-h100-sxm \
  --disk-type network-ssd \
  --disk-size 200 \
  --ssh-key "$(cat ~/.ssh/nebius.pub)" \
  --region eu-north1
```

### 2. Get IP Address

```bash
IP=$(nebius compute vm describe --name ml-training-vm \
  --format json | jq -r '.networkInterfaces[0].primaryIpAddress')
echo "VM IP: $IP"
```

### 3. SSH Into VM

```bash
ssh -i ~/.ssh/nebius nebius@$IP

# Verify GPU is available
nvidia-smi
```

Expected output:
```
+-------------------------------------------------------+
| NVIDIA-SMI 545.23.06    Driver Version: 545.23.06   |
|-------------------------------+----------------------+
| GPU Name        Persistence-M| Bus-Id        Disp.A |
| H100 SXM        Off          | 00:1E.0          Off |
+-------------------------------------------------------+
```

### 4. Install Dependencies

On the VM, install training tools:

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv

# Create virtual environment
python3 -m venv ~/venv
source ~/venv/bin/activate

# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install training tools
pip install jupyter pandas matplotlib scikit-learn transformers
```

### 5. Verify GPU Access

```bash
python3 << 'EOF'
import torch
print(f"GPU available: {torch.cuda.is_available()}")
print(f"GPU device: {torch.cuda.get_device_name(0)}")
print(f"GPU memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
EOF
```

### 6. Start Training

Create training script:

```bash
cat > ~/train.py << 'EOF'
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Training on: {device}")

# Dummy data
X = torch.randn(10000, 784)
y = torch.randint(0, 10, (10000,))
dataset = TensorDataset(X, y)
dataloader = DataLoader(dataset, batch_size=256)

# Simple model
model = nn.Sequential(
    nn.Linear(784, 512),
    nn.ReLU(),
    nn.Linear(512, 10)
).to(device)

optimizer = torch.optim.Adam(model.parameters())
criterion = nn.CrossEntropyLoss()

# Training loop
for epoch in range(5):
    total_loss = 0
    for batch_X, batch_y in dataloader:
        batch_X, batch_y = batch_X.to(device), batch_y.to(device)
        
        optimizer.zero_grad()
        output = model(batch_X)
        loss = criterion(output, batch_y)
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
    
    print(f"Epoch {epoch+1}: Loss = {total_loss/len(dataloader):.4f}")

print("Training complete!")
EOF

# Run training
source ~/venv/bin/activate
python3 ~/train.py
```

### 7. Monitor GPU

While training, in another terminal:

```bash
# SSH to VM
ssh -i ~/.ssh/nebius nebius@$IP

# Monitor GPU in real-time
watch -n 1 nvidia-smi
```

Watch for:
- GPU Utilization: Should be >90%
- Memory: Growing as training progresses
- Temperature: Should stay <80°C

### 8. Transfer Results

Copy trained model back to your machine:

```bash
# From your local machine
scp -i ~/.ssh/nebius nebius@$IP:~/model.pt ./model_trained.pt
```

Or use a volume for persistent storage:

```bash
# Create persistent volume
nebius compute disk create --name training-data --size 100

# Attach to VM
nebius compute vm update \
  --name ml-training-vm \
  --attach-disk training-data:/mnt/data

# Use it in training
# /mnt/data is available on VM
```

## Cost Analysis

H100 GPU VM (24 hours):
```
- VM compute: 1 × $2.50/hour × 24 = $60
- Storage (200GB SSD): ~$1/day = $1
- Data transfer: ~$0.10/GB (if using public internet)
Total: ~$61-65 per day
```

Cost optimization:
```bash
# Use preemptible VM (50% savings, risk of interruption)
nebius compute vm create \
  --name ml-training-vm \
  --preemptible \
  --machine-type gpu-h100-sxm

# Use smaller GPU for prototyping
--machine-type gpu-l40s-pcie  # $0.80/hour vs $2.50/hour

# Use reserved capacity for discounts (30% savings on long-term)
```

## Troubleshooting

**GPU not detected**
```bash
nvidia-smi  # Should work
# If not, drivers may not be installed
sudo apt install -y nvidia-driver-545
sudo reboot
```

**Out of memory error**
```bash
# Reduce batch size
# Or use gradient accumulation
# Or use smaller model

# Check memory usage
nvidia-smi --query-gpu=memory.used,memory.free --format=csv -l 1
```

**Slow performance (<50% GPU utilization)**
```bash
# Check if data loading is bottleneck
# Use num_workers in DataLoader
# Profile with torch.profiler

# Check CPU/disk bottleneck
iostat -x 1  # Disk I/O
top           # CPU usage
```

## Cleanup

Stop VM to save costs (disk persists):
```bash
nebius compute vm stop --name ml-training-vm
```

Delete VM entirely:
```bash
nebius compute vm delete --name ml-training-vm --delete-disk
```

## Next Steps

- [Kubernetes](/docs/services/kubernetes/) for distributed training
- [Registry](/docs/services/registry/) for sharing models
- [Monitoring](/docs/advanced/monitoring/) for training observability
