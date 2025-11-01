# Docker Setup Complete! 🎉

Your Task Manager application is now fully containerized and running with Docker Compose!

## Current Status

All services are **UP and RUNNING**:

- ✅ **SQL Server**: localhost:1433 (healthy)
- ✅ **Backend API**: http://localhost:7195
- ✅ **Frontend App**: http://localhost:4200
- ✅ **Database Seeded**: 5 users + 19 tasks

## Quick Access

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | Angular application |
| **Backend Swagger** | http://localhost:7195 | API documentation |
| **SQL Server** | localhost:1433 | Database server |

## Sample Login Credentials

You can login immediately with these pre-seeded users:

| Username | Password | Name | Role |
|----------|----------|------|------|
| admin | admin123 | Admin User | Admin |
| johndoe | john123 | John Doe | Backend Dev |
| janesmith | jane123 | Jane Smith | Frontend Dev |
| testuser | test123 | Test User | Tester |
| demo | demo123 | Demo User | Demo |

## Sample Data

The database has been automatically seeded with:

### 5 Users
All users are active and ready to use

### 19 Tasks
Distributed across different statuses:
- **4 Done** - Completed tasks
- **6 In Progress** - Active tasks
- **8 To Do** - Pending tasks
- **1 Cancelled** - Cancelled task

With various priorities:
- **2 Critical** (security, deployment)
- **6 High** (features, planning)
- **9 Medium** (development)
- **2 Low** (nice-to-have)

## Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sqlserver
```

### Check Status
```bash
docker-compose ps
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Reset Everything (including database)
```bash
docker-compose down -v  # -v removes volumes
docker-compose up -d
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose up -d --build backend

# Rebuild all
docker-compose up -d --build
```

## Database Connection

### From Host Machine

**Using SQL Server Management Studio or Azure Data Studio:**
- Server: `localhost,1433`
- Username: `sa`
- Password: `TaskMgr#SecureP@ssw0rd2024!`
- Database: `TaskManagerDb`

**Using sqlcmd:**
```bash
sqlcmd -S localhost,1433 -U sa -P "TaskMgr#SecureP@ssw0rd2024!" -C
```

### From Backend Container

The backend automatically connects using the connection string in docker-compose.yml

## What Happens on Startup

1. **SQL Server** starts and becomes healthy
2. **Backend** waits for SQL Server health check
3. **Backend entrypoint script**:
   - Waits for SQL Server to be ready
   - Creates database if it doesn't exist
   - Runs pending EF Core migrations
   - Seeds users and tasks (if database is empty)
4. **Backend API** starts and listens on port 80 (mapped to 7195)
5. **Frontend** starts and proxies `/api` requests to backend

## Architecture

```
┌─────────────────┐
│    Frontend     │  http://localhost:4200
│  (Angular 20)   │
│   nginx:alpine  │
└────────┬────────┘
         │ /api proxy
         ▼
┌─────────────────┐
│    Backend      │  http://localhost:7195
│   (.NET 10)     │
│  Swagger UI: /  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SQL Server    │  localhost:1433
│      2022       │
│  TaskManagerDb  │
└─────────────────┘
```

## Technology Stack

### Backend
- .NET 10.0 (preview)
- EF Core 10.0 RC
- MediatR (CQRS)
- FluentValidation
- AutoMapper
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- Angular 20
- NgRx (State Management)
- SCSS Styling
- Nginx (Production Server)

### Database
- SQL Server 2022 (Developer Edition)
- Automatic migrations
- Seeded sample data

## Testing the Application

### 1. Open Frontend
Visit http://localhost:4200

### 2. Login
Use any of the sample credentials above (e.g., `admin` / `admin123`)

### 3. Explore
- View the 19 pre-seeded tasks
- Filter by status, priority, or tags
- Create new tasks
- Update existing tasks
- Mark tasks as complete

### 4. Test API
Visit http://localhost:7195 to access Swagger UI and test API endpoints

## Files Created

- [docker-compose.yml](docker-compose.yml) - Main orchestration file
- [Backend/Dockerfile](Backend/Dockerfile) - Backend build instructions
- [Backend/docker-entrypoint.sh](Backend/docker-entrypoint.sh) - Backend startup script
- [Backend/.dockerignore](Backend/.dockerignore) - Backend ignore patterns
- [Frontend/Dockerfile](Frontend/Dockerfile) - Frontend build instructions
- [Frontend/nginx.conf](Frontend/nginx.conf) - Nginx configuration
- [Frontend/.dockerignore](Frontend/.dockerignore) - Frontend ignore patterns
- [.dockerignore](.dockerignore) - Root ignore patterns
- [README.Docker.md](README.Docker.md) - Detailed Docker documentation
- [SEED_DATA.md](SEED_DATA.md) - Seed data documentation

## Next Steps

1. **Test the application** - Login and explore the pre-seeded data
2. **Review the code** - See how Clean Architecture is implemented
3. **Add features** - Create new tasks, users, or functionality
4. **Customize seed data** - Edit `DbSeeder.cs` to add your own data
5. **Deploy to production** - Follow production guidelines in README.Docker.md

## Important Notes

### .NET 10 Preview
This project uses .NET 10 preview images:
- `mcr.microsoft.com/dotnet/nightly/sdk:10.0-preview`
- `mcr.microsoft.com/dotnet/nightly/aspnet:10.0-preview`

For production, consider using stable .NET 9.0 images or wait for .NET 10 GA.

### Security
- Default passwords are for development only
- SQL Server password: `TaskMgr#SecureP@ssw0rd2024!`
- Change all passwords for production
- User passwords are NOT hashed (development only)

### Data Persistence
- Database data is persisted in Docker volume `sqlserver-data`
- To clear all data: `docker-compose down -v`
- Without `-v` flag, data persists across restarts

## Troubleshooting

### Backend won't start
Check logs: `docker-compose logs backend`
Most common issue: SQL Server not ready. Wait 30 seconds and check again.

### Frontend shows 404
- Clear browser cache
- Verify container is running: `docker-compose ps`
- Check logs: `docker-compose logs frontend`

### Can't connect to SQL Server
- Wait for health check: `docker-compose ps` should show "healthy"
- Verify port: `netstat -an | findstr 1433`
- Check password matches in connection string

### Port conflicts
If ports 4200, 7195, or 1433 are in use, edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"  # Change YOUR_PORT
```

## Support

For detailed documentation, see:
- [README.Docker.md](README.Docker.md) - Comprehensive Docker guide
- [SEED_DATA.md](SEED_DATA.md) - Sample data documentation
- [CLAUDE.md](CLAUDE.md) - Project structure and conventions

## Success Checklist

- ✅ SQL Server running and healthy
- ✅ Backend API accessible at http://localhost:7195
- ✅ Frontend app accessible at http://localhost:4200
- ✅ Database seeded with 5 users
- ✅ Database seeded with 19 tasks
- ✅ Can login with sample credentials
- ✅ Can view and interact with tasks

**Everything is ready to go! 🚀**

Start exploring your fully containerized Task Manager application!
