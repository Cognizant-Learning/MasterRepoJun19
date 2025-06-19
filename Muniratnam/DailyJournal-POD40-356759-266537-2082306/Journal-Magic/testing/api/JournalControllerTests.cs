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
    public class JournalControllerTests
    {
        private readonly Mock<DataService> _mockDataService;
        private readonly JournalController _controller;

        public JournalControllerTests()
        {
            _mockDataService = new Mock<DataService>();
            _controller = new JournalController(_mockDataService.Object);
        }

        [Fact]
        public async Task GetAllEntries_ReturnsOkResult_WithListOfEntries()
        {
            // Arrange
            var testEntries = new List<JournalEntry>
            {
                new JournalEntry { Id = "1", Title = "Test Entry 1", Content = "Test content 1", Mood = 5, Date = DateTime.Now.AddDays(-1) },
                new JournalEntry { Id = "2", Title = "Test Entry 2", Content = "Test content 2", Mood = 4, Date = DateTime.Now }
            };

            _mockDataService.Setup(s => s.GetAllJournalEntriesAsync()).ReturnsAsync(testEntries);

            // Act
            var result = await _controller.GetAllEntries();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedEntries = Assert.IsType<List<JournalEntry>>(okResult.Value);
            Assert.Equal(2, returnedEntries.Count);
        }

        [Fact]
        public async Task GetEntryById_ReturnsOkResult_WhenEntryExists()
        {
            // Arrange
            var testEntry = new JournalEntry { Id = "1", Title = "Test Entry", Content = "Test content", Mood = 5, Date = DateTime.Now };

            _mockDataService.Setup(s => s.GetJournalEntryByIdAsync("1")).ReturnsAsync(testEntry);

            // Act
            var result = await _controller.GetEntryById("1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedEntry = Assert.IsType<JournalEntry>(okResult.Value);
            Assert.Equal("1", returnedEntry.Id);
            Assert.Equal("Test Entry", returnedEntry.Title);
        }

        [Fact]
        public async Task GetEntryById_ReturnsNotFound_WhenEntryDoesNotExist()
        {
            // Arrange
            _mockDataService.Setup(s => s.GetJournalEntryByIdAsync("999")).ReturnsAsync((JournalEntry)null);

            // Act
            var result = await _controller.GetEntryById("999");

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task CreateEntry_ReturnsCreatedAtAction_WithNewEntry()
        {
            // Arrange
            var newEntry = new JournalEntry { Title = "New Entry", Content = "New content", Mood = 4, Date = DateTime.Now };
            var savedEntry = new JournalEntry { Id = "3", Title = "New Entry", Content = "New content", Mood = 4, Date = DateTime.Now };

            _mockDataService.Setup(s => s.AddJournalEntryAsync(It.IsAny<JournalEntry>())).ReturnsAsync(savedEntry);

            // Act
            var result = await _controller.CreateEntry(newEntry);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<JournalEntry>(createdAtActionResult.Value);
            Assert.Equal("3", returnValue.Id);
            Assert.Equal("New Entry", returnValue.Title);
        }

        [Fact]
        public async Task UpdateEntry_ReturnsOkResult_WhenEntryUpdated()
        {
            // Arrange
            var entryId = "1";
            var updatedEntry = new JournalEntry { Id = entryId, Title = "Updated Title", Content = "Updated content", Mood = 3 };

            _mockDataService.Setup(s => s.GetJournalEntryByIdAsync(entryId)).ReturnsAsync(new JournalEntry { Id = entryId });
            _mockDataService.Setup(s => s.UpdateJournalEntryAsync(entryId, It.IsAny<JournalEntry>())).ReturnsAsync(updatedEntry);

            // Act
            var result = await _controller.UpdateEntry(entryId, updatedEntry);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<JournalEntry>(okResult.Value);
            Assert.Equal("Updated Title", returnValue.Title);
        }

        [Fact]
        public async Task UpdateEntry_ReturnsNotFound_WhenEntryDoesNotExist()
        {
            // Arrange
            var entryId = "999";
            var updatedEntry = new JournalEntry { Id = entryId, Title = "Updated Title", Content = "Updated content" };

            _mockDataService.Setup(s => s.GetJournalEntryByIdAsync(entryId)).ReturnsAsync((JournalEntry)null);

            // Act
            var result = await _controller.UpdateEntry(entryId, updatedEntry);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteEntry_ReturnsOkResult_WhenEntryDeleted()
        {
            // Arrange
            var entryId = "1";

            _mockDataService.Setup(s => s.GetJournalEntryByIdAsync(entryId)).ReturnsAsync(new JournalEntry { Id = entryId });
            _mockDataService.Setup(s => s.DeleteJournalEntryAsync(entryId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteEntry(entryId);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteEntry_ReturnsNotFound_WhenEntryDoesNotExist()
        {
            // Arrange
            var entryId = "999";

            _mockDataService.Setup(s => s.GetJournalEntryByIdAsync(entryId)).ReturnsAsync((JournalEntry)null);

            // Act
            var result = await _controller.DeleteEntry(entryId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
