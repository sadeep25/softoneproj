# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Task Manager application using Clean Architecture with .NET 10 backend and Angular 20 frontend. The backend follows CQRS pattern with MediatR, and the frontend uses NgRx for state management.

## Directory Structure

- `Backend/` - .NET 10 backend application
  - `src/TaskManager.Domain/` - Domain layer (entities, enums, exceptions)
  - `src/TaskManager.Application/` - Application layer (CQRS commands/queries, DTOs, validators)
  - `src/TaskManager.Infrastructure/` - Infrastructure layer (EF Core, repositories, data context)
  - `src/TaskManager.API/` - API layer (controllers, middleware, program configuration)
- `Frontend/` - Angular 20 frontend application
  - `src/app/core/` - Core module (guards, interceptors, services, NgRx store)
  - `src/app/features/` - Feature modules (auth, tasks)
  - `src/app/shared/` - Shared components and utilities

## Common Commands

### Backend (.NET)

All backend commands should be run from the `Backend/` directory unless otherwise specified.

**Build the solution:**
```bash
cd Backend
dotnet build
```

**Run the API:**
```bash
cd Backend/src/TaskManager.API
dotnet run
```
API runs at `https://localhost:7195` with Swagger UI at the root.

**Create a new migration:**
```bash
cd Backend
dotnet ef migrations add <MigrationName> --project src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project src/TaskManager.API/TaskManager.API.csproj
```

**Update the database:**
```bash
cd Backend
dotnet ef database update --project src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project src/TaskManager.API/TaskManager.API.csproj
```

**Run tests:**
```bash
cd Backend
dotnet test
```

**Clean build artifacts:**
```bash
cd Backend
dotnet clean
```

### Frontend (Angular)

All frontend commands should be run from the `Frontend/` directory.

**Install dependencies:**
```bash
cd Frontend
npm install
```

**Run development server:**
```bash
cd Frontend
npm start
# or
ng serve
```
App runs at `http://localhost:4200` with proxy to backend at `https://localhost:7195`.

**Build for production:**
```bash
cd Frontend
npm run build
```

**Run tests:**
```bash
cd Frontend
npm test
# or
ng test
```

**Build in watch mode:**
```bash
cd Frontend
npm run watch
```

## Architecture

### Backend Clean Architecture

The backend follows strict Clean Architecture principles with clear layer separation:

1. **Domain Layer** (`TaskManager.Domain`)
   - Core business entities (TaskItem, User)
   - Enums (TaskStatus, Priority)
   - Base classes (BaseEntity, IAuditableEntity)
   - Domain exceptions
   - **No dependencies on other layers**

2. **Application Layer** (`TaskManager.Application`)
   - CQRS implementation using MediatR
   - Commands organized by feature in `Features/<Entity>/Commands/<Action>/`
   - Queries organized by feature in `Features/<Entity>/Queries/<Action>/`
   - Each command/query has its own file, handler, and validator
   - DTOs for data transfer
   - Interfaces (ITaskRepository, IUserRepository, IAuthService)
   - FluentValidation validators
   - AutoMapper profiles
   - **Depends only on Domain layer**

3. **Infrastructure Layer** (`TaskManager.Infrastructure`)
   - EF Core DbContext and migrations
   - Repository implementations (GenericRepository, TaskRepository, UserRepository)
   - Unit of Work pattern implementation
   - Database seeding logic
   - **Depends on Application layer**

4. **API Layer** (`TaskManager.API`)
   - RESTful controllers
   - Global exception handling middleware
   - JWT authentication configuration
   - CORS policy
   - Swagger/OpenAPI setup
   - **Depends on Application and Infrastructure layers**

### Frontend Architecture

The Angular frontend uses a modular architecture with NgRx for state management:

1. **Core Module** (`app/core/`)
   - **Guards**: Route protection (auth.guard.ts)
   - **Interceptors**: HTTP interceptors for auth tokens, error handling, and loading states
   - **Services**: Business logic services (auth.service.ts, task.service.ts)
   - **Store**: NgRx store modules organized by feature:
     - `auth/` - Authentication state (actions, effects, reducer)
     - `task/` - Task management state
     - `loading/` - Global loading state
     - `notification/` - Global notification/error handling

