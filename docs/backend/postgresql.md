# PostgreSQL

## Connection

```bash
psql -U username -d dbname -h host -p port
\c dbname        -- connect to a database
\q               -- quit
```

## Database & User Management

### Database

```sql
CREATE DATABASE dbname;
DROP DATABASE dbname;
```

### User / Role

```sql
CREATE USER myuser WITH PASSWORD 'mypassword';
DROP USER myuser;
```

### Grant privileges

```sql
GRANT ALL PRIVILEGES ON DATABASE dbname TO myuser;
REVOKE CONNECT ON DATABASE dbname FROM myuser;
```

## Table Management

### Create

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Alter

```sql
ALTER TABLE users ADD COLUMN age INT;
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users RENAME COLUMN email TO user_email;
```

### Drop

```sql
DROP TABLE users;
```

## Insert / Update / Delete

```sql
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

UPDATE users SET email = 'new@example.com' WHERE id = 1;

DELETE FROM users WHERE id = 1;
```

## Select Queries

```sql
SELECT * FROM users;
SELECT name, email FROM users WHERE age > 18;
SELECT COUNT(*) FROM users;
SELECT DISTINCT name FROM users;
```

### Sorting & Limiting

```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 5;
```

### Joins

```sql
SELECT u.name, o.total 
FROM users u 
JOIN orders o ON u.id = o.user_id;
```

### Aggregates

```sql
SELECT user_id, SUM(total) AS total_spent 
FROM orders 
GROUP BY user_id 
HAVING SUM(total) > 100;
```

## Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
DROP INDEX idx_users_email;
```

## Constraints

### Primary Key & Foreign Key

```sql
ALTER TABLE orders ADD CONSTRAINT orders_user_fk 
FOREIGN KEY (user_id) REFERENCES users(id);
```

### Unique Constraint

```sql
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

## Useful Meta Commands (in psql)

```bash
\l        -- list databases
\dt       -- list tables
\d table  -- describe table
\du       -- list users/roles
\dn       -- list schemas
\df       -- list functions
```

## Transactions

```sql
BEGIN;
UPDATE users SET name = 'Bob' WHERE id = 1;
DELETE FROM orders WHERE id = 10;
COMMIT;

-- Or rollback
ROLLBACK;
```

## JSON / Advanced

### JSON

```sql
SELECT data->>'name' AS name FROM mytable;
```

### Upsert

```sql
INSERT INTO users (id, name, email) 
VALUES (1, 'Alice', 'alice@example.com') 
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
```

### Window functions

```sql
SELECT id, name,
       RANK() OVER (ORDER BY created_at DESC) AS rank 
FROM users;
```
:::note

⚡ Performance Tip : always use **EXPLAIN** before complex queries to analyze performance:

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```
:::
