using MediatR;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Enums;
using TaskStatus = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Application.Features.Tasks.Queries.GetAllTasks;

public class GetAllTasksQuery : IRequest<IEnumerable<TaskDto>>
{
    public TaskStatus? Status { get; set; }
    public Priority? Priority { get; set; }
    public string? AssignedTo { get; set; }
    public string? SearchTerm { get; set; }
}
