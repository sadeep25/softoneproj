using AutoMapper;
using MediatR;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Application.Features.Tasks.Queries.GetAllTasks;

public class GetAllTasksQueryHandler : IRequestHandler<GetAllTasksQuery, IEnumerable<TaskDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllTasksQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TaskDto>> Handle(GetAllTasksQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _unitOfWork.Tasks.GetAllOrderedByCreatedDateAsync();

        // Apply filters
        var filteredTasks = tasks.AsQueryable();

        if (request.Status.HasValue)
        {
            filteredTasks = filteredTasks.Where(t => t.Status == request.Status.Value);
        }

        if (request.Priority.HasValue)
        {
            filteredTasks = filteredTasks.Where(t => t.Priority == request.Priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.AssignedTo))
        {
            filteredTasks = filteredTasks.Where(t =>
                t.AssignedTo != null &&
                t.AssignedTo.Contains(request.AssignedTo, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.ToLower();
            filteredTasks = filteredTasks.Where(t =>
                t.Title.ToLower().Contains(searchTerm) ||
                (t.Description != null && t.Description.ToLower().Contains(searchTerm)));
        }

        // Map collection of entities to DTOs
        return _mapper.Map<IEnumerable<TaskDto>>(filteredTasks.ToList());
    }
}
