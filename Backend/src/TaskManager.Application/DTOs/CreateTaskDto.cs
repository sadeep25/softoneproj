using TaskManager.Domain.Enums;

namespace TaskManager.Application.DTOs;

public record CreateTaskDto
{
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public Priority Priority { get; init; } = Priority.Medium;
    public DateTime? DueDate { get; init; }
    public string? Tags { get; init; }
}
