namespace TaskManager.API.Middleware;

/// <summary>
/// Extension methods for registering custom middleware
/// </summary>
public static class MiddlewareExtensions
{
    /// <summary>
    /// Adds JWT authentication middleware for token validation and logging
    /// </summary>
    public static IApplicationBuilder UseJwtAuthenticationMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<JwtAuthenticationMiddleware>();
    }

    /// <summary>
    /// Adds global exception handling middleware
    /// </summary>
    public static IApplicationBuilder UseExceptionHandlingMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}
