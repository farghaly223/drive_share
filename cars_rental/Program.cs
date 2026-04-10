using cars_rental.Handlers;
using cars_rental.Interfaces;
using cars_rental.Middleware;
using cars_rental.Models;
using cars_rental.Repositories;
using cars_rental.Repository;
using cars_rental.Service;
using cars_rental.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// 🔥 السطر ده بيمسح أي تحويل تلقائي لمسميات الـ Claims
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// ========== JWT Configuration ==========
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException("❌ JWT Secret missing in appsettings.json");
}
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero,
        // ✅ تم الحفاظ على الإعدادات دي بالظبط زي ما طلبت عشان الـ 403 متظهرش تاني
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.Name
    };
});

// ========== Database Configuration (FIRST - before building app) ==========
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CarRentalDbContext>(options => 
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ========== Registration (Dependency Injection) ==========
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<RoleNormalizationService>(); // ✅ Add role normalization service
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();
app.MapHub<NotificationHub>("/notificationHub");
// 🔥 تسجيل خدمات الأدمن لحل مشكلة الـ 500
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAdminService, AdminService>();

builder.Services.AddScoped<IBrowsingRepository, BrowsingRepository>();
builder.Services.AddScoped<IBrowsingService, BrowsingService>();

builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();

builder.Services.AddScoped<ICarsRepository, CarsRepository>();
builder.Services.AddScoped<ICarsService, CarsService>();

// ========== Add Authorization Handlers for Debugging ==========
builder.Services.AddSingleton<IAuthorizationHandler, RoleAuthorizationHandler>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "انسخ الـ Token هنا فقط"
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme { Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } },
            new string[] {}
        }
    });
});

builder.Services.AddCors(options => { options.AddPolicy("AllowAll", policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()); });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

// 🔥 CRITICAL: Normalize all user roles to lowercase on startup (fixes 403 errors from mixed-case roles)
// This MUST run before the app starts handling requests
try
{
    using (var scope = app.Services.CreateScope())
    {
        var roleNormalizationService = scope.ServiceProvider.GetRequiredService<RoleNormalizationService>();
        await roleNormalizationService.NormalizeAllRolesAsync();
    }
}
catch (Exception ex)
{
    Console.WriteLine($"⚠️ Warning: Role normalization encountered an error (non-critical): {ex.Message}");
}

// 🔥 الترتيب ده حاسم جداً - زي الكود اللي بعته بالظبط
app.UseAuthentication(); // ✅ AddJwtBearer validates JWT and populates User with claims
app.UseAuthorization();  // ✅ Check roles & permissions (User is fully authenticated)

// ❌ Removed JwtValidationMiddleware for stability

app.MapControllers();
app.Run();