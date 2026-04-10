using cars_rental.DTOs;
using cars_rental.Models;
using cars_rental.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cars_rental.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("pending-owners")]
        public async Task<IActionResult> GetPendingOwners()
        {
            var pendingOwners = await _adminService.GetPendingOwnersAsync();
            return Ok(pendingOwners);
        }

        [HttpPost("manage-owner/{id}")]
        public async Task<IActionResult> ManageOwner(int id, [FromBody] bool approve)
        {
            var result = await _adminService.ManageOwnerAsync(id, approve);

            if (!result.Success) return NotFound(result.Message);

            return Ok(new { message = result.Message });
        }
    }
}