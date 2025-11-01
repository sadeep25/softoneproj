using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TaskManager.API.Middleware;

/// <summary>
/// Middleware for JWT token validation and authentication logging
/// </summary>
public class JwtAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtAuthenticationMiddleware> _logger;
    private readonly IConfiguration _configuration;

    public JwtAuthenticationMiddleware(
        RequestDelegate next,
        ILogger<JwtAuthenticationMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Extract token from Authorization header
        var token = ExtractTokenFromHeader(context);

        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                // Validate the token
                var validationResult = await ValidateTokenAsync(token);

                if (validationResult.IsValid)
                {
                    // Log successful authentication
                    var userId = validationResult.UserId;
                    var username = validationResult.Username;

                    _logger.LogInformation(
                        "JWT token validated successfully for user: {Username} (ID: {UserId})",
                        username, userId);

                    // Add custom headers for debugging (optional, remove in production)
                    if (context.Request.Headers.ContainsKey("X-Debug"))
                    {
                        context.Response.Headers.Append("X-Authenticated-User", username ?? "Unknown");
                        context.Response.Headers.Append("X-User-Id", userId ?? "Unknown");
                    }
                }
                else
                {
                    _logger.LogWarning(
                        "JWT token validation failed: {Reason}. Token: {TokenPreview}",
                        validationResult.ErrorMessage,
                        token.Substring(0, Math.Min(20, token.Length)) + "...");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating JWT token");
            }
        }
        else
        {
            // Log requests without tokens (only for protected endpoints)
            var path = context.Request.Path.Value ?? string.Empty;
            var isPublicEndpoint = IsPublicEndpoint(path);

            if (!isPublicEndpoint)
            {
                _logger.LogWarning(
                    "Request to protected endpoint without JWT token: {Method} {Path}",
                    context.Request.Method,
                    path);
            }
        }

        // Continue to next middleware
        await _next(context);
    }

    private string? ExtractTokenFromHeader(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();

        if (string.IsNullOrEmpty(authHeader))
        {
            return null;
        }

        // Check if it's a Bearer token
        if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return authHeader.Substring("Bearer ".Length).Trim();
        }

        return null;
    }

    private async Task<TokenValidationResult> ValidateTokenAsync(string token)
    {
        try
        {
            var key = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(key))
            {
                return new TokenValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "JWT Key not configured"
                };
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                ValidateIssuer = !string.IsNullOrEmpty(issuer),
                ValidIssuer = issuer,
                ValidateAudience = !string.IsNullOrEmpty(audience),
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

            // Extract user information from claims
            var userId = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                        ?? principal.FindFirst("userId")?.Value;

            var username = principal.FindFirst(JwtRegisteredClaimNames.Name)?.Value
                          ?? principal.FindFirst("username")?.Value;

            var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value
                       ?? principal.FindFirst("email")?.Value;

            return await Task.FromResult(new TokenValidationResult
            {
                IsValid = true,
                UserId = userId,
                Username = username,
                Email = email
            });
        }
        catch (SecurityTokenExpiredException)
        {
            return new TokenValidationResult
            {
                IsValid = false,
                ErrorMessage = "Token has expired"
            };
        }
        catch (SecurityTokenInvalidSignatureException)
        {
            return new TokenValidationResult
            {
                IsValid = false,
                ErrorMessage = "Invalid token signature"
            };
        }
        catch (SecurityTokenException ex)
        {
            return new TokenValidationResult
            {
                IsValid = false,
                ErrorMessage = $"Security token error: {ex.Message}"
            };
        }
        catch (Exception ex)
        {
            return new TokenValidationResult
            {
                IsValid = false,
                ErrorMessage = $"Validation error: {ex.Message}"
            };
        }
    }

    private bool IsPublicEndpoint(string path)
    {
        var publicPaths = new[]
        {
            "/api/auth/login",
            "/api/auth/register",
            "/swagger",
            "/health",
            "/"
        };

        return publicPaths.Any(p => path.StartsWith(p, StringComparison.OrdinalIgnoreCase));
    }

    private class TokenValidationResult
    {
        public bool IsValid { get; set; }
        public string? UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
