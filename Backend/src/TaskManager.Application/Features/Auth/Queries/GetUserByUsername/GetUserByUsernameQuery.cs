using MediatR;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Features.Auth.Queries.GetUserByUsername;

public class GetUserByUsernameQuery : IRequest<UserDto?>
{
    public string Username { get; set; } = string.Empty;
}
