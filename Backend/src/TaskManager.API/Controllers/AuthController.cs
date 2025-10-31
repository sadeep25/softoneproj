using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Common;
using TaskManager.Application.DTOs;
using TaskManager.Application.Features.Auth.Commands.Login;
using TaskManager.Application.Features.Auth.Queries.GetUserByUsername;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Authenticates a user with username and password
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.Success)
        {
            _logger.LogInformation("User {Username} logged in successfully", command.Username);
            return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result, "Login successful"));
        }

        _logger.LogWarning("Failed login attempt for username: {Username}", command.Username);
        return Unauthorized(ApiResponse<AuthResponseDto>.FailureResponse(result.Message ?? "Login failed"));
    }

    /// <summary>
    /// Validates if a user exists by username
    /// </summary>
    [HttpGet("validate/{username}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserDto>>> ValidateUser(string username)
    {
        var query = new GetUserByUsernameQuery { Username = username };
        var user = await _mediator.Send(query);

        if (user != null)
        {
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "User found"));
        }

        return NotFound(ApiResponse<UserDto>.FailureResponse("User not found"));
    }
}
