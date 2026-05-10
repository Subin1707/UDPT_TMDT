#!/bin/bash

# =========================================================
# STARTUP SCRIPT - Chạy tất cả services với Aiven DB
# =========================================================

set -e

# Set password từ Aiven
export DB_PASSWORD="${DB_PASSWORD:-your_password_here}"

if [ "$DB_PASSWORD" = "your_password_here" ]; then
    echo "❌ ERROR: DB_PASSWORD không được set!"
    echo ""
    echo "Vui lòng chạy:"
    echo "  export DB_PASSWORD='your_actual_password'"
    echo "  ./start-all-services.sh"
    exit 1
fi

echo "✅ DB_PASSWORD set: ${DB_PASSWORD:0:10}..."
echo ""
echo "🚀 Starting all services..."
echo ""

# Export để con process kế thừa
export JAVA_HOME=/home/codespace/java/21.0.10-ms

cd /workspaces/UDPT_TMDT

# Services array
declare -a services=(
    "api-gateway:8080"
    "auth-service:8081"
    "user-service:8082"
    "product-service:8083"
    "cart-service:8084"
    "order-service:8085"
    "payment-service:8086"
    "delivery-service:8087"
    "notification-service:8088"
    "analytics-service:8089"
)

echo "Start each service in separate terminal:"
echo ""

for service_port in "${services[@]}"; do
    service="${service_port%%:*}"
    port="${service_port##*:}"
    
    echo "📍 $service (port $port):"
    echo "   export DB_PASSWORD='$DB_PASSWORD'"
    echo "   cd /workspaces/UDPT_TMDT && ./mvnw -pl services/$service spring-boot:run"
    echo ""
done

echo "Or run in background:"
echo "   ./start-services-v2.sh"
