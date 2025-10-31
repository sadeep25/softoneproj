using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Common;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AuthResponseDto>.FailureResponse("Invalid input data"));
            }

            var result = await _authService.LoginAsync(loginDto);

            if (result.Success)
            {
                _logger.LogInformation("User {Username} logged in successfully", loginDto.Username);
                return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result));
            }

            _logger.LogWarning("Failed login attempt for username: {Username}", loginDto.Username);
            return Unauthorized(ApiResponse<AuthResponseDto>.FailureResponse(result.Message ?? "Login failed"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during login for username: {Username}", loginDto.Username);
            return StatusCode(500, ApiResponse<AuthResponseDto>.FailureResponse("An internal error occurred"));
        }
    }

    [HttpGet("validate/{username}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> ValidateUser(string username)
    {
        try
        {
            var user = await _authService.GetUserByUsernameAsync(username);
            
            if (user != null)
            {
                return Ok(ApiResponse<UserDto>.SuccessResponse(user));
            }

            return NotFound(ApiResponse<UserDto>.FailureResponse("User not found"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while validating user: {Username}", username);
            return StatusCode(500, ApiResponse<UserDto>.FailureResponse("An internal error occurred"));
        }
    }
}