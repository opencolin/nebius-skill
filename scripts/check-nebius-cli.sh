#!/bin/bash
# Pre-flight check for Nebius CLI
# Verifies installation, authentication, and project configuration

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

echo "=== Nebius CLI Pre-flight Check ==="
echo ""

# 1. Check CLI installed
if command -v nebius &> /dev/null; then
    VERSION=$(nebius version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}[OK]${NC} nebius CLI installed (${VERSION})"
else
    echo -e "${RED}[FAIL]${NC} nebius CLI not found"
    echo "  Install with: curl -sSL https://storage.eu-north1.nebius.cloud/cli/install.sh | bash"
    ERRORS=$((ERRORS + 1))
fi

# 2. Check authentication
if command -v nebius &> /dev/null; then
    if nebius iam whoami --format json &> /dev/null; then
        WHOAMI=$(nebius iam whoami --format json 2>/dev/null)
        echo -e "${GREEN}[OK]${NC} Authenticated"
    else
        echo -e "${RED}[FAIL]${NC} Not authenticated"
        echo "  Run: nebius init"
        ERRORS=$((ERRORS + 1))
    fi
fi

# 3. Check profile
if command -v nebius &> /dev/null; then
    PROFILE=$(nebius config get profile 2>/dev/null || echo "")
    if [ -n "$PROFILE" ]; then
        echo -e "${GREEN}[OK]${NC} Active profile: ${PROFILE}"
    else
        echo -e "${YELLOW}[WARN]${NC} No active profile configured"
        echo "  Run: nebius profile create"
    fi
fi

# 4. Check project ID
if command -v nebius &> /dev/null; then
    PARENT_ID=$(nebius config get parent-id 2>/dev/null || echo "")
    if [ -n "$PARENT_ID" ]; then
        echo -e "${GREEN}[OK]${NC} Project ID: ${PARENT_ID}"
    else
        echo -e "${YELLOW}[WARN]${NC} No parent-id (project) configured"
        echo "  Run: nebius config set parent-id <PROJECT_ID>"
        echo "  Find your project ID: nebius iam project list --format json"
    fi
fi

# 5. Check optional tools
echo ""
echo "--- Optional Tools ---"
for tool in docker kubectl helm jq; do
    if command -v "$tool" &> /dev/null; then
        echo -e "${GREEN}[OK]${NC} ${tool} installed"
    else
        echo -e "${YELLOW}[SKIP]${NC} ${tool} not found (optional)"
    fi
done

echo ""
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}Pre-flight check failed with ${ERRORS} error(s)${NC}"
    exit 1
else
    echo -e "${GREEN}Pre-flight check passed${NC}"
    exit 0
fi
