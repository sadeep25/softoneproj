using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Common;
using TaskManager.Application.DTOs;
using TaskManager.Application.Features.Tasks.Commands.CompleteTask;
using TaskManager.Application.Features.Tasks.Commands.CreateTask;
using TaskManager.Application.Features.Tasks.Commands.DeleteTask;
using TaskManager.Application.Features.Tasks.Commands.UpdateTask;
using TaskManager.Application.Features.Tasks.Queries.GetAllTasks;
using TaskManager.Application.Features.Tasks.Queries.GetTaskById;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<TaskDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IEnumerable<TaskDto>>>> GetAllTasks(
        [FromQuery] TaskManager.Domain.Enums.TaskStatus? status,
        [FromQuery] TaskManager.Domain.Enums.Priority? priority,
        [FromQuery] string? searchTerm)
    {
        var query = new GetAllTasksQuery
        {
            Status = status,
            Priority = priority,
            SearchTerm = searchTerm
        };

        var tasks = await _mediator.Send(query);
        return Ok(ApiResponse<IEnumerable<TaskDto>>.SuccessResponse(tasks, "Tasks retrieved successfully"));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaskDto>>> GetTaskById(Guid id)
    {
        var task = await _mediator.Send(new GetTaskByIdQuery { Id = id });
        return Ok(ApiResponse<TaskDto>.SuccessResponse(task, "Task retrieved successfully"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TaskDto>>> CreateTask([FromBody] CreateTaskCommand command)
    {
        var task = await _mediator.Send(command);
        var response = ApiResponse<TaskDto>.SuccessResponse(task, "Task created successfully");
        return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, response);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TaskDto>>> UpdateTask(Guid id, [FromBody] UpdateTaskCommand command)
    {
        command.Id = id;
        var task = await _mediator.Send(command);
        return Ok(ApiResponse<TaskDto>.SuccessResponse(task, "Task updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteTask(Guid id)
    {
        await _mediator.Send(new DeleteTaskCommand { Id = id });
        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Task deleted successfully"));
    }

    [HttpPost("{id:guid}/complete")]
    [ProducesResponseType(typeof(ApiResponse<TaskDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaskDto>>> CompleteTask(Guid id)
    {
        var task = await _mediator.Send(new CompleteTaskCommand { Id = id });
        return Ok(ApiResponse<TaskDto>.SuccessResponse(task, "Task marked as completed"));
    }
}
