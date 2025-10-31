using MediatR;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Application.Features.Auth.Queries.GetUserByUsername;

public class GetUserByUsernameQueryHandler : IRequestHandler<GetUserByUsernameQuery, UserDto?>
{
    private readonly IAuthService _authService;

    public GetUserByUsernameQueryHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<UserDto?> Handle(GetUserByUsernameQuery request, CancellationToken cancellationToken)
    {
        return await _authService.GetUserByUsernameAsync(request.Username);
    }
}
