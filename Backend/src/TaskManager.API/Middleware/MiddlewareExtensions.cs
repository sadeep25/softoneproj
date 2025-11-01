namespace TaskManager.API.Middleware;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseJwtAuthenticationMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<JwtAuthenticationMiddleware>();
    }

    public static IApplicationBuilder UseExceptionHandlingMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}
