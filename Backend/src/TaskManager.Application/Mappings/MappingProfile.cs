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

        // UpdateTaskCommand to TaskItem
        CreateMap<UpdateTaskCommand, TaskItem>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // User to UserDto
        CreateMap<User, UserDto>();
    }
}
