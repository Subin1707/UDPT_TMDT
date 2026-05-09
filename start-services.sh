#!/bin/bash

export JAVA_HOME=/home/codespace/java/21.0.10-ms
cd /workspaces/UDPT_TMDT

echo "Starting backend services..."

# Start API Gateway
nohup ./mvnw -pl services/api-gateway spring-boot:run > /tmp/api-gateway.log 2>&1 &
echo $! > /tmp/api-gateway.pid
echo "Started API Gateway (PID: $(cat /tmp/api-gateway.pid))"

sleep 5

# Start Auth Service
nohup ./mvnw -pl services/auth-service -am spring-boot:run > /tmp/auth-service.log 2>&1 &
echo $! > /tmp/auth-service.pid
echo "Started Auth Service (PID: $(cat /tmp/auth-service.pid))"

sleep 5

# Start Product Service
nohup ./mvnw -pl services/product-service -am spring-boot:run > /tmp/product-service.log 2>&1 &
echo $! > /tmp/product-service.pid
echo "Started Product Service (PID: $(cat /tmp/product-service.pid))"

echo "All services started. Waiting for startup..."
sleep 15

echo ""
echo "Checking service health..."
echo "API Gateway: $(curl -s http://localhost:8080/actuator/health | jq '.status' 2>/dev/null || echo 'Not ready')"
echo "Auth Service: $(curl -s http://localhost:8081/actuator/health | jq '.status' 2>/dev/null || echo 'Not ready')"
echo "Product Service: $(curl -s http://localhost:8083/actuator/health | jq '.status' 2>/dev/null || echo 'Not ready')"
