using JournalMagic.Models;
using JournalMagic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JournalMagic.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class JournalController : ControllerBase
    {
        private readonly DataService _dataService;

        public JournalController(DataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet]
        public IActionResult GetJournalEntries([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var entries = _dataService.GetJournalEntriesByUser(userId, startDate, endDate);
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public IActionResult GetJournalEntry(string id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var entry = _dataService.GetJournalEntryById(id);
            
            if (entry == null || entry.UserId != userId)
                return NotFound(new { message = "Journal entry not found" });
            
            return Ok(entry);
        }

        [HttpPost]
        public IActionResult CreateJournalEntry([FromBody] JournalEntry entry)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            entry.UserId = userId;
            entry.Id = Guid.NewGuid().ToString();
            entry.CreatedAt = DateTime.UtcNow;
            entry.UpdatedAt = DateTime.UtcNow;
            
            _dataService.AddJournalEntry(entry);
            
            return CreatedAtAction(nameof(GetJournalEntry), new { id = entry.Id }, entry);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJournalEntry(string id, [FromBody] JournalEntry entry)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var existingEntry = _dataService.GetJournalEntryById(id);
            
            if (existingEntry == null)
                return NotFound(new { message = "Journal entry not found" });
            
            if (existingEntry.UserId != userId)
                return Forbid("You don't have permission to update this entry");
            
            entry.Id = id;
            entry.UserId = userId;
            entry.CreatedAt = existingEntry.CreatedAt;
            entry.UpdatedAt = DateTime.UtcNow;
            
            _dataService.UpdateJournalEntry(entry);
            
            return Ok(entry);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJournalEntry(string id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var existingEntry = _dataService.GetJournalEntryById(id);
            
            if (existingEntry == null)
                return NotFound(new { message = "Journal entry not found" });
            
            if (existingEntry.UserId != userId)
                return Forbid("You don't have permission to delete this entry");
            
            _dataService.DeleteJournalEntry(id);
            
            return NoContent();
        }

        [HttpGet("export")]
        public IActionResult ExportJournalEntries([FromQuery] string format = "json")
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var entries = _dataService.GetJournalEntriesByUser(userId);
            
            switch (format.ToLower())
            {
                case "json":
                    return File(System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(entries)), 
                        "application/json", 
                        "journal-entries.json");
                
                case "csv":
                    // Simple CSV implementation
                    var csv = "Id,Title,Content,MoodRating,MoodEmoji,CreatedAt\n";
                    foreach (var entry in entries)
                    {
                        csv += $"\"{entry.Id}\",\"{entry.Title.Replace("\"", "\"\"")}\",\"{entry.Content.Replace("\"", "\"\"")}\",{entry.MoodRating},\"{entry.MoodEmoji}\",\"{entry.CreatedAt:yyyy-MM-dd HH:mm:ss}\"\n";
                    }
                    return File(System.Text.Encoding.UTF8.GetBytes(csv), 
                        "text/csv", 
                        "journal-entries.csv");
                
                default:
                    return BadRequest(new { message = "Unsupported format. Supported formats: json, csv" });
            }
        }
    }
}
