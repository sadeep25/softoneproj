using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Tasks.Commands.CompleteTask;

public class CompleteTaskCommand : IRequest<TaskDto>
{
    public Guid Id { get; set; }
}
