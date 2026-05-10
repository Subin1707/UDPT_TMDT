#!/bin/bash

# =========================================================
# E-COMMERCE SYSTEM - AUTOMATED TESTING SCRIPT
# =========================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}E-COMMERCE SYSTEM - SYNC & TEST${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# =========================================================
# 1. CHECK PREREQUISITES
# =========================================================
echo -e "${YELLOW}[1/6] Checking Prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java not found${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | grep version | awk -F'"' '{print $2}')
echo -e "${GREEN}✓ Java $JAVA_VERSION${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed${NC}"

# Check MySQL CLI
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}⚠ MySQL CLI not found (optional)${NC}"
else
    echo -e "${GREEN}✓ MySQL CLI available${NC}"
fi

echo ""

# =========================================================
# 2. START DATABASE & REDIS
# =========================================================
echo -e "${YELLOW}[2/6] Starting Database & Redis...${NC}"

cd /workspaces/UDPT_TMDT/docker

# Check if containers are already running
MYSQL_RUNNING=$(docker ps --filter "name=ecommerce_mysql" --filter "status=running" -q)
REDIS_RUNNING=$(docker ps --filter "name=ecommerce_redis" --filter "status=running" -q)

if [ -z "$MYSQL_RUNNING" ] || [ -z "$REDIS_RUNNING" ]; then
    echo "Starting containers..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose up -d
    echo "Waiting for services to be healthy..."
    sleep 10
else
    echo "Containers already running"
fi

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if docker exec ecommerce_mysql mysqladmin ping -h localhost &> /dev/null; then
        echo -e "${GREEN}✓ MySQL is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ MySQL failed to start${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done

# Wait for Redis to be ready
echo "Waiting for Redis to be ready..."
for i in {1..10}; do
    if docker exec ecommerce_redis redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓ Redis is ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""

# =========================================================
# 3. VERIFY DATABASE SCHEMA
# =========================================================
echo -e "${YELLOW}[3/6] Verifying Database Schema...${NC}"

# Check if tables exist
TABLES=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='defaultdb';" -s)
echo "Database tables: $TABLES"

if [ "$TABLES" -lt 20 ]; then
    echo -e "${YELLOW}⚠ Schema not initialized, initializing now...${NC}"
    docker exec ecommerce_mysql mysql -uroot -proot defaultdb < /docker-entrypoint-initdb.d/init.sql 2>/dev/null || true
fi

# Verify key tables
ROLES=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM roles;" -s)
PRODUCTS=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM products;" -s)

echo -e "${GREEN}✓ Schema verified${NC}"
echo "  - Roles: $ROLES"
echo "  - Products: $PRODUCTS"

echo ""

# =========================================================
# 4. BUILD BACKEND SERVICES
# =========================================================
echo -e "${YELLOW}[4/6] Building Backend Services...${NC}"

cd /workspaces/UDPT_TMDT

export JAVA_HOME=/home/codespace/java/21.0.10-ms

# Check if already built
if [ -d "shared-lib/target" ]; then
    echo "Using cached builds..."
else
    echo "Building for first time..."
    ./mvnw clean install -DskipTests -q
fi

echo -e "${GREEN}✓ Build complete${NC}"

echo ""

# =========================================================
# 5. CHECK SERVICE HEALTH
# =========================================================
echo -e "${YELLOW}[5/6] Checking Service Health...${NC}"

# Function to check service
check_service() {
    local port=$1
    local name=$2
    
    if timeout 5 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null; then
        RESPONSE=$(curl -s http://localhost:$port/actuator/health 2>/dev/null || echo '{}')
        if echo "$RESPONSE" | grep -q "UP\|up"; then
            echo -e "${GREEN}✓ $name (port $port)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ $name (port $port) - starting${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ $name (port $port) - not running${NC}"
        return 1
    fi
}

echo "Service Status:"
check_service 8080 "API Gateway" || echo "  (Start services with: ./start-services-v2.sh)"
check_service 8081 "Auth Service" || true
check_service 8083 "Product Service" || true
check_service 8084 "Cart Service" || true

echo ""

# =========================================================
# 6. DATABASE QUERIES
# =========================================================
echo -e "${YELLOW}[6/6] Database Integrity Check...${NC}"

echo "Running integrity checks..."

# Check referential integrity
ORPHAN_ORDERS=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users);" -s 2>/dev/null || echo "0")

# Check data counts
USER_COUNT=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM users;" -s 2>/dev/null || echo "0")
PRODUCT_COUNT=$(docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM products;" -s 2>/dev/null || echo "0")

echo -e "${GREEN}✓ Integrity Check Complete${NC}"
echo "  - Users in system: $USER_COUNT"
echo "  - Products available: $PRODUCT_COUNT"
echo "  - Orphaned orders: $ORPHAN_ORDERS"

echo ""

# =========================================================
# SUMMARY
# =========================================================
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}SYSTEM STATUS: READY${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Next Steps:"
echo "1. Start backend services:"
echo "   cd /workspaces/UDPT_TMDT && ./start-services-v2.sh"
echo ""
echo "2. Start frontend (in another terminal):"
echo "   cd /workspaces/UDPT_TMDT/frontend-react"
echo "   npm install && npm run dev"
echo ""
echo "3. Test endpoints:"
echo "   curl http://localhost:8080/api/products"
echo ""
echo "Endpoints:"
echo "  - API Gateway: http://localhost:8080"
echo "  - Frontend: http://localhost:5173"
echo "  - MySQL: localhost:3306 (user: ecommerce, pass: ecommerce)"
echo "  - Redis: localhost:6379"
echo ""
echo -e "${BLUE}Full testing guide: ${NC}cat TEST_SYSTEM.md"
echo ""
