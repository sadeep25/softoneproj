using TaskManager.Domain.Common;

namespace TaskManager.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // In production, this should be hashed
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
}