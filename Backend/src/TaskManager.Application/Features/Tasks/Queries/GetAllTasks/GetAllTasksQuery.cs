using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Queries.GetAllTasks;

public class GetAllTasksQuery : IRequest<IEnumerable<TaskDto>>
{
}
