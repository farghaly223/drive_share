using Microsoft.EntityFrameworkCore;
using cars_rental.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. إضافة الـ Controllers
builder.Services.AddControllers();

// 2. تفعيل الـ Swagger (النسخة المتوافقة)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. قاعدة البيانات
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CarRentalDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

// 4. تشغيل الـ Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();