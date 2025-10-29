# Quick Start Guide

## Running the Full Stack Application

### 1. Start the Backend API

Open a terminal in the project root and run:

```bash
# Navigate to the API project
cd src/TaskManager.API

# Run the API
dotnet run
```

The API will start at:
- **HTTPS**: `https://localhost:7195`
- **HTTP**: `http://localhost:5013`
- **Swagger UI**: `https://localhost:7195/`

### 2. Start the Frontend

Open a **new terminal** in the project root and run:

```bash
# Navigate to the Angular project
cd Frontend/task-manager-ui

# Start the development server
ng serve
```

The Angular app will start at:
- **URL**: `http://localhost:4200`

### 3. Access the Application

1. **Frontend**: Open your browser to `http://localhost:4200`
2. **API Docs**: Open `https://localhost:7195/` to see Swagger UI

## Proxy Configuration

The Angular app is configured to proxy API requests to the backend:
- All requests to `/api/*` are forwarded to `https://localhost:7195/api/*`
- This avoids CORS issues during development

## Project Structure

```
SoftOne/
├── src/                        # Backend (.NET)
│   ├── TaskManager.API/
│   ├── TaskManager.Application/
│   ├── TaskManager.Domain/
│   └── TaskManager.Infrastructure/
│
└── Frontend/
    └── task-manager-ui/       # Angular Frontend
```

## Quick Commands

### Backend

```bash
# Build
dotnet build

# Run
cd src/TaskManager.API && dotnet run

# Database migrations
cd src/TaskManager.API
dotnet ef database update --project ../TaskManager.Infrastructure/TaskManager.Infrastructure.csproj

# Create new migration
dotnet ef migrations add MigrationName --project ../TaskManager.Infrastructure/TaskManager.Infrastructure.csproj
```

### Frontend

```bash
cd Frontend/task-manager-ui

# Install dependencies
npm install

# Start dev server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Run linting
ng lint
```

## VS Code Debug Configuration

Press `F5` in VS Code to start debugging the backend API.

For the frontend, you can use the Angular debugging extensions or simply run `ng serve` in the terminal.

## Troubleshooting

### Backend issues:
- Ensure SQL Server is running
- Check connection string in `src/TaskManager.API/appsettings.json`
- Verify database migrations are applied

### Frontend issues:
- Run `npm install` to ensure all dependencies are installed
- Check that the backend API is running on `https://localhost:7195`
- Verify proxy configuration in `Frontend/task-manager-ui/proxy.conf.json`

### CORS issues:
- The proxy configuration should handle CORS for development
- If you access the API directly (not through proxy), ensure CORS is configured in `Program.cs`

## Next Steps

1. Check out the full [README.md](./README.md) for detailed documentation
2. Explore the API using Swagger UI at `https://localhost:7195/`
3. Start building your Angular components and services
4. Connect the frontend to the backend API endpoints
