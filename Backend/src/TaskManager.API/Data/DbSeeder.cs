using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

namespace TaskManager.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<TaskDbContext>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed users if none exist
        if (!await context.Users.AnyAsync())
        {
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
                    Name = "Test User",
                    Email = "test@taskmanager.com",
                    Username = "testuser",
                    Password = "test123", // In production, this should be hashed
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}