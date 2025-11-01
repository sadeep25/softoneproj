using AutoMapper;
using TaskManager.Application.DTOs;
using TaskManager.Application.Features.Tasks.Commands.CreateTask;
using TaskManager.Application.Features.Tasks.Commands.UpdateTask;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // TaskItem to TaskDto
        CreateMap<TaskItem, TaskDto>();

        // CreateTaskDto to TaskItem
        CreateMap<CreateTaskDto, TaskItem>();

        // CreateTaskCommand to TaskItem
        CreateMap<CreateTaskCommand, TaskItem>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Domain.Enums.TaskStatus.ToDo))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        // UpdateTaskDto to TaskItem
        CreateMap<UpdateTaskDto, TaskItem>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // UpdateTaskCommand to TaskItem - Only map properties that are explicitly set
        CreateMap<UpdateTaskCommand, TaskItem>()
            .ForMember(dest => dest.Title, opt => opt.Condition(src => src.Title != null))
            .ForMember(dest => dest.Description, opt => opt.Condition(src => src.Description != null))
            .ForMember(dest => dest.Status, opt => opt.Condition(src => src.Status.HasValue))
            .ForMember(dest => dest.Priority, opt => opt.Condition(src => src.Priority.HasValue))
            .ForMember(dest => dest.DueDate, opt => opt.Condition(src => src.DueDate.HasValue))
            .ForMember(dest => dest.Tags, opt => opt.Condition(src => src.Tags != null))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsCompleted, opt => opt.Ignore())
            .ForMember(dest => dest.CompletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore());

        // User to UserDto
        CreateMap<User, UserDto>();
    }
}
