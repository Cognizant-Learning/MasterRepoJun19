using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly int _lowStockThreshold;

        public ItemsController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _lowStockThreshold = config.GetValue<int>("Inventory:LowStockThreshold", 10);
        }

        // GET: api/items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems(string? search = null)
        {
            var query = _context.Items.AsQueryable();
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(i => i.Name.Contains(search) || i.SKU.Contains(search) || i.Category.Contains(search));
            }
            return await query.ToListAsync();
        }

        // GET: api/items/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var total = await _context.Items.CountAsync();
            var lowStock = await _context.Items.CountAsync(i => i.Quantity < _lowStockThreshold && i.Quantity > 0);
            var outOfStock = await _context.Items.CountAsync(i => i.Quantity == 0);
            return new { total, lowStock, outOfStock };
        }

        // POST: api/items
        [HttpPost]
        public async Task<ActionResult<Item>> CreateItem(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItems), new { id = item.Id }, item);
        }

        // PUT: api/items/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, Item item)
        {
            if (id != item.Id) return BadRequest();
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/items/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return NotFound();
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}