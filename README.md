# TaskManager - Full Stack Application

A production-ready full-stack Task Manager application built using **Clean Architecture** principles with .NET 10 backend and Angular 19 frontend.

## Project Structure

```
SoftOne/
├── src/                             # Backend (.NET)
│   ├── TaskManager.API/            # ASP.NET Core Web API
│   ├── TaskManager.Application/    # Application Layer (CQRS, MediatR)
│   ├── TaskManager.Domain/         # Domain Layer (Entities, Enums)
│   └── TaskManager.Infrastructure/ # Infrastructure Layer (EF Core, Repositories)
│
├── Frontend/
│   └── task-manager-ui/           # Angular 19 Frontend Application
│
└── .vscode/                        # VS Code configuration
```

## Architecture Overview

This project follows Clean Architecture principles with clear separation of concerns

### Layer Dependencies

- **Domain**: No dependencies (core business logic)
- **Application**: Depends on Domain only
- **Infrastructure**: Depends on Application (and Domain transitively)
- **API**: Depends on Application and Infrastructure

## Technologies & Patterns

### Backend Technologies
- **.NET 10** - Latest .NET framework
- **Entity Framework Core 10** - ORM for data access
- **SQL Server** - Database
- **Swagger/OpenAPI** - API documentation
- **AutoMapper** - Object-to-object mapping
- **FluentValidation** - Input validation

### Frontend Technologies
- **Angular 19** - Latest stable Angular version
- **TypeScript** - Type-safe JavaScript
- **SCSS** - CSS preprocessor
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing

### Architectural Patterns
- **Clean Architecture** - Separation of concerns, dependency inversion
- **CQRS** (Command Query Responsibility Segregation) - Separate read and write operations
- **MediatR** - In-process messaging for CQRS implementation
- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling and testability

### Best Practices
- **FluentValidation** - Input validation
- **Global Exception Handling** - Centralized error handling middleware
- **DTOs** - Data transfer objects for API contracts
- **Async/Await** - Asynchronous programming throughout

## Project Structure

### Domain Layer (`TaskManager.Domain`)
```
Domain/
├── Common/
│   ├── BaseEntity.cs              # Base class for all entities
│   └── IAuditableEntity.cs        # Interface for auditable entities
├── Entities/
│   └── TaskItem.cs                # Task entity with business logic
├── Enums/
│   ├── TaskStatus.cs              # Task status enumeration
│   └── Priority.cs                # Priority levels
└── Exceptions/
    └── DomainException.cs         # Domain-specific exceptions
```

### Application Layer (`TaskManager.Application`)
```
Application/
├── DTOs/
│   ├── TaskDto.cs                 # Task data transfer object
│   ├── CreateTaskDto.cs           # Create task DTO
│   └── UpdateTaskDto.cs           # Update task DTO
├── Features/
│   └── Tasks/
│       ├── Commands/              # Write operations
│       │   ├── CreateTask/
│       │   ├── UpdateTask/
│       │   ├── DeleteTask/
│       │   └── CompleteTask/
│       └── Queries/               # Read operations
│           ├── GetAllTasks/
│           └── GetTaskById/
├── Interfaces/
│   └── ITaskRepository.cs         # Repository interface
└── DependencyInjection.cs         # Service registration
```

### Infrastructure Layer (`TaskManager.Infrastructure`)
```
Infrastructure/
├── Data/
│   ├── TaskDbContext.cs           # EF Core DbContext
│   └── TaskDbContextFactory.cs    # Design-time factory
├── Repositories/
│   └── TaskRepository.cs          # Repository implementation
└── DependencyInjection.cs         # Service registration
```

### API Layer (`TaskManager.API`)
```
API/
├── Controllers/
│   └── TasksController.cs         # REST API endpoints
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs  # Global error handling
├── Program.cs                     # App configuration
└── appsettings.json              # Configuration settings
```

## API Endpoints

### Tasks Controller (`/api/tasks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update an existing task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| POST | `/api/tasks/{id}/complete` | Mark task as completed |

## Getting Started

### Prerequisites
- .NET 10 SDK or later
- SQL Server
- Node.js 22.x or later
- Angular CLI 20.x
- Visual Studio 2022 / VS Code / Rider (optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskManager
   ```

2. **Restore packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string** (if needed)

   Edit `src/TaskManager.API/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskManagerDb;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Apply database migrations**
   ```bash
   dotnet ef database update --project src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project src/TaskManager.API/TaskManager.API.csproj
   ```

5. **Run the application**
   ```bash
   cd src/TaskManager.API
   dotnet run
   ```

6. **Access Swagger UI**

   Open your browser and navigate to: `https://localhost:7195/`

   The Swagger UI will be displayed at the root URL in development mode.

### Frontend Setup

1. **Navigate to the Angular project**
   ```bash
   cd Frontend/task-manager-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Access the application**

   Open your browser and navigate to: `http://localhost:4200`

5. **Build for production**
   ```bash
   ng build --configuration production
   ```

## Development Workflow

### Adding a New Feature

1. **Domain Layer**: Add entities, enums, or business logic
2. **Application Layer**: Create DTOs, commands/queries, handlers, and validators
3. **Infrastructure Layer**: Implement repositories or data access logic
4. **API Layer**: Add controller endpoints

### Creating a Migration

```bash
dotnet ef migrations add <MigrationName> --project src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project src/TaskManager.API/TaskManager.API.csproj
```

### Updating the Database

```bash
dotnet ef database update --project src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project src/TaskManager.API/TaskManager.API.csproj
```

## Sample API Requests

### Create a Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": 2,
  "dueDate": "2025-11-01T00:00:00Z",
  "tags": "documentation,high-priority"
}
```

### Update a Task
```http
PUT /api/tasks/{id}
Content-Type: application/json

{
  "title": "Updated task title",
  "status": 1,
  "priority": 3
}
```

### Get All Tasks
```http
GET /api/tasks
```

### Complete a Task
```http
POST /api/tasks/{id}/complete
```

## Task Entity Properties

| Property | Type | Description |
|----------|------|-------------|
| Id | Guid | Unique identifier |
| Title | string | Task title (required, max 200 chars) |
| Description | string | Task description (optional, max 2000 chars) |
| Status | TaskStatus | 0=NotStarted, 1=InProgress, 2=Completed, 3=OnHold, 4=Cancelled |
| Priority | Priority | 0=Low, 1=Medium, 2=High, 3=Critical |
| DueDate | DateTime? | Optional due date |
| IsCompleted | bool | Completion flag |
| CompletedAt | DateTime? | Completion timestamp |
| CreatedAt | DateTime | Creation timestamp |
| UpdatedAt | DateTime? | Last update timestamp |
| CreatedBy | string | Creator identifier |
| UpdatedBy | string | Last modifier identifier |
| Tags | string | Comma-separated tags |

## Validation Rules

### Create Task
- Title: Required, max 200 characters
- Description: Max 2000 characters
- Priority: Must be valid enum value (0-3)
- DueDate: Must be in the future (if provided)

### Update Task
- Title: Max 200 characters (if provided)
- Description: Max 2000 characters (if provided)

## Error Handling

The API uses global exception handling middleware that returns consistent error responses:

```json
{
  "statusCode": 404,
  "message": "Entity \"TaskItem\" (guid) was not found."
}
```

For validation errors:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "property": "Title",
      "message": "Title is required."
    }
  ]
}
```

## Testing

### Running Tests
```bash
dotnet test
```

## Configuration

### CORS
The API is configured with a permissive CORS policy for development. Update `Program.cs` for production:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://yourapp.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Additional Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [MediatR Documentation](https://github.com/jbogard/MediatR)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
