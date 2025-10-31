using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<bool> ValidateUserAsync(string username, string password);
    Task<UserDto?> GetUserByUsernameAsync(string username);
}