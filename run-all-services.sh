#!/bin/bash

# =========================================================
# ECOMMERCE SYSTEM - FIX & RUN ALL SERVICES
# =========================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}STARTING ALL ECOMMERCE SERVICES${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

export JAVA_HOME=/home/codespace/java/21.0.10-ms
cd /workspaces/UDPT_TMDT

# Check if Docker services are running
echo -e "${YELLOW}[1/2] Checking Database & Cache...${NC}"
if ! docker exec ecommerce_mysql mysqladmin ping -h localhost &> /dev/null; then
    echo -e "${YELLOW}Starting Docker services...${NC}"
    cd docker && docker-compose up -d && cd ..
    sleep 5
fi
echo -e "${GREEN}✓ MySQL & Redis running${NC}"
echo ""

# Start all services
echo -e "${YELLOW}[2/2] Starting Services...${NC}"
echo ""

# Define service configurations
declare -a SERVICES=(
    "services/api-gateway:8080:GatewayApplication"
    "services/auth-service:8081:AuthServiceApplication"
    "services/user-service:8082:UserServiceApplication"
    "services/product-service:8083:ProductServiceApplication"
    "services/cart-service:8084:CartServiceApplication"
    "services/order-service:8085:OrderServiceApplication"
    "services/payment-service:8086:PaymentServiceApplication"
    "services/delivery-service:8087:DeliveryServiceApplication"
    "services/notification-service:8088:NotificationServiceApplication"
)

echo "Starting services (this opens multiple terminals):"
echo ""

for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r service_path port class_name <<< "$service_info"
    service_name=$(basename "$service_path")
    
    echo -e "${GREEN}► $service_name${NC} (port $port)"
    
    # Run in background
    nohup ./mvnw -pl "$service_path" spring-boot:run > "/tmp/${service_name}.log" 2>&1 &
    SERVICE_PID=$!
    echo "  Started (PID: $SERVICE_PID)"
    
    sleep 3
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ ALL SERVICES STARTING${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Services are starting in the background."
echo "Wait 20-30 seconds for all service ports to be ready."
echo ""
echo "📊 Service Endpoints:"
echo "  • API Gateway:          http://localhost:8080"
echo "  • Auth Service:         http://localhost:8081"
echo "  • User Service:         http://localhost:8082"
echo "  • Product Service:      http://localhost:8083"
echo "  • Cart Service:         http://localhost:8084"
echo "  • Order Service:        http://localhost:8085"
echo "  • Payment Service:      http://localhost:8086"
echo "  • Delivery Service:     http://localhost:8087"
echo "  • Notification Service: http://localhost:8088"
echo ""
echo "🔍 Check service health:"
echo "  curl http://localhost:8080/actuator/health"
echo ""
echo "📝 View logs:"
echo "  tail -f /tmp/api-gateway.log"
echo "  tail -f /tmp/auth-service.log"
echo "  tail -f /tmp/product-service.log"
echo "  etc..."
echo ""
echo -e "${YELLOW}Note:${NC} Services may take 15-30 seconds to fully start."
