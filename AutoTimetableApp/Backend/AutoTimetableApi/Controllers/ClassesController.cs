using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoTimetableApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/classes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Class>>> GetClasses()
        {
            return await _context.Classes.ToListAsync();
        }

        // GET: api/v1/classes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Class>> GetClass(int id)
        {
            var classItem = await _context.Classes.FindAsync(id);

            if (classItem == null)
            {
                return NotFound();
            }

            return classItem;
        }

        // POST: api/v1/classes
        [HttpPost]
        public async Task<ActionResult<Class>> CreateClass(Class classItem)
        {
            _context.Classes.Add(classItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClass), new { id = classItem.Id }, classItem);
        }

        // PUT: api/v1/classes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClass(int id, Class classItem)
        {
            if (id != classItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(classItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassExists(id))
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

        // DELETE: api/v1/classes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var classItem = await _context.Classes.FindAsync(id);
            if (classItem == null)
            {
                return NotFound();
            }

            _context.Classes.Remove(classItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClassExists(int id)
        {
            return _context.Classes.Any(e => e.Id == id);
        }
    }
}
