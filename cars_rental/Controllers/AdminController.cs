using cars_rental.DTOs;
using cars_rental.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize(Roles = "admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    public AdminController(IAdminService adminService) => _adminService = adminService;

    [HttpGet("pending-owners")]
    public async Task<IActionResult> GetPendingOwners() => Ok(await _adminService.GetPendingOwnersAsync());

    [HttpGet("pending-licenses")]
    public async Task<IActionResult> GetPendingLicenses() => Ok(await _adminService.GetPendingLicensesAsync());

    [HttpGet("pending-cars")]
    public async Task<IActionResult> GetPendingCars() => Ok(await _adminService.GetPendingCarsAsync());

    [HttpPost("manage-owner/{id}")]
    public async Task<IActionResult> ManageOwner(int id, [FromBody] bool approve)
    {
        var result = await _adminService.ManageOwnerAsync(id, approve);
        if (!result.Success) return NotFound(result.Message);
        return Ok(new { message = result.Message });
    }

    [HttpPost("verify-license/{id}")]
    public async Task<IActionResult> VerifyLicense(int id, [FromBody] bool approve)
    {
        var result = await _adminService.VerifyLicenseAsync(id, approve);
        if (!result.Success) return NotFound(result.Message);
        return Ok(new { message = result.Message });
    }

    // ✅ Granular permission control
    // PATCH /api/admin/permissions/5
    // Send only the fields you want to change:
    //
    // Block only car posting (owner):
    // { "canAddCars": false }
    //
    // Block only renting (renter):
    // { "canRentCars": false }
    //
    // Full account suspension:
    // { "isSuspended": true }
    //
    // Block everything at once:
    // { "isSuspended": true, "canAddCars": false, "canRentCars": false }
    //
    // Restore everything:
    // { "isSuspended": false, "canAddCars": true, "canRentCars": true }
    [HttpPatch("permissions/{id}")]
    public async Task<IActionResult> UpdatePermissions(int id, [FromBody] UpdatePermissionsDto dto)
    {
        var result = await _adminService.UpdateUserPermissionsAsync(id, dto);
        if (!result.Success) return BadRequest(new { message = result.Message });
        return Ok(new { message = result.Message });
    }
}