using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TaskManager.API.Middleware;

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
        var token = ExtractTokenFromHeader(context);

        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var validationResult = await ValidateTokenAsync(token);

                if (validationResult.IsValid)
                {
                    var userId = validationResult.UserId;
                    var username = validationResult.Username;
                    var email = validationResult.Email;
                    var name = validationResult.Name;

                    _logger.LogInformation(
                        "JWT token validated successfully - User: {Username}, Name: {Name}, Email: {Email}, ID: {UserId}",
                        username ?? "N/A", name ?? "N/A", email ?? "N/A", userId ?? "N/A");

                    if (context.Request.Headers.ContainsKey("X-Debug"))
                    {
                        context.Response.Headers.Append("X-Authenticated-User", username ?? "Unknown");
                        context.Response.Headers.Append("X-User-Id", userId ?? "Unknown");
                        context.Response.Headers.Append("X-User-Email", email ?? "Unknown");
                        context.Response.Headers.Append("X-User-Name", name ?? "Unknown");
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

        await _next(context);
    }

    private string? ExtractTokenFromHeader(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();

        if (string.IsNullOrEmpty(authHeader))
        {
            return null;
        }

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

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = principal.FindFirst(ClaimTypes.Name)?.Value;
            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            var name = principal.FindFirst("name")?.Value;

            return await Task.FromResult(new TokenValidationResult
            {
                IsValid = true,
                UserId = userId,
                Username = username,
                Email = email,
                Name = name
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
        public string? Name { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
