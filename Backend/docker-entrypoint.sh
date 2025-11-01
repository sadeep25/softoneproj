#!/bin/bash
set -e

echo "Starting application..."

# Extract password from connection string
DB_PASSWORD="TaskMgr#SecureP@ssw0rd2024!"

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to be ready..."
for i in {1..30}; do
  /opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "$DB_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1 && break
  echo "SQL Server is unavailable - sleeping"
  sleep 2
done

echo "SQL Server is up - checking database..."

# Check if database exists and create if it doesn't
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "$DB_PASSWORD" -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TaskManagerDb') CREATE DATABASE TaskManagerDb"

echo "Database check complete"

# Run migrations (if you have migrations)
# Note: This requires the project files to be available
cd /src/src/TaskManager.API
if ls ../TaskManager.Infrastructure/Migrations/*.cs 1> /dev/null 2>&1; then
  echo "Applying database migrations..."
  dotnet ef database update --project ../TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project TaskManager.API.csproj --no-build || echo "Migration failed or no migrations found"
fi

# Start the application
echo "Starting .NET application..."
cd /app
exec dotnet TaskManager.API.dll
