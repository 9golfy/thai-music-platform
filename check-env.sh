#!/bin/bash

# Check Environment Variables
# Usage: ./check-env.sh

echo "🔍 Checking Environment Variables..."
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load .env.production
if [ -f ".env.production" ]; then
    source .env.production
    echo -e "${GREEN}✓ Found .env.production${NC}"
else
    echo -e "${RED}✗ .env.production not found!${NC}"
    exit 1
fi

echo ""
echo "📋 Environment Variables Status:"
echo "================================"

# Function to check variable
check_var() {
    local var_name=$1
    local var_value=${!var_name}
    local is_required=$2
    
    if [ -z "$var_value" ]; then
        if [ "$is_required" = "required" ]; then
            echo -e "${RED}✗ $var_name${NC} - Missing (Required)"
            return 1
        else
            echo -e "${YELLOW}⚠ $var_name${NC} - Not set (Optional)"
            return 0
        fi
    else
        # Mask sensitive values
        local masked_value
        if [[ $var_name == *"PASSWORD"* ]] || [[ $var_name == *"SECRET"* ]] || [[ $var_name == *"KEY"* ]]; then
            masked_value="***${var_value: -4}"
        else
            masked_value="$var_value"
        fi
        echo -e "${GREEN}✓ $var_name${NC} = $masked_value"
        return 0
    fi
}

echo ""
echo "🗄️  Database Configuration:"
echo "----------------------------"
check_var "MONGODB_URI" "required"
check_var "DATABASE_URL" "optional"

echo ""
echo "📧 Email Configuration (SMTP):"
echo "----------------------------"
check_var "SMTP_HOST" "required"
check_var "SMTP_PORT" "required"
check_var "SMTP_USER" "required"
check_var "SMTP_PASSWORD" "required"
check_var "SMTP_FROM" "required"
check_var "SMTP_FROM_NAME" "optional"

echo ""
echo "🔐 Authentication:"
echo "----------------------------"
check_var "NEXTAUTH_SECRET" "required"
check_var "NEXTAUTH_URL" "required"
check_var "JWT_SECRET" "optional"

echo ""
check_var "🎣 Webhook:"
echo "----------------------------"
check_var "WEBHOOK_SECRET" "required"

echo ""
echo "🌐 Application:"
echo "----------------------------"
check_var "NEXT_PUBLIC_API_URL" "optional"
check_var "NODE_ENV" "required"

echo ""
echo "📊 Summary:"
echo "==========="

# Count variables
TOTAL=0
MISSING=0
OPTIONAL_MISSING=0

# Required variables
REQUIRED_VARS=(
    "MONGODB_URI"
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_USER"
    "SMTP_PASSWORD"
    "SMTP_FROM"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "WEBHOOK_SECRET"
    "NODE_ENV"
)

for var in "${REQUIRED_VARS[@]}"; do
    TOTAL=$((TOTAL + 1))
    if [ -z "${!var}" ]; then
        MISSING=$((MISSING + 1))
    fi
done

echo "Total Required Variables: $TOTAL"
echo -e "Configured: ${GREEN}$((TOTAL - MISSING))${NC}"
if [ $MISSING -gt 0 ]; then
    echo -e "Missing: ${RED}$MISSING${NC}"
fi

echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All required environment variables are configured!${NC}"
    exit 0
else
    echo -e "${RED}❌ Missing $MISSING required environment variables!${NC}"
    echo ""
    echo "Please add missing variables to .env.production"
    exit 1
fi
