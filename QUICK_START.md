# QUICK START GUIDE - TẢI NHANH

## 🚀 ONE-COMMAND START (Chi 1 lệnh)

```bash
cd /workspaces/UDPT_TMDT

# Run complete system check and setup
./test-sync.sh
```

---

## 📱 MULTI-TERMINAL QUICK START

### Terminal 1: Database & Services Check
```bash
cd /workspaces/UDPT_TMDT/docker
docker-compose up -d
docker-compose ps
```

### Terminal 2: Build & Start Backend  
```bash
cd /workspaces/UDPT_TMDT
export JAVA_HOME=/home/codespace/java/21.0.10-ms
./start-services-v2.sh
```

### Terminal 3: Frontend
```bash
cd /workspaces/UDPT_TMDT/frontend-react
npm install
npm run dev
```

---

## 🌐 ACCESS POINTS

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5173 | React App |
| **API Gateway** | http://localhost:8080 | Health: /actuator/health |
| **Auth Service** | http://localhost:8081 | Health: /actuator/health |
| **Product Service** | http://localhost:8083 | Health: /actuator/health |
| **Cart Service** | http://localhost:8084 | Health: /actuator/health |
| **Order Service** | http://localhost:8085 | Health: /actuator/health |
| **MySQL** | localhost:3306 | user/pass: ecommerce |
| **Redis** | localhost:6379 | Cache |

---

## 🔗 QUICK API TESTS

### Get Products
```bash
curl http://localhost:8080/api/products
```

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!","full_name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!"}'
```

### Add to Cart (replace TOKEN with your JWT)
```bash
export TOKEN="your_jwt_token"
curl -X POST http://localhost:8080/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'
```

---

## 📊 DATABASE QUICK QUERIES

```bash
# Connect to MySQL
docker exec -it ecommerce_mysql mysql -u root -proot defaultdb

# View all tables
SHOW TABLES;

# Check row counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders;

# View sample product
SELECT * FROM products LIMIT 1\G

# View sample user
SELECT * FROM users LIMIT 1\G

# Check database sync
SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='defaultdb';
```

---

## 🛠️ TROUBLESHOOTING QUICK FIXES

| Problem | Quick Fix |
|---------|-----------|
| MySQL won't start | `docker-compose down && docker-compose up -d` |
| Port already in use | `kill $(lsof -t -i:PORT_NUMBER)` or change port |
| Services not connecting | Check `docker ps` and service logs |
| Frontend blank page | Check browser console (F12), verify API running |
| JWT token expired | Clear localStorage and re-login |
| CORS errors | Verify API Gateway CORS settings |
| Data not showing | Check database has tables: `SHOW TABLES;` |

---

## 📋 VERIFICATION CHECKLIST

Run each command and verify:

```bash
# 1. Database running
docker ps | grep mysql
# Expected: ecommerce_mysql Up

# 2. Redis running  
docker ps | grep redis
# Expected: ecommerce_redis Up

# 3. Check tables exist
docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='defaultdb';"
# Expected: ~20+ tables

# 4. Check sample data
docker exec ecommerce_mysql mysql -uroot -proot defaultdb -e "SELECT COUNT(*) FROM products;"
# Expected: 8 products

# 5. API Gateway health
curl -s http://localhost:8080/actuator/health | grep -o '"status":"[^"]*"'
# Expected: "status":"UP"

# 6. Frontend loading
curl -s http://localhost:5173 | head -c 100
# Expected: <!DOCTYPE html...
```

---

## 📚 FULL DOCUMENTATION

For detailed information, see:
- **Test Guide:** `TEST_SYSTEM.md`
- **Architecture:** `SYSTEM_CONNECTIVITY.md`
- **Database:** `docs/database-design/DATABASE_GUIDE.md`
- **Schema:** `docs/database-design/schema.sql`

---

## 🆘 GETTING HELP

1. **Service won't start?**
   - Check logs: `docker logs ecommerce_mysql`
   - Check port: `netstat -an | grep LISTEN`

2. **Data not syncing?**
   - Verify all tables exist: `SHOW TABLES;`
   - Check for errors in service logs

3. **Frontend issues?**
   - Open DevTools (F12)
   - Check Network tab for API failures
   - Check Console for errors

4. **Still stuck?**
   - Run: `./test-sync.sh` for full diagnostics
   - Check logs in `/tmp/*-service.log`

---

**Version:** 1.0  
**Last Updated:** May 9, 2026  
**Database:** MySQL 8.0  
**Framework:** Spring Boot + React
