using Microsoft.EntityFrameworkCore;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Data;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
{
    public TaskRepository(TaskDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TaskItem>> GetAllOrderedByCreatedDateAsync()
    {
        return await _dbSet
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }
}
