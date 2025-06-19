using System;
using System.Threading;
using Microsoft.Edge.SeleniumTools;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace Journal_Magic.Tests.Automation
{
    public class JournalMagicAutomationTests : IDisposable
    {
        private readonly IWebDriver _driver;
        private readonly WebDriverWait _wait;
        private const string BaseUrl = "http://localhost:4200"; // Default Angular development server URL

        public JournalMagicAutomationTests()
        {
            // Setup Chrome driver
            var options = new ChromeOptions();
            options.AddArgument("--headless"); // Run headless for CI/CD pipelines
            options.AddArgument("--no-sandbox");
            options.AddArgument("--disable-dev-shm-usage");
            
            _driver = new ChromeDriver(options);
            _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
        }

        public void Dispose()
        {
            _driver?.Quit();
        }

        [Fact(Skip = "Run only when dev server is available")]
        public void LoginPage_LoginWithValidCredentials_RedirectsToDashboard()
        {
            // Arrange
            _driver.Navigate().GoToUrl($"{BaseUrl}/login");
            
            // Act
            var usernameField = _driver.FindElement(By.Id("username"));
            var passwordField = _driver.FindElement(By.Id("password"));
            var loginButton = _driver.FindElement(By.CssSelector("button[type='submit']"));

            usernameField.SendKeys("testuser");
            passwordField.SendKeys("password123");
            loginButton.Click();

            // Wait for redirect to dashboard
            _wait.Until(d => d.Url.Contains("/dashboard"));

            // Assert
            Assert.Contains("/dashboard", _driver.Url);
            
            // Check for welcome message from the chatbot
            var chatbotMessage = _wait.Until(d => 
                d.FindElement(By.CssSelector(".chat-bot-message")));
                
            Assert.Contains("Welcome back", chatbotMessage.Text);
        }

        [Fact(Skip = "Run only when dev server is available")]
        public void JournalEntry_CreateNewEntry_AppearInJournalList()
        {
            // Arrange - Login first
            _driver.Navigate().GoToUrl($"{BaseUrl}/login");
            var usernameField = _driver.FindElement(By.Id("username"));
            var passwordField = _driver.FindElement(By.Id("password"));
            var loginButton = _driver.FindElement(By.CssSelector("button[type='submit']"));

            usernameField.SendKeys("testuser");
            passwordField.SendKeys("password123");
            loginButton.Click();

            // Wait for redirect to dashboard
            _wait.Until(d => d.Url.Contains("/dashboard"));

            // Navigate to journal entry page
            _driver.Navigate().GoToUrl($"{BaseUrl}/journal-entry/new");

            // Act - Create a new journal entry
            var titleField = _driver.FindElement(By.Id("title"));
            var contentField = _driver.FindElement(By.Id("content"));
            var moodSlider = _driver.FindElement(By.Id("mood-slider"));
            var submitButton = _driver.FindElement(By.CssSelector("button[type='submit']"));

            string entryTitle = $"Test Entry {DateTime.Now.Ticks}";
            titleField.SendKeys(entryTitle);
            contentField.SendKeys("This is an automated test entry created by Selenium.");
            
            // Move the mood slider to a happy mood (value 4)
            // This is a simplified approach - actual implementation may vary
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].value = 4;", moodSlider);
            
            submitButton.Click();

            // Wait for redirect to journal list
            _wait.Until(d => d.Url.Contains("/journal-list"));

            // Assert - Check if new entry appears in the list
            _wait.Until(d => d.FindElement(By.XPath($"//div[contains(@class, 'journal-entry')]//h3[text()='{entryTitle}']")));
            
            var newEntry = _driver.FindElement(By.XPath($"//div[contains(@class, 'journal-entry')]//h3[text()='{entryTitle}']"));
            Assert.NotNull(newEntry);
        }

        [Fact(Skip = "Run only when dev server is available")]
        public void MoodVisualization_ShowsCorrectMoodData()
        {
            // Arrange - Login first
            _driver.Navigate().GoToUrl($"{BaseUrl}/login");
            var usernameField = _driver.FindElement(By.Id("username"));
            var passwordField = _driver.FindElement(By.Id("password"));
            var loginButton = _driver.FindElement(By.CssSelector("button[type='submit']"));

            usernameField.SendKeys("testuser");
            passwordField.SendKeys("password123");
            loginButton.Click();

            // Wait for redirect to dashboard
            _wait.Until(d => d.Url.Contains("/dashboard"));

            // Navigate to mood visualization
            _driver.FindElement(By.LinkText("Mood Trends")).Click();

            // Assert - Check if visualization components are present
            _wait.Until(d => d.FindElement(By.ClassName("mood-chart")));
            
            var moodChart = _driver.FindElement(By.ClassName("mood-chart"));
            var moodInsights = _driver.FindElement(By.ClassName("mood-insights"));
            
            Assert.NotNull(moodChart);
            Assert.NotNull(moodInsights);
            
            // Additional checks could validate specific data points or statistics
            // that appear in the visualization
        }

        [Fact(Skip = "Run only when dev server is available")]
        public void ThemeToggle_SwitchesBetweenDarkAndLightModes()
        {
            // Arrange
            _driver.Navigate().GoToUrl(BaseUrl);
            
            // Get initial theme
            string initialTheme = (string)((IJavaScriptExecutor)_driver).ExecuteScript(
                "return document.body.classList.contains('dark-theme') ? 'dark' : 'light'");
            
            // Act - Click theme toggle
            var themeToggle = _driver.FindElement(By.Id("theme-toggle"));
            themeToggle.Click();
            
            // Small delay to allow theme change to apply
            Thread.Sleep(500);
            
            // Assert - Theme should be different now
            string newTheme = (string)((IJavaScriptExecutor)_driver).ExecuteScript(
                "return document.body.classList.contains('dark-theme') ? 'dark' : 'light'");
            
            Assert.NotEqual(initialTheme, newTheme);
        }
    }
}
