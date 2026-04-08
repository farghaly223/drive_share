using cars_rental.DTOs;
using cars_rental.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cars_rental.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        
            private readonly CarRentalDbContext _context;

            public AdminController(CarRentalDbContext context)
            {
                _context = context;
            }


            [HttpGet("pending-owners")]
            public async Task<IActionResult> GetPendingOwners()
            {
                var pendingOwners = await _context.Users
                    .Where(u => u.Role == "CarOwner" && u.AccountStatus == "Pending")
                    .Select(u => new AdminDTOs
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        CreatedAt = u.CreatedAt ?? DateTime.Now
                    }).ToListAsync();

                return Ok(pendingOwners);
            }

            [HttpPost("manage-owner/{id}")]
            public async Task<IActionResult> ManageOwner(int id, [FromBody] bool approve)
            {
                var owner = await _context.Users.FindAsync(id);
                if (owner == null) return NotFound("Account not found");

                owner.AccountStatus = approve ? "Approved" : "Rejected";
                owner.IsLicenseVerified = approve; 

                await _context.SaveChangesAsync();
                return Ok(new { message = approve ? "Owner Verified" : "Owner Rejected" });
            }
        }
    }


