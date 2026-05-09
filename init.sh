#!/bin/bash

set -e

echo "======================================"
echo "ECOMMERCE SYSTEM INITIALIZATION"
echo "======================================"
echo ""

# Check Java version
echo "1. Checking Java version..."
if [ -z "$JAVA_HOME" ]; then
  export JAVA_HOME=/home/codespace/java/21.0.10-ms
  echo "   Set JAVA_HOME=$JAVA_HOME"
else
  echo "   JAVA_HOME=$JAVA_HOME"
fi

# Verify Java is available
if ! command -v java &> /dev/null; then
  echo "❌ Java not found"
  exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | grep version | awk -F'"' '{print $2}')
echo "   ✓ Java version: $JAVA_VERSION"
echo ""

# Build project
echo "2. Building project..."
cd /workspaces/UDPT_TMDT

if [ -f "pom.xml" ]; then
  echo "   Building with Maven..."
  ./mvnw -DskipTests clean install -q
  echo "   ✓ Build complete"
else
  echo "❌ pom.xml not found"
  exit 1
fi
echo ""

# Setup environment variables
echo "3. Checking database credentials..."
if [ -z "$DB_PASSWORD" ]; then
  echo "   ⚠️  DB_PASSWORD not set"
  echo "   "
  echo "   This project uses Aiven MySQL cloud database."
  echo "   To set credentials:"
  echo "   "
  echo "   Option A: Set environment variable"
  echo "       export DB_PASSWORD='your_password'"
  echo "   "
  echo "   Option B: Create .env file with:"
  echo "       DB_PASSWORD=your_password"
  echo "   "
  echo "   For test purposes, check: docs/ or ask project maintainer"
  echo "   "
  read -p "   Enter DB_PASSWORD (or press Enter to skip): " db_pass
  if [ ! -z "$db_pass" ]; then
    export DB_PASSWORD="$db_pass"
    echo "   ✓ DB_PASSWORD set"
  fi
else
  echo "   ✓ DB_PASSWORD already configured"
fi
echo ""

# Start services
echo "4. Starting microservices..."
echo "   Note: Services will run in background"
echo ""

# Start shared-lib first if needed
./mvnw -pl shared-lib install -DskipTests -q 2>/dev/null || true

# Service startup order and ports
services=(
  "api-gateway:8080"
  "auth-service:8081"
  "user-service:8082"
  "product-service:8083"
  "cart-service:8084"
  "order-service:8085"
  "payment-service:8086"
  "notification-service:8087"
  "delivery-service:8088"
  "analytics-service:8089"
)

echo "   Starting services (this may take 1-2 minutes)..."
echo ""

for service_info in "${services[@]}"; do
  IFS=':' read -r service port <<< "$service_info"
  echo "   Starting $service (port $port)..."
  nohup ./mvnw -pl services/$service spring-boot:run -DskipTests \
    > /tmp/${service}.log 2>&1 &
  service_pid=$!
  echo "   └─ PID: $service_pid"
  sleep 2
done

echo ""
echo "======================================"
echo "✓ INITIALIZATION COMPLETE"
echo "======================================"
echo ""
echo "Services are starting in background..."
echo "Service ports:"
echo "  - API Gateway: http://localhost:8080"
echo "  - Auth Service: http://localhost:8081"
echo "  - User Service: http://localhost:8082"
echo "  - Product Service: http://localhost:8083"
echo "  - Cart Service: http://localhost:8084"
echo "  - Order Service: http://localhost:8085"
echo "  - Payment Service: http://localhost:8086"
echo "  - Notification Service: http://localhost:8087"
echo "  - Delivery Service: http://localhost:8088"
echo "  - Analytics Service: http://localhost:8089"
echo ""
echo "View logs with: tail -f /tmp/{service-name}.log"
echo ""
echo "Next steps:"
echo "  1. Start frontend: cd frontend-react && npm run dev"
echo "  2. Check service health: curl http://localhost:8080/actuator/health"
echo "  3. Access API Gateway: http://localhost:8080"
echo ""
