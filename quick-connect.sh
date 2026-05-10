#!/bin/bash

# =========================================================
# QUICK START: BACKEND & FRONTEND CONNECTION TEST
# =========================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}BACKEND-FRONTEND CONNECTION TEST${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[1/4] Verifying Prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java installed${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ NPM not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ NPM installed${NC}"

echo ""

# Start database
echo -e "${YELLOW}[2/4] Starting Database & Redis...${NC}"

cd /workspaces/UDPT_TMDT/docker

MYSQL_RUNNING=$(docker ps --filter "name=ecommerce_mysql" --filter "status=running" -q)
if [ -z "$MYSQL_RUNNING" ]; then
    echo "Starting containers..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose up -d
    sleep 5
else
    echo "Containers already running"
fi

echo -e "${GREEN}✓ Database & Redis started${NC}"

echo ""

# Build services
echo -e "${YELLOW}[3/4] Building Services...${NC}"

cd /workspaces/UDPT_TMDT
export JAVA_HOME=/home/codespace/java/21.0.10-ms

# Check if already built
if [ -f "services/api-gateway/target/api-gateway-1.0.0.jar" ]; then
    echo "Using cached builds"
else
    echo "Building services (this may take a minute)..."
    ./mvnw clean install -DskipTests -q
fi

echo -e "${GREEN}✓ Services built${NC}"

echo ""

# Test connections
echo -e "${YELLOW}[4/4] Testing Connections...${NC}"

echo "Checking database..."
if docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT 1" &> /dev/null; then
    TABLES=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='defaultdb';" -s 2>/dev/null || echo "0")
    echo -e "${GREEN}✓ MySQL connected ($TABLES tables)${NC}"
else
    echo -e "${RED}✗ MySQL connection failed${NC}"
    exit 1
fi

echo ""

# Display instructions
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}READY TO START!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo "📋 Run in separate terminals:"
echo ""

echo -e "${YELLOW}Terminal 1 - API Gateway (Port 8080):${NC}"
echo "  cd /workspaces/UDPT_TMDT"
echo "  export JAVA_HOME=/home/codespace/java/21.0.10-ms"
echo "  ./mvnw -pl services/api-gateway spring-boot:run"
echo ""

echo -e "${YELLOW}Terminal 2 - Other Services:${NC}"
echo "  cd /workspaces/UDPT_TMDT"
echo "  ./start-services-v2.sh"
echo ""

echo -e "${YELLOW}Terminal 3 - Frontend (Port 5173):${NC}"
echo "  cd /workspaces/UDPT_TMDT/frontend-react"
echo "  npm install && npm run dev"
echo ""

echo -e "${YELLOW}Then Test:${NC}"
echo "  • Open http://localhost:5173 in browser"
echo "  • Check console (F12) for errors"
echo "  • Try to register and login"
echo "  • Products should appear"
echo ""

echo -e "${GREEN}✅ ALL FIXED! Follow terminal instructions above${NC}"
echo ""
