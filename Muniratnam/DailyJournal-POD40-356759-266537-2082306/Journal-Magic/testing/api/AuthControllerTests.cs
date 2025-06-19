using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Journal_Magic.Controllers;
using Journal_Magic.Models;
using Journal_Magic.Services;

namespace Journal_Magic.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<AuthService> _mockAuthService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<AuthService>();
            _controller = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task Login_ReturnsOkWithToken_WhenCredentialsAreValid()
        {
            // Arrange
            var loginModel = new LoginModel { Username = "testuser", Password = "password123" };
            var token = "fake-jwt-token";

            _mockAuthService.Setup(s => s.ValidateUserAsync(loginModel.Username, loginModel.Password))
                .ReturnsAsync(true);
            _mockAuthService.Setup(s => s.GenerateJwtTokenAsync(loginModel.Username))
                .ReturnsAsync(token);

            // Act
            var result = await _controller.Login(loginModel);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic tokenResponse = okResult.Value;
            Assert.Equal(token, tokenResponse.token);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
        {
            // Arrange
            var loginModel = new LoginModel { Username = "wronguser", Password = "wrongpassword" };

            _mockAuthService.Setup(s => s.ValidateUserAsync(loginModel.Username, loginModel.Password))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Login(loginModel);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsCreatedAtAction_WhenRegistrationSucceeds()
        {
            // Arrange
            var registerModel = new RegisterModel 
            { 
                Username = "newuser", 
                Password = "password123",
                Email = "newuser@example.com"
            };

            var newUser = new User
            {
                Id = "1",
                Username = registerModel.Username,
                Email = registerModel.Email
            };

            _mockAuthService.Setup(s => s.UserExistsAsync(registerModel.Username))
                .ReturnsAsync(false);
            _mockAuthService.Setup(s => s.RegisterUserAsync(It.IsAny<RegisterModel>()))
                .ReturnsAsync(newUser);

            // Act
            var result = await _controller.Register(registerModel);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<User>(createdAtActionResult.Value);
            Assert.Equal("newuser", returnValue.Username);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenUserAlreadyExists()
        {
            // Arrange
            var registerModel = new RegisterModel 
            { 
                Username = "existinguser", 
                Password = "password123",
                Email = "existing@example.com"
            };

            _mockAuthService.Setup(s => s.UserExistsAsync(registerModel.Username))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.Register(registerModel);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("User already exists", badRequestResult.Value);
        }
    }
}
