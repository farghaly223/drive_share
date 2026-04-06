using Microsoft.EntityFrameworkCore;
using cars_rental.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. إضافة الـ Controllers
builder.Services.AddControllers();

// 2. تفعيل الـ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. إضافة الـ CORS (لازم هنا قبل الـ Build)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", b =>
        b.AllowAnyHeader()
         .AllowAnyMethod()
         .AllowAnyOrigin());
});

// 4. قاعدة البيانات
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CarRentalDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// --- السطر الفاصل ---
var app = builder.Build();

// 5. تشغيل الـ Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 6. تفعيل الـ CORS (لازم يكون قبل الـ Routing والـ Authorization)
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();