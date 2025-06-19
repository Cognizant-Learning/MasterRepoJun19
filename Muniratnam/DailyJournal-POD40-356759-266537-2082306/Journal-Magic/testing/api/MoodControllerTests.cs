using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Journal_Magic.Controllers;
using Journal_Magic.Models;
using Journal_Magic.Services;

namespace Journal_Magic.Tests.Controllers
{
    public class MoodControllerTests
    {
        private readonly Mock<DataService> _mockDataService;
        private readonly MoodController _controller;

        public MoodControllerTests()
        {
            _mockDataService = new Mock<DataService>();
            _controller = new MoodController(_mockDataService.Object);
        }

        [Fact]
        public async Task GetMoodStats_ReturnsOkResult_WithMoodStatistics()
        {
            // Arrange
            string userId = "user123";
            DateTime startDate = DateTime.Now.AddDays(-7);
            DateTime endDate = DateTime.Now;

            var testEntries = new List<JournalEntry>
            {
                new JournalEntry { Id = "1", UserId = userId, Title = "Entry 1", Mood = 5, Date = DateTime.Now.AddDays(-6) },
                new JournalEntry { Id = "2", UserId = userId, Title = "Entry 2", Mood = 3, Date = DateTime.Now.AddDays(-5) },
                new JournalEntry { Id = "3", UserId = userId, Title = "Entry 3", Mood = 4, Date = DateTime.Now.AddDays(-4) },
                new JournalEntry { Id = "4", UserId = userId, Title = "Entry 4", Mood = 2, Date = DateTime.Now.AddDays(-2) },
                new JournalEntry { Id = "5", UserId = userId, Title = "Entry 5", Mood = 5, Date = DateTime.Now.AddDays(-1) }
            };

            _mockDataService.Setup(s => s.GetUserJournalEntriesInDateRangeAsync(userId, startDate, endDate))
                .ReturnsAsync(testEntries);

            // Act
            var result = await _controller.GetMoodStats(userId, startDate, endDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic stats = okResult.Value;
            Assert.Equal(5, stats.count);
            Assert.Equal(3.8, stats.averageMood);
            Assert.Equal(5, stats.highestMood);
            Assert.Equal(2, stats.lowestMood);
        }

        [Fact]
        public async Task GetMoodTrends_ReturnsOkResult_WithMoodTrends()
        {
            // Arrange
            string userId = "user123";
            int days = 7;
            DateTime endDate = DateTime.Now;
            DateTime startDate = endDate.AddDays(-days);

            var testEntries = new List<JournalEntry>
            {
                new JournalEntry { Id = "1", UserId = userId, Title = "Entry 1", Mood = 5, Date = endDate.AddDays(-6) },
                new JournalEntry { Id = "2", UserId = userId, Title = "Entry 2", Mood = 3, Date = endDate.AddDays(-5) },
                new JournalEntry { Id = "3", UserId = userId, Title = "Entry 3", Mood = 4, Date = endDate.AddDays(-4) },
                new JournalEntry { Id = "4", UserId = userId, Title = "Entry 4", Mood = 2, Date = endDate.AddDays(-2) },
                new JournalEntry { Id = "5", UserId = userId, Title = "Entry 5", Mood = 5, Date = endDate.AddDays(-1) }
            };

            _mockDataService.Setup(s => s.GetUserJournalEntriesInDateRangeAsync(userId, It.IsAny<DateTime>(), It.IsAny<DateTime>()))
                .ReturnsAsync(testEntries);

            // Act
            var result = await _controller.GetMoodTrends(userId, days);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var trendData = Assert.IsType<List<object>>(okResult.Value);
            Assert.Equal(7, trendData.Count); // One data point per day
        }

        [Fact]
        public async Task GetMoodCorrelations_ReturnsOkResult_WithCorrelationData()
        {
            // Arrange
            string userId = "user123";

            var testEntries = new List<JournalEntry>
            {
                new JournalEntry { Id = "1", UserId = userId, Title = "Exercise", Content = "Went for a run", Mood = 5, Date = DateTime.Now.AddDays(-10), Tags = new List<string> { "exercise", "health" } },
                new JournalEntry { Id = "2", UserId = userId, Title = "Exercise", Content = "Gym workout", Mood = 5, Date = DateTime.Now.AddDays(-8), Tags = new List<string> { "exercise", "gym" } },
                new JournalEntry { Id = "3", UserId = userId, Title = "Work", Content = "Stressful day", Mood = 2, Date = DateTime.Now.AddDays(-7), Tags = new List<string> { "work", "stress" } },
                new JournalEntry { Id = "4", UserId = userId, Title = "Friends", Content = "Dinner with friends", Mood = 5, Date = DateTime.Now.AddDays(-5), Tags = new List<string> { "social", "dinner" } },
                new JournalEntry { Id = "5", UserId = userId, Title = "Work", Content = "Deadline pressure", Mood = 2, Date = DateTime.Now.AddDays(-3), Tags = new List<string> { "work", "deadline" } },
                new JournalEntry { Id = "6", UserId = userId, Title = "Exercise", Content = "Morning yoga", Mood = 4, Date = DateTime.Now.AddDays(-1), Tags = new List<string> { "exercise", "yoga" } }
            };

            _mockDataService.Setup(s => s.GetAllUserJournalEntriesAsync(userId))
                .ReturnsAsync(testEntries);

            // Act
            var result = await _controller.GetMoodCorrelations(userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic correlations = okResult.Value;
            
            // Check that our dictionary has entries for key activities/tags
            Assert.True(correlations.ContainsKey("exercise"));
            Assert.True(correlations.ContainsKey("work"));
            
            // Expected correlations based on test data
            Assert.True((double)correlations["exercise"] > (double)correlations["work"]);
        }
    }
}
