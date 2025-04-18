using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoTimetableApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DivisionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DivisionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/divisions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Division>>> GetDivisions()
        {
            return await _context.Divisions.Include(d => d.Class).ToListAsync();
        }

        // GET: api/v1/divisions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Division>> GetDivision(int id)
        {
            var division = await _context.Divisions
                .Include(d => d.Class)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (division == null)
            {
                return NotFound();
            }

            return division;
        }

        // GET: api/v1/divisions/class/5
        [HttpGet("class/{classId}")]
        public async Task<ActionResult<IEnumerable<Division>>> GetDivisionsByClass(int classId)
        {
            return await _context.Divisions
                .Where(d => d.ClassId == classId)
                .Include(d => d.Class)
                .ToListAsync();
        }

        // POST: api/v1/divisions
        [HttpPost]
        public async Task<ActionResult<Division>> CreateDivision(Division division)
        {
            // التحقق من وجود الصف
            var classExists = await _context.Classes.AnyAsync(c => c.Id == division.ClassId);
            if (!classExists)
            {
                return BadRequest("الصف المحدد غير موجود");
            }

            _context.Divisions.Add(division);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDivision), new { id = division.Id }, division);
        }

        // PUT: api/v1/divisions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDivision(int id, Division division)
        {
            if (id != division.Id)
            {
                return BadRequest();
            }

            // التحقق من وجود الصف
            var classExists = await _context.Classes.AnyAsync(c => c.Id == division.ClassId);
            if (!classExists)
            {
                return BadRequest("الصف المحدد غير موجود");
            }

            _context.Entry(division).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DivisionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/v1/divisions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDivision(int id)
        {
            var division = await _context.Divisions.FindAsync(id);
            if (division == null)
            {
                return NotFound();
            }

            _context.Divisions.Remove(division);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DivisionExists(int id)
        {
            return _context.Divisions.Any(e => e.Id == id);
        }
    }
}
