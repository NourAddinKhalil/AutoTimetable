using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoTimetableApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AutoTimetableApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                SchoolName = model.SchoolName,
                SubscriptionTier = SubscriptionTier.Free,
                SubscriptionExpiryDate = DateTime.UtcNow.AddMonths(1) // فترة تجريبية مجانية لمدة شهر
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
            }

            // إضافة المستخدم إلى دور "User"
            await _userManager.AddToRoleAsync(user, "User");

            return Ok(new { Message = "تم تسجيل المستخدم بنجاح" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { Message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { Message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
            }

            // التحقق من صلاحية الاشتراك
            if (user.SubscriptionExpiryDate < DateTime.UtcNow)
            {
                // تحديث مستوى الاشتراك إلى المستوى المجاني إذا انتهت صلاحية الاشتراك
                user.SubscriptionTier = SubscriptionTier.Free;
                await _userManager.UpdateAsync(user);
            }

            var token = await GenerateJwtToken(user);
            return Ok(new
            {
                Token = token,
                User = new
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    SchoolName = user.SchoolName,
                    SubscriptionTier = user.SubscriptionTier.ToString(),
                    SubscriptionExpiryDate = user.SubscriptionExpiryDate
                }
            });
        }

        [HttpPost("upgrade-subscription")]
        public async Task<IActionResult> UpgradeSubscription([FromBody] UpgradeSubscriptionModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return NotFound(new { Message = "المستخدم غير موجود" });
            }

            // في تطبيق حقيقي، هنا سيتم التحقق من عملية الدفع قبل ترقية الاشتراك

            // تحديث مستوى الاشتراك
            if (Enum.TryParse<SubscriptionTier>(model.SubscriptionTier, out var tier))
            {
                user.SubscriptionTier = tier;
                user.SubscriptionExpiryDate = DateTime.UtcNow.AddMonths(model.DurationMonths);
                await _userManager.UpdateAsync(user);

                return Ok(new
                {
                    Message = "تم ترقية الاشتراك بنجاح",
                    SubscriptionTier = user.SubscriptionTier.ToString(),
                    SubscriptionExpiryDate = user.SubscriptionExpiryDate
                });
            }

            return BadRequest(new { Message = "مستوى الاشتراك غير صالح" });
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("subscription", user.SubscriptionTier.ToString())
            };

            // إضافة الأدوار كمطالبات
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SchoolName { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpgradeSubscriptionModel
    {
        public string UserId { get; set; }
        public string SubscriptionTier { get; set; }
        public int DurationMonths { get; set; }
    }
}
