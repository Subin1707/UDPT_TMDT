# Project Initialization Guide

## Overview
This is a distributed e-commerce microservices system with 10 Java Spring Boot services + React frontend.

## Current Status
❌ **Initialization Issue**: Database credentials not configured

### Error Details
```
ERROR: Access denied for user 'avnadmin'@'23.97.62.146' (using password: YES)
```

The cart service (and other services) tried to connect to an Aiven MySQL cloud database but failed due to missing password.

## What You Need to Do

### Step 1: Get Database Password
The project uses **Aiven MySQL cloud database** (remote, not local):
- **Host**: `thuongmaidientu1-quyenthaoxyz123-6026.k.aivencloud.com:25291`
- **Username**: `avnadmin`
- **Password**: ❌ NOT SET - You need to get this from:
  1. Project maintainer or team
  2. Aiven console (check account)
  3. Secrets management system (if configured)

### Step 2: Set Environment Variable

```bash
export DB_PASSWORD='your_actual_password'
```

Or add to shell profile (`~/.bashrc`, `~/.zshrc`):
```bash
echo "export DB_PASSWORD='your_actual_password'" >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Initialize and Start Services

```bash
cd /workspaces/UDPT_TMDT
./init.sh
```

The script will:
1. ✓ Check Java version (requires Java 21)
2. ✓ Build the entire project with Maven
3. ✓ Start all 10 microservices in background

### Step 4: Verify Services are Running

```bash
# Check a specific service
curl http://localhost:8080/actuator/health

# View startup logs
tail -f /tmp/api-gateway.log
tail -f /tmp/auth-service.log
tail -f /tmp/product-service.log
```

### Step 5: Start Frontend (Optional)

```bash
cd frontend-react
npm install
npm run dev
```

Access at: `http://localhost:5173`

## Service Information

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 8080 | Request routing & load balancing |
| Auth Service | 8081 | User registration, login, JWT |
| User Service | 8082 | User profiles |
| Product Service | 8083 | Products, categories, inventory |
| Cart Service | 8084 | Shopping cart |
| Order Service | 8085 | Order creation and status |
| Payment Service | 8086 | Payment processing |
| Notification Service | 8087 | WebSocket notifications |
| Delivery Service | 8088 | Delivery tracking |
| Analytics Service | 8089 | Dashboard analytics |

## Troubleshooting

### "DB_PASSWORD: command not found"
→ The environment variable is not set. Run:
```bash
export DB_PASSWORD='your_password'
```

### Service still can't connect
→ Check the password is correct:
```bash
echo $DB_PASSWORD
```

### Port already in use
→ Kill existing processes:
```bash
lsof -Ti:8080  # Check what's using port 8080
kill -9 <PID>   # Kill the process
```

### Build fails
→ Clear Maven cache:
```bash
./mvnw clean
./mvnw -DskipTests install
```

## Quick Start (if you have the DB_PASSWORD)

```bash
export DB_PASSWORD='<password>'
cd /workspaces/UDPT_TMDT
./init.sh
```

## Architecture Notes
- **Services**: Spring Boot microservices (Java 21)
- **Message Queue**: Spring Cloud with Aiven MySQL
- **Frontend**: React with Vite
- **Database**: Aiven MySQL (remote cloud)
- **Optional Local DB**: PostgreSQL + Redis (in docker-compose.yml)
- **API Gateway**: Spring Cloud Gateway routing requests
- **Authentication**: JWT tokens via Auth Service

## Next Steps

1. **Get the DB_PASSWORD** from team/maintainer
2. **Run `/workspaces/UDPT_TMDT/init.sh`** to initialize
3. **Start frontend** with `npm run dev`
4. **Access** `http://localhost:8080` for API Gateway

For more details, see:
- `README.md` - Project overview
- `docs/architecture/overview.md` - System design
- `docs/feature-roadmap.md` - Feature list

---

**Created**: May 9, 2026  
**For help**: Check project maintainer or team docs
