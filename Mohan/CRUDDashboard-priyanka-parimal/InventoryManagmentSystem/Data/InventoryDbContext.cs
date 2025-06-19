using Microsoft.EntityFrameworkCore;
using InventoryManagmentSystem.Models;

namespace InventoryManagmentSystem.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<InventoryItem> InventoryItems { get; set; } = null!; // Initialized to avoid nullability warning
    }
}
