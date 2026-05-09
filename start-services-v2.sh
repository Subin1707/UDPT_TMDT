#!/bin/bash

export JAVA_HOME=/home/codespace/java/21.0.10-ms
cd /workspaces/UDPT_TMDT

echo "=== STEP 1: Building shared-lib ==="
./mvnw -pl shared-lib install -DskipTests > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
  echo "✓ shared-lib built successfully"
else
  echo "✗ shared-lib build failed"
  tail -30 /tmp/build.log
  exit 1
fi

echo ""
echo "=== STEP 2: Starting API Gateway ==="
nohup ./mvnw -pl services/api-gateway spring-boot:run > /tmp/api-gateway.log 2>&1 &
API_GW_PID=$!
echo "API Gateway PID: $API_GW_PID"

echo ""
echo "=== STEP 3: Starting Auth Service ==="
nohup ./mvnw -pl services/auth-service spring-boot:run > /tmp/auth-service.log 2>&1 &
AUTH_PID=$!
echo "Auth Service PID: $AUTH_PID"

echo ""
echo "=== STEP 4: Starting Product Service ==="
nohup ./mvnw -pl services/product-service spring-boot:run > /tmp/product-service.log 2>&1 &
PRODUCT_PID=$!
echo "Product Service PID: $PRODUCT_PID"

sleep 20
echo ""
echo "=== STEP 5: Checking service health ==="

# Function to check service
check_service() {
  local port=$1
  local name=$2
  local status=$(curl -s http://localhost:$port/actuator/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  if [ -z "$status" ]; then
    echo "✗ $name (port $port): Not responding"
  else
    echo "✓ $name (port $port): $status"
  fi
}

check_service 8080 "API Gateway"
check_service 8081 "Auth Service"
check_service 8083 "Product Service"

echo ""
echo "Services are running. Check logs at:"
echo "  - API Gateway: tail -f /tmp/api-gateway.log"
echo "  - Auth Service: tail -f /tmp/auth-service.log"
echo "  - Product Service: tail -f /tmp/product-service.log"
