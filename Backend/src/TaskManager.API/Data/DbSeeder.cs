using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Infrastructure.Data;
using TaskStatus = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<TaskDbContext>();

        try
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Apply pending migrations
            if ((await context.Database.GetPendingMigrationsAsync()).Any())
            {
                await context.Database.MigrateAsync();
            }

            // Seed users if none exist
            if (!await context.Users.AnyAsync())
            {
                Console.WriteLine("Seeding users...");

                var users = new[]
                {
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "Admin User",
                        Email = "admin@taskmanager.com",
                        Username = "admin",
                        Password = "admin123", // In production, this should be hashed
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "John Doe",
                        Email = "john.doe@taskmanager.com",
                        Username = "johndoe",
                        Password = "john123", // In production, this should be hashed
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "Jane Smith",
                        Email = "jane.smith@taskmanager.com",
                        Username = "janesmith",
                        Password = "jane123", // In production, this should be hashed
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "Test User",
                        Email = "test@taskmanager.com",
                        Username = "testuser",
                        Password = "test123", // In production, this should be hashed
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "Demo User",
                        Email = "demo@taskmanager.com",
                        Username = "demo",
                        Password = "demo123", // In production, this should be hashed
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Users.AddRangeAsync(users);
                await context.SaveChangesAsync();

                Console.WriteLine($"Seeded {users.Length} users successfully!");

                // Seed tasks for the users
                await SeedTasksAsync(context, users);
            }
            else
            {
                Console.WriteLine("Database already seeded. Skipping seed data.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding database: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }

    private static async Task SeedTasksAsync(TaskDbContext context, User[] users)
    {
        if (await context.Tasks.AnyAsync())
        {
            Console.WriteLine("Tasks already exist. Skipping task seeding.");
            return;
        }

        Console.WriteLine("Seeding tasks...");

        var adminUser = users.First(u => u.Username == "admin");
        var johnUser = users.First(u => u.Username == "johndoe");
        var janeUser = users.First(u => u.Username == "janesmith");

        var tasks = new List<TaskItem>
        {
            // Admin's tasks
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Setup development environment",
                Description = "Install Docker, .NET 10 SDK, and configure IDE for the project",
                Status = TaskStatus.Done,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(-5),
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddDays(-3),
                CreatedBy = adminUser.Username,
                UpdatedBy = adminUser.Username,
                Tags = "setup,development,infrastructure",
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Review pull requests",
                Description = "Review and approve pending PRs from the team members",
                Status = TaskStatus.InProgress,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(2),
                IsCompleted = false,
                CreatedBy = adminUser.Username,
                Tags = "code-review,team",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Update API documentation",
                Description = "Update Swagger documentation with new endpoints and examples",
                Status = TaskStatus.ToDo,
                Priority = Priority.Low,
                DueDate = DateTime.UtcNow.AddDays(7),
                IsCompleted = false,
                CreatedBy = adminUser.Username,
                Tags = "documentation,api",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Fix security vulnerabilities",
                Description = "Address critical security issues found in the latest security audit",
                Status = TaskStatus.InProgress,
                Priority = Priority.Critical,
                DueDate = DateTime.UtcNow.AddDays(1),
                IsCompleted = false,
                CreatedBy = adminUser.Username,
                UpdatedBy = adminUser.Username,
                Tags = "security,critical,bug",
                CreatedAt = DateTime.UtcNow.AddHours(-12),
                UpdatedAt = DateTime.UtcNow.AddHours(-2)
            },

            // John's tasks
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Implement user authentication",
                Description = "Add JWT-based authentication with refresh token support",
                Status = TaskStatus.Done,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(-2),
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddDays(-1),
                CreatedBy = johnUser.Username,
                UpdatedBy = johnUser.Username,
                Tags = "authentication,security,backend",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Create task filtering API",
                Description = "Implement endpoints for filtering tasks by status, priority, and tags",
                Status = TaskStatus.InProgress,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(3),
                IsCompleted = false,
                CreatedBy = johnUser.Username,
                UpdatedBy = johnUser.Username,
                Tags = "api,backend,features",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Write unit tests for task service",
                Description = "Add comprehensive unit tests for TaskService methods with 80%+ coverage",
                Status = TaskStatus.ToDo,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(5),
                IsCompleted = false,
                CreatedBy = johnUser.Username,
                Tags = "testing,backend,quality",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Optimize database queries",
                Description = "Review and optimize slow queries, add proper indexes",
                Status = TaskStatus.ToDo,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(10),
                IsCompleted = false,
                CreatedBy = johnUser.Username,
                Tags = "database,performance,optimization",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },

            // Jane's tasks
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Design task dashboard UI",
                Description = "Create wireframes and mockups for the main task dashboard",
                Status = TaskStatus.Done,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(-4),
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddDays(-2),
                CreatedBy = janeUser.Username,
                UpdatedBy = janeUser.Username,
                Tags = "design,ui,frontend",
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Implement NgRx state management",
                Description = "Set up NgRx store for tasks and authentication state",
                Status = TaskStatus.Done,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(-1),
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddHours(-6),
                CreatedBy = janeUser.Username,
                UpdatedBy = janeUser.Username,
                Tags = "frontend,angular,state-management",
                CreatedAt = DateTime.UtcNow.AddDays(-6),
                UpdatedAt = DateTime.UtcNow.AddHours(-6)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Add task drag-and-drop",
                Description = "Implement drag-and-drop functionality for task status changes",
                Status = TaskStatus.InProgress,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(4),
                IsCompleted = false,
                CreatedBy = janeUser.Username,
                UpdatedBy = janeUser.Username,
                Tags = "frontend,ux,feature",
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow.AddHours(-3)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Implement responsive design",
                Description = "Ensure the application works well on mobile and tablet devices",
                Status = TaskStatus.ToDo,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(8),
                IsCompleted = false,
                CreatedBy = janeUser.Username,
                Tags = "frontend,responsive,mobile",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Add dark mode support",
                Description = "Implement theme switching with dark mode option",
                Status = TaskStatus.ToDo,
                Priority = Priority.Low,
                DueDate = DateTime.UtcNow.AddDays(15),
                IsCompleted = false,
                CreatedBy = janeUser.Username,
                Tags = "frontend,ui,theme",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },

            // Additional mixed tasks
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Prepare production deployment",
                Description = "Create Docker compose files and deployment documentation",
                Status = TaskStatus.InProgress,
                Priority = Priority.Critical,
                DueDate = DateTime.UtcNow.AddDays(2),
                IsCompleted = false,
                CreatedBy = adminUser.Username,
                Tags = "devops,deployment,docker",
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddHours(-1)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Setup CI/CD pipeline",
                Description = "Configure GitHub Actions for automated testing and deployment",
                Status = TaskStatus.ToDo,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(6),
                IsCompleted = false,
                CreatedBy = adminUser.Username,
                Tags = "devops,automation,ci-cd",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Conduct user testing",
                Description = "Organize user testing sessions and gather feedback",
                Status = TaskStatus.ToDo,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(12),
                IsCompleted = false,
                CreatedBy = janeUser.Username,
                Tags = "ux,testing,user-research",
                CreatedAt = DateTime.UtcNow
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Meeting: Sprint planning",
                Description = "Plan tasks for the next 2-week sprint",
                Status = TaskStatus.ToDo,
                Priority = Priority.High,
                DueDate = DateTime.UtcNow.AddDays(1),
                IsCompleted = false,
                CreatedBy = adminUser.Username,
                Tags = "meeting,planning,team",
                CreatedAt = DateTime.UtcNow.AddHours(-5)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Research GraphQL implementation",
                Description = "Evaluate if GraphQL would be beneficial for our API",
                Status = TaskStatus.Cancelled,
                Priority = Priority.Low,
                DueDate = DateTime.UtcNow.AddDays(-3),
                IsCompleted = false,
                CreatedBy = johnUser.Username,
                UpdatedBy = adminUser.Username,
                Tags = "research,api,cancelled",
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = "Fix login page layout bug",
                Description = "Login button is misaligned on Safari browser",
                Status = TaskStatus.InProgress,
                Priority = Priority.Medium,
                DueDate = DateTime.UtcNow.AddDays(2),
                IsCompleted = false,
                CreatedBy = janeUser.Username,
                UpdatedBy = janeUser.Username,
                Tags = "bug,frontend,ui",
                CreatedAt = DateTime.UtcNow.AddHours(-8),
                UpdatedAt = DateTime.UtcNow.AddHours(-2)
            }
        };

        await context.Tasks.AddRangeAsync(tasks);
        await context.SaveChangesAsync();

        Console.WriteLine($"Seeded {tasks.Count} tasks successfully!");
    }
}