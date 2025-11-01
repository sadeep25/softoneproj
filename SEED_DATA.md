# Database Seed Data

This document describes the sample data that is automatically seeded into the database when the application starts for the first time.

## Sample Users

The application seeds 5 sample users with different roles and purposes:

| Username | Password | Name | Email | Purpose |
|----------|----------|------|-------|---------|
| admin | admin123 | Admin User | admin@taskmanager.com | Administrative user with various team management tasks |
| johndoe | john123 | John Doe | john.doe@taskmanager.com | Backend developer with API and database tasks |
| janesmith | jane123 | Jane Smith | jane.smith@taskmanager.com | Frontend developer with UI/UX tasks |
| testuser | test123 | Test User | test@taskmanager.com | General testing account |
| demo | demo123 | Demo User | demo@taskmanager.com | Demonstration account |

**Note:** These passwords are stored in plain text for development purposes only. In production, passwords should be properly hashed using bcrypt or similar.

## Sample Tasks

The application seeds **19 sample tasks** with realistic data across different:
- **Statuses**: ToDo, InProgress, Done, Cancelled
- **Priorities**: Low, Medium, High, Critical
- **Categories**: Backend, Frontend, DevOps, Design, Testing, Documentation
- **Due dates**: Past, present, and future dates

### Task Distribution by Status

- **Done**: 4 tasks (completed tasks with completion dates)
- **InProgress**: 6 tasks (actively being worked on)
- **ToDo**: 8 tasks (pending tasks)
- **Cancelled**: 1 task (cancelled research task)

### Task Distribution by Priority

- **Critical**: 2 tasks (urgent security and deployment tasks)
- **High**: 6 tasks (important feature and planning tasks)
- **Medium**: 9 tasks (regular development and improvement tasks)
- **Low**: 2 tasks (nice-to-have features)

### Task Distribution by User

**Admin Tasks (6 tasks):**
- Setup development environment (Done)
- Review pull requests (InProgress)
- Update API documentation (ToDo)
- Fix security vulnerabilities (InProgress)
- Prepare production deployment (InProgress)
- Setup CI/CD pipeline (ToDo)
- Meeting: Sprint planning (ToDo)

**John's Tasks (5 tasks):**
- Implement user authentication (Done)
- Create task filtering API (InProgress)
- Write unit tests for task service (ToDo)
- Optimize database queries (ToDo)
- Research GraphQL implementation (Cancelled)

**Jane's Tasks (8 tasks):**
- Design task dashboard UI (Done)
- Implement NgRx state management (Done)
- Add task drag-and-drop (InProgress)
- Implement responsive design (ToDo)
- Add dark mode support (ToDo)
- Conduct user testing (ToDo)
- Fix login page layout bug (InProgress)

## Tags Used

Tasks are tagged with relevant categories for easy filtering:

- **Backend**: `api`, `backend`, `database`, `performance`, `optimization`
- **Frontend**: `frontend`, `angular`, `ui`, `ux`, `responsive`, `mobile`, `theme`
- **DevOps**: `devops`, `deployment`, `docker`, `automation`, `ci-cd`, `infrastructure`
- **Development**: `development`, `setup`, `features`
- **Quality**: `testing`, `quality`, `security`, `bug`
- **Management**: `code-review`, `team`, `planning`, `meeting`, `documentation`
- **Research**: `research`, `user-research`

## Seeding Behavior

### When Seeds Run

The database seeding logic runs automatically when:
1. The application starts (see [Program.cs](Backend/src/TaskManager.API/Program.cs:90))
2. The Users table is empty (fresh database)

### Seeding Process

1. **Check if users exist**: If any users exist, seeding is skipped
2. **Seed users**: Insert 5 sample users
3. **Seed tasks**: Insert 19 sample tasks associated with users
4. **Apply migrations**: Any pending EF Core migrations are applied
5. **Console logging**: Progress is logged to the console

### Viewing Seed Logs

When running the application, you'll see output like:
```
Seeding users...
Seeded 5 users successfully!
Seeding tasks...
Seeded 19 tasks successfully!
```

Or if data already exists:
```
Database already seeded. Skipping seed data.
```

## Testing the Application

You can immediately test the application after startup by:

1. **Login** with any of the sample users (e.g., `admin` / `admin123`)
2. **View tasks** - You'll see 19 tasks with various statuses
3. **Filter tasks** - Test filtering by status, priority, or tags
4. **Create new tasks** - Add your own tasks
5. **Update tasks** - Change status, priority, or details
6. **Complete tasks** - Mark tasks as done

## Resetting the Database

To reset the database and re-seed with fresh data:

### Using Docker
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Start fresh (will re-seed automatically)
docker-compose up -d
```

### Using Local Development
```bash
cd Backend

# Drop the database
dotnet ef database drop --project src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj --startup-project src/TaskManager.API/TaskManager.API.csproj

# Recreate and seed
dotnet run --project src/TaskManager.API/TaskManager.API.csproj
```

## Customizing Seed Data

To modify the seed data, edit [Backend/src/TaskManager.API/Data/DbSeeder.cs](Backend/src/TaskManager.API/Data/DbSeeder.cs):

1. **Add more users**: Add entries to the `users` array (line 32)
2. **Add more tasks**: Add entries to the `tasks` list (line 120)
3. **Modify existing data**: Change properties like titles, descriptions, dates, etc.
4. **Change priorities/statuses**: Use different enum values

After making changes, reset the database to see your new seed data.

## Production Considerations

**IMPORTANT**: This seed data is for development and testing only!

For production:
1. **Remove or disable seeding**: Comment out the seeding logic in Program.cs
2. **Use environment checks**: Only seed in Development environment
3. **Hash passwords**: Never store plain text passwords
4. **Use real data**: Import actual user and task data
5. **Security**: Remove test accounts and default credentials

Example production guard:
```csharp
// In Program.cs
if (app.Environment.IsDevelopment())
{
    await DbSeeder.SeedAsync(app.Services);
}
```
