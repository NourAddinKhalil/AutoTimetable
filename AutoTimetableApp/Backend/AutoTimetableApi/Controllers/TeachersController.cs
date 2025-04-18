using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoTimetableApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeachersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            return await _context.Teachers.Include(t => t.Subject).ToListAsync();
        }

        // GET: api/v1/teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.Subject)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null)
            {
                return NotFound();
            }

            return teacher;
        }

        // GET: api/v1/teachers/subject/5
        [HttpGet("subject/{subjectId}")]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachersBySubject(int subjectId)
        {
            return await _context.Teachers
                .Where(t => t.SubjectId == subjectId)
                .Include(t => t.Subject)
                .ToListAsync();
        }

        // POST: api/v1/teachers
        [HttpPost]
        public async Task<ActionResult<Teacher>> CreateTeacher(Teacher teacher)
        {
            // التحقق من وجود المادة
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == teacher.SubjectId);
            if (!subjectExists)
            {
                return BadRequest("المادة المحددة غير موجودة");
            }

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, teacher);
        }

        // PUT: api/v1/teachers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, Teacher teacher)
        {
            if (id != teacher.Id)
            {
                return BadRequest();
            }

            // التحقق من وجود المادة
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == teacher.SubjectId);
            if (!subjectExists)
            {
                return BadRequest("المادة المحددة غير موجودة");
            }

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
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

        // DELETE: api/v1/teachers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeacherExists(int id)
        {
            return _context.Teachers.Any(e => e.Id == id);
        }
    }
}