2. **Features Module** (`app/features/`)
   - **auth/**: Login and authentication components
   - **tasks/**: Task list, task details, task filters components

3. **Shared Module** (`app/shared/`)
   - Reusable components, directives, and pipes

### State Management Pattern

The frontend uses NgRx with the following pattern:
- **Actions**: Define events (e.g., `loadTasks`, `createTask`, `loginSuccess`)
- **Effects**: Handle side effects like HTTP calls, dispatch success/failure actions
- **Reducers**: Pure functions that update state based on actions
- **Selectors**: Query specific slices of state

### Authentication Flow

1. User submits credentials via login form
2. `AuthEffects` calls `AuthService.login()` which sends POST to `/api/auth/login`
3. Backend validates credentials, generates JWT token
4. Frontend stores token in state (consider adding localStorage)
5. `authInterceptor` adds JWT to Authorization header for subsequent requests
6. `auth.guard.ts` protects routes requiring authentication

## Key Patterns and Conventions

### Backend

- **CQRS**: Commands modify state, Queries read state. Each has dedicated handler implementing `IRequestHandler<TRequest, TResponse>`
- **MediatR**: All commands/queries go through MediatR pipeline with validation behavior
- **Validation**: FluentValidation validators automatically run before handlers via `ValidationBehavior`
- **Repository Pattern**: Use `IGenericRepository<T>` for basic CRUD, extend with specific repositories (e.g., `ITaskRepository`) for custom queries
- **Unit of Work**: Use `IUnitOfWork` to coordinate multiple repository operations in a transaction
- **Async/Await**: All database operations are asynchronous

### Frontend

- **NgRx State**: Always dispatch actions, never mutate state directly
- **HTTP Interceptors**: Three interceptors in order: auth → error → loading
- **Routing**: Define routes in `app.routes.ts`, protect with guards
- **Services**: Use services for HTTP calls, inject into effects not components
- **Component Communication**: Prefer store over @Input/@Output for complex state
- **Angular 20 Signals**: Always use signal-based APIs for reactivity:
  - Use `input()` and `input.required()` for component inputs instead of `@Input()`
  - Use `output()` for component outputs instead of `@Output()`
  - Use `viewChild()` and `viewChildren()` instead of `@ViewChild()` and `@ViewChildren()`
  - Use `contentChild()` and `contentChildren()` instead of `@ContentChild()` and `@ContentChildren()`
  - Use `model()` for two-way binding instead of `@Input()` + `@Output()`
  - Prefer `signal()`, `computed()`, and `effect()` for component state management
  - Use `toSignal()` to convert Observables to signals when needed

## Adding New Features

### Backend

When adding a new feature (e.g., "Comments"):

1. **Domain Layer**: Create entity in `TaskManager.Domain/Entities/Comment.cs`
2. **Application Layer**:
   - Create DTOs in `Application/DTOs/`
   - Create feature folder `Application/Features/Comments/`
   - Add commands in `Features/Comments/Commands/<Action>/`
   - Add queries in `Features/Comments/Queries/<Action>/`
   - Each command/query needs: Command class, Handler, Validator (optional)
   - Add repository interface in `Application/Interfaces/ICommentRepository.cs`
3. **Infrastructure Layer**:
   - Add DbSet to `TaskDbContext`
   - Implement repository in `Infrastructure/Repositories/CommentRepository.cs`
   - Create migration: `dotnet ef migrations add AddComments ...`
4. **API Layer**:
   - Create controller `API/Controllers/CommentsController.cs`
   - Inject `IMediator`, send commands/queries via `await _mediator.Send(command)`

### Frontend

When adding a new feature (e.g., "Comments"):

1. **Create feature module**: `Frontend/src/app/features/comments/`
2. **Add NgRx store slice**:
   - Create `core/store/comments/` with actions, effects, reducer
   - Register in `app.config.ts` providers
3. **Create service**: `core/services/comment.service.ts` for HTTP calls
4. **Create components**: In `features/comments/components/`
5. **Add routes**: Update `app.routes.ts`
6. **Add models**: Create TypeScript interfaces in `core/models/`

## Database Configuration

Connection string in `Backend/src/TaskManager.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TaskManagerDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

Uses SQL Server. Update connection string as needed for your environment.

## JWT Authentication

JWT configuration in `appsettings.json`:
- Key must be at least 32 characters
- Tokens expire after 30 days by default
- Update `Jwt:Key` for production deployments

## API Proxy

Frontend uses proxy configuration (`Frontend/proxy.conf.json`) to forward `/api` requests to `https://localhost:7195` during development, avoiding CORS issues.

## Error Handling

- **Backend**: Global `ExceptionHandlingMiddleware` catches all exceptions, returns consistent JSON error responses
- **Frontend**: `errorInterceptor` catches HTTP errors, dispatches notification actions, NgRx `NotificationEffects` handle error display

## Testing

- Backend: Use xUnit or NUnit for unit tests (to be added)
- Frontend: Jasmine/Karma configured for unit tests (`ng test`)

## Important Notes

- The solution file is at `Backend/TaskManager.slnx` (newer XML-based format)
- Database is seeded on application startup (see `DbSeeder` in `Program.cs`)
- CORS is configured as "AllowAll" for development - restrict for production
- Frontend uses standalone components (no NgModule)
- Angular uses SCSS for styling
- Prettier is configured for code formatting (see `Frontend/package.json`)

## Angular 20 Signal-Based APIs

This project uses Angular 20 and **must always use signal-based APIs** for modern reactive patterns:

### Component Inputs/Outputs
```typescript
// ✅ CORRECT - Use signal-based APIs
import { Component, input, output, model } from '@angular/core';

export class MyComponent {
  // Input signals
  title = input<string>();                    // Optional input
  userId = input.required<string>();          // Required input

  // Output signals
  save = output<void>();                      // Event emitter
  valueChange = output<string>();             // Value change event

  // Two-way binding with model
  value = model<string>('');                  // [(value)]
}

// ❌ INCORRECT - Don't use decorator-based APIs
@Input() title?: string;
@Output() save = new EventEmitter<void>();
```

### View Queries
```typescript
// ✅ CORRECT - Use signal-based queries
import { Component, viewChild, viewChildren, contentChild, contentChildren } from '@angular/core';

export class MyComponent {
  // Single element/component
  submitButton = viewChild<ElementRef>('submitBtn');
  childComponent = viewChild(ChildComponent);

  // Multiple elements/components
  allButtons = viewChildren<ElementRef>('btn');
  allChildren = viewChildren(ChildComponent);

  // Content projection queries
  projectedItem = contentChild(ItemComponent);
  projectedItems = contentChildren(ItemComponent);
}

// ❌ INCORRECT - Don't use decorators
@ViewChild('submitBtn') submitButton?: ElementRef;
@ViewChildren(ChildComponent) children?: QueryList<ChildComponent>;
```

### Component State
```typescript
// ✅ CORRECT - Use signals for reactive state
import { Component, signal, computed, effect } from '@angular/core';

export class MyComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }

  increment() {
    this.count.update(c => c + 1);
  }
}

// In template: {{ count() }} or {{ doubleCount() }}
```

### Converting Observables to Signals
```typescript
// ✅ Use toSignal() for Observable → Signal conversion
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export class MyComponent {
  private taskService = inject(TaskService);

  // Convert Observable to Signal
  tasks = toSignal(this.taskService.getTasks(), { initialValue: [] });

  // Use in template: {{ tasks() }}
}
```

### Signal-Based Debouncing
```typescript
// ✅ CORRECT - Use signals with effect for debouncing (no RxJS needed)
import { Component, signal, effect } from '@angular/core';

export class SearchComponent {
  private searchTerm = signal<string>('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const term = this.searchTerm();

      // Clear previous timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // Set new debounced action
      this.debounceTimer = setTimeout(() => {
        this.performSearch(term);
      }, 500);
    });
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  private performSearch(term: string) {
    // Your search logic here
  }
}

// ❌ INCORRECT - Don't use RxJS Subject/Observable for simple debouncing
private search$ = new Subject<string>();
constructor() {
  this.search$.pipe(debounceTime(500)).subscribe(...);
}
```

### Key Benefits of Signals
- **Change Detection**: More efficient, fine-grained reactivity
- **Type Safety**: Better TypeScript inference
- **Simplicity**: No need for `async` pipe in templates for simple cases
- **Composition**: Easy to combine with `computed()`
- **Performance**: Only updates what actually changed

**Important**: When creating new components or refactoring existing ones, always prefer signal-based APIs over decorator-based APIs. This aligns with Angular's modern direction and provides better performance and developer experience.
