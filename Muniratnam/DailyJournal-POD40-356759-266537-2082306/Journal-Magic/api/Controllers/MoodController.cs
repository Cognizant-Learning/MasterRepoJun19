using JournalMagic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JournalMagic.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MoodController : ControllerBase
    {
        private readonly DataService _dataService;

        public MoodController(DataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet]
        public IActionResult GetMoodData([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var moodData = _dataService.GetMoodDataByUser(userId, startDate, endDate);
            return Ok(moodData);
        }

        [HttpGet("analysis")]
        public IActionResult GetMoodAnalysis([FromQuery] string timeframe = "month")
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var analysis = _dataService.GetMoodAnalysis(userId, timeframe);
            return Ok(analysis);
        }

        [HttpGet("activity-correlations")]
        public IActionResult GetActivityCorrelations()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            var analysis = _dataService.GetMoodAnalysis(userId, "month");
            return Ok(analysis.CommonActivities);
        }
    }
}
