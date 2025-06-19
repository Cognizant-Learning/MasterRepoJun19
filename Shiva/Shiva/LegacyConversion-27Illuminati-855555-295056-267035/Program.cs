using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using BankBlazorApp.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Components.Server; // Added using directive for Microsoft.AspNetCore.Components.Server

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddDbContext<BankDbContext>(options =>
    options.UseInMemoryDatabase("BankDb"));

// Add Identity for authentication/authorization
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseInMemoryDatabase("IdentityDb"));
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
    .AddEntityFrameworkStores<IdentityDbContext>();

builder.Services.AddScoped<AuthenticationStateProvider, ServerAuthenticationStateProvider>();

builder.Services.AddScoped<AccountService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

// Seed users and roles
dbSeed(app);

app.Run();

// Seed method for roles and users
void dbSeed(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var roles = new[] { "admin", "guest" };
    foreach (var role in roles)
    {
        if (!roleManager.RoleExistsAsync(role).Result)
            roleManager.CreateAsync(new IdentityRole(role)).Wait();
    }
    // Admin user
    var admin = new IdentityUser("admin");
    if (userManager.FindByNameAsync("admin").Result == null)
    {
        userManager.CreateAsync(admin, "Admin123!").Wait();
        userManager.AddToRoleAsync(admin, "admin").Wait();
    }
    // Guest user
    var guest = new IdentityUser("guest");
    if (userManager.FindByNameAsync("guest").Result == null)
    {
        userManager.CreateAsync(guest, "Guest123!").Wait();
        userManager.AddToRoleAsync(guest, "guest").Wait();
    }
}
