# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution file
COPY TaskManager.slnx .

# Copy project files
COPY src/TaskManager.Domain/TaskManager.Domain.csproj ./src/TaskManager.Domain/
COPY src/TaskManager.Application/TaskManager.Application.csproj ./src/TaskManager.Application/
COPY src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj ./src/TaskManager.Infrastructure/
COPY src/TaskManager.API/TaskManager.API.csproj ./src/TaskManager.API/

# Restore dependencies
RUN dotnet restore "src/TaskManager.API/TaskManager.API.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
WORKDIR /src/src/TaskManager.API
RUN dotnet build "TaskManager.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "TaskManager.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Install EF Core tools for migrations
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# Use the official ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Install SQL Server tools for healthcheck
RUN apt-get update && apt-get install -y curl apt-transport-https gnupg \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy published app
COPY --from=publish /app/publish .

# Copy migration files and EF tools
COPY --from=build /root/.dotnet/tools /root/.dotnet/tools
COPY --from=build /src /src
ENV PATH="${PATH}:/root/.dotnet/tools"

# Expose port
EXPOSE 80

# Add entrypoint script to run migrations
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
