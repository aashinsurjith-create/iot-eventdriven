# Fix MySQL Password Issue

Your MySQL root user has a password set, but we don't know what it is.

## Solution

### Option 1: Edit .env File (Recommended)

1. Open the `.env` file in your project folder
2. Find this line:
   ```
   DB_PASSWORD=
   ```
3. Add your MySQL root password:
   ```
   DB_PASSWORD=your_actual_password
   ```
4. Save the file
5. Restart the server (Ctrl+C and run `npm start` again)

### Option 2: Reset MySQL Root Password

If you forgot your password, reset it:

**Windows:**
1. Stop MySQL service: `net stop MySQL80`
2. Start MySQL without password: `mysqld --skip-grant-tables`
3. In another terminal, run: `mysql -u root`
4. Execute these commands:
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   EXIT;
   ```
5. Restart MySQL: `net start MySQL80`
6. Update .env file with the new password

### Option 3: Create New MySQL User

Create a user without password:

```sql
mysql -u root -p
CREATE USER 'iot_user'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON iot_microproject.* TO 'iot_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Then update .env:
```
DB_USER=iot_user
DB_PASSWORD=
```

## What to Do Now

1. **Determine your MySQL root password**
2. **Edit .env file** and add it
3. **Restart the server**
4. **Check if it connects**

## Test Connection

After updating .env, test with:
```bash
mysql -u root -p -e "SELECT 1;"
```

Then restart the server:
```bash
npm start
```

You should see:
```
✓ MySQL Database connected successfully
```

---

**Need help? Check the password you set during MySQL installation.**
