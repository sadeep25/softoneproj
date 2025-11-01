# Docker Setup for Task Manager Application

This document explains how to run the Task Manager application using Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (comes with Docker Desktop)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:7195
   - Backend Swagger: http://localhost:7195/swagger
   - SQL Server: localhost:1433 (sa/TaskMgr#SecureP@ssw0rd2024!)

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove all data (including database):**
   ```bash
   docker-compose down -v
   ```

## Services

### SQL Server
- **Image:** mcr.microsoft.com/mssql/server:2022-latest
- **Port:** 1433
- **Credentials:**
  - Username: `sa`
  - Password: `TaskMgr#SecureP@ssw0rd2024!`
- **Database:** TaskManagerDb (created automatically)

### Backend (.NET API)
- **Port:** 7195
- **Environment:** Development
- **Features:**
  - Automatic database migrations on startup
  - Swagger UI enabled
  - CORS configured for frontend

### Frontend (Angular)
- **Port:** 4200
- **Features:**
  - Nginx web server
  - API proxy to backend
  - Production-optimized build

## Common Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sqlserver
```

### Rebuild services
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Access containers
```bash
# Backend shell
docker exec -it taskmanager-backend bash

# Frontend shell
docker exec -it taskmanager-frontend sh

# SQL Server shell
docker exec -it taskmanager-sqlserver bash
```

### Check service status
```bash
docker-compose ps
```

### Restart services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Database Management

### Connect to SQL Server from host
```bash
# Using sqlcmd (if installed locally)
sqlcmd -S localhost,1433 -U sa -P "TaskMgr#SecureP@ssw0rd2024!" -C

# Using Azure Data Studio or SQL Server Management Studio
Server: localhost,1433
Username: sa
Password: TaskMgr#SecureP@ssw0rd2024!
```

### Run migrations manually
```bash
# Access backend container
docker exec -it taskmanager-backend bash

# Navigate to API project
cd /src/src/TaskManager.API

# Run migrations
dotnet ef database update --project ../TaskManager.Infrastructure/TaskManager.Infrastructure.csproj
```

### Backup database
```bash
docker exec taskmanager-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "TaskMgr#SecureP@ssw0rd2024!" -C \
  -Q "BACKUP DATABASE TaskManagerDb TO DISK = '/var/opt/mssql/backup/TaskManagerDb.bak'"

# Copy backup to host
docker cp taskmanager-sqlserver:/var/opt/mssql/backup/TaskManagerDb.bak ./TaskManagerDb.bak
```

## Environment Variables

### Backend
You can customize backend settings in [docker-compose.yml](docker-compose.yml):
- `ConnectionStrings__DefaultConnection`: Database connection string
- `Jwt__Key`: JWT signing key (change for production!)
- `Jwt__Issuer`: JWT issuer
- `Jwt__Audience`: JWT audience
- `Jwt__ExpiresDays`: Token expiration days

### SQL Server
- `SA_PASSWORD`: Change the default password in production!
- `MSSQL_PID`: SQL Server edition (Developer, Express, Standard, Enterprise)

## Troubleshooting

### Backend won't start
1. Check SQL Server is healthy:
   ```bash
   docker-compose ps
   docker-compose logs sqlserver
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

3. Restart backend:
   ```bash
   docker-compose restart backend
   ```

### Frontend can't connect to backend
1. Check nginx configuration in [Frontend/nginx.conf](Frontend/nginx.conf)
2. Verify backend is running:
   ```bash
   docker-compose ps backend
   ```
3. Test backend directly: http://localhost:7195/swagger

### Database migrations fail
1. Access backend container:
   ```bash
   docker exec -it taskmanager-backend bash
   ```

2. Run migrations manually:
   ```bash
   cd /src/src/TaskManager.API
   dotnet ef database update --project ../TaskManager.Infrastructure/TaskManager.Infrastructure.csproj
   ```

### Port conflicts
If ports 4200, 7195, or 1433 are already in use, edit [docker-compose.yml](docker-compose.yml):
```yaml
ports:
  - "YOUR_PORT:80"  # Change YOUR_PORT to an available port
```

## Production Considerations

Before deploying to production:

1. **Change SQL Server password** in docker-compose.yml
2. **Change JWT secret key** to a secure random string
3. **Update CORS policy** in backend to allow only your frontend domain
4. **Use environment-specific settings** files
5. **Enable HTTPS** with proper certificates
6. **Set up proper backup strategy** for SQL Server
7. **Use Docker secrets** for sensitive data instead of environment variables
8. **Configure resource limits** for containers
9. **Set up monitoring and logging**
10. **Use a reverse proxy** (like Traefik or nginx) for production routing

## Network Architecture

All services run on a custom bridge network (`taskmanager-network`):
- Services communicate using container names (e.g., `backend`, `sqlserver`)
- Frontend proxies API requests to backend through nginx
- SQL Server is only accessible from backend (not exposed to frontend)

## Volume Persistence

- `sqlserver-data`: Persists SQL Server database files
- To reset the database completely: `docker-compose down -v`

## Building for Different Environments

### Development
```bash
docker-compose up -d
```

### Production
Create a `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  backend:
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
  # Add production-specific configs
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
