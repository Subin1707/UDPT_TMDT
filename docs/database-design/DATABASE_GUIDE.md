# Database Management Guide

## Overview

The e-commerce system uses **Aiven MySQL** (remote cloud database) with automatic schema management via **Hibernate ORM**.

### Current Configuration
- **Database Host**: `YOUR_AIVEN_HOST:25291`
- **Database Name**: `defaultdb`
- **Username**: `avnadmin`
- **Password**: Set via `DB_PASSWORD` environment variable
- **ORM**: Spring Data JPA + Hibernate
- **Schema Management**: `hibernate.ddl-auto: update`

## Schema Management

### Automatic Schema Management (Current Setup)

All services use `hibernate.ddl-auto: update` in their `application.yml`:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Automatically creates/updates tables
```

**Advantages**:
- ✅ Automatic table creation on service startup
- ✅ Schema updates when entities change
- ✅ No manual SQL execution needed
- ✅ Safe for development

**How it works**:
1. When a service starts, Hibernate reads all `@Entity` classes
2. Compares them with the existing database schema
3. Creates new tables and columns as needed
4. Services will auto-initialize on first run

## Manual Schema Application

If you need to apply the schema manually (troubleshooting or setup):

### Option 1: Using MySQL Workbench or Client

```bash
# Install MySQL client
apt-get install mysql-client

# Connect to database
mysql -h thuongmaidientu1-quyenthaoxyz123-6026.k.aivencloud.com \
       -u avnadmin \
       -p \
       --ssl-mode=REQUIRED

# Then execute: docs/database-design/schema.sql
```

### Option 2: Using Docker

```bash
docker run --rm -i mysql:8 \
  mysql -h thuongmaidientu1-quyenthaoxyz123-6026.k.aivencloud.com \
        -u avnadmin \
        -p$DB_PASSWORD \
        --ssl-mode=REQUIRED < docs/database-design/schema.sql
```

## Database Tables Overview

### Auth Service Tables
- `roles` - User roles (ADMIN, CUSTOMER, SHIPPER)
- `users` - User accounts
- `user_roles` - User-role mapping
- `refresh_tokens` - JWT refresh tokens

### User Service Tables
- `user_addresses` - Shipping addresses
- `wishlists` - User wishlists

### Product Service Tables
- `brands` - Product brands
- `categories` - Product categories
- `products` - Products catalog
- `product_images` - Product images
- `inventories` - Stock management
- `product_reviews` - Product ratings and reviews

### Cart Service Tables
- `cart_items` - Shopping cart items (user ID is in session)

### Order Service Tables
- `orders` - Order headers
- `order_items` - Order line items
- `order_status_history` - Order status tracking

### Payment Service Tables
- `payments` - Payment records
- `payment_transactions` - Transaction details

### Delivery Service Tables
- `shippers` - Shipper accounts
- `deliveries` - Delivery records
- `delivery_tracking` - Real-time delivery tracking

### Notification Service Tables
- `notifications` - User notifications

### Voucher Service Tables
- `vouchers` - Voucher codes
- `user_vouchers` - User voucher assignments

## Initial Data

The schema includes default data:
- **3 Sample Roles**: ADMIN, CUSTOMER, SHIPPER
- **3 Brands**: Logitech, Samsung, Sony
- **2 Categories**: Electronics, Accessories
- **8 Products**: Pre-populated sample products

## Verification

### Check Database Connection
```bash
curl http://localhost:8080/api/products
```

If products are returned, the database connection is working.

### Check Table Status
Query the database directly (requires access):
```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'defaultdb';
```

## Troubleshooting

### Issue: Services fail to start with database error

**Solution**:
1. Verify `DB_PASSWORD` environment variable is set
2. Check database URL and credentials in `application.yml`
3. Ensure Aiven MySQL instance is accessible
4. Check network connectivity to `thuongmaidientu1-quyenthaoxyz123-6026.k.aivencloud.com:25291`

### Issue: Tables not created

**Solution**:
1. Check if service successfully started (look at logs)
2. Verify `hibernate.ddl-auto: update` is set
3. Manually apply schema using Option 1 or 2 above
4. Restart the service

### Issue: Schema mismatch with entities

**Solution**:
1. Stop all services
2. Manually apply fresh schema: `schema.sql`
3. Restart all services

## Best Practices

1. **Always backup** before manual schema changes
2. **Use Hibernate DDL** for automatic management
3. **Test changes** in development first
4. **Keep entities synchronized** with database
5. **Version control** schema changes via entity updates
6. **Monitor logs** for schema warnings

## Reference Schema Location

- Full schema: `docs/database-design/schema.sql`
- Comprehensive documentation: `docs/database-design/initial-schema.md`

---

**Last Updated**: May 9, 2026  
**Status**: ✓ All services running with automatic schema management
