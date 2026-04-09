# Setup .env file with MySQL password

Write-Host "Arduino IoT Dashboard - Environment Setup" -ForegroundColor Green
Write-Host ""

# Get MySQL password from user
$password = Read-Host "Enter your MySQL root password (press Enter if no password)" -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($password))

# Create .env file
$envContent = @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$plainPassword
DB_NAME=iot_microproject
PORT=3000
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host ""
Write-Host "env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm start" -ForegroundColor Cyan
