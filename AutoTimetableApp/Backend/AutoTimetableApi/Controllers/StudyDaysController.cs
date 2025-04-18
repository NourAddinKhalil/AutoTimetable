using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoTimetableApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StudyDaysController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudyDaysController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/studydays
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudyDay>>> GetStudyDays()
        {
            return await _context.StudyDays.Include(sd => sd.Class).ToListAsync();
        }

        // GET: api/v1/studydays/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudyDay>> GetStudyDay(int id)
        {
            var studyDay = await _context.StudyDays
                .Include(sd => sd.Class)
                .FirstOrDefaultAsync(sd => sd.Id == id);

            if (studyDay == null)
            {
                return NotFound();
            }

            return studyDay;
        }

        // GET: api/v1/studydays/class/5
        [HttpGet("class/{classId}")]
        public async Task<ActionResult<IEnumerable<StudyDay>>> GetStudyDaysByClass(int classId)
        {
            return await _context.StudyDays
                .Where(sd => sd.ClassId == classId)
                .Include(sd => sd.Class)
                .ToListAsync();
        }

        // POST: api/v1/studydays
        [HttpPost]
        public async Task<ActionResult<StudyDay>> CreateStudyDay(StudyDay studyDay)
        {
            // التحقق من وجود الصف
            var classExists = await _context.Classes.AnyAsync(c => c.Id == studyDay.ClassId);
            if (!classExists)
            {
                return BadRequest("الصف المحدد غير موجود");
            }

            // التحقق من عدم وجود يوم دراسة مكرر لنفس الصف
            var duplicateDay = await _context.StudyDays
                .AnyAsync(sd => sd.ClassId == studyDay.ClassId && sd.DayOfWeek == studyDay.DayOfWeek);
            if (duplicateDay)
            {
                return BadRequest("يوم الدراسة موجود بالفعل لهذا الصف");
            }

            _context.StudyDays.Add(studyDay);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudyDay), new { id = studyDay.Id }, studyDay);
        }

        // PUT: api/v1/studydays/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudyDay(int id, StudyDay studyDay)
        {
            if (id != studyDay.Id)
            {
                return BadRequest();
            }

            // التحقق من وجود الصف
            var classExists = await _context.Classes.AnyAsync(c => c.Id == studyDay.ClassId);
            if (!classExists)
            {
                return BadRequest("الصف المحدد غير موجود");
            }

            // التحقق من عدم وجود يوم دراسة مكرر لنفس الصف (باستثناء اليوم الحالي)
            var duplicateDay = await _context.StudyDays
                .AnyAsync(sd => sd.Id != id && sd.ClassId == studyDay.ClassId && sd.DayOfWeek == studyDay.DayOfWeek);
            if (duplicateDay)
            {
                return BadRequest("يوم الدراسة موجود بالفعل لهذا الصف");
            }

            _context.Entry(studyDay).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudyDayExists(id))
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

        // DELETE: api/v1/studydays/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudyDay(int id)
        {
            var studyDay = await _context.StudyDays.FindAsync(id);
            if (studyDay == null)
            {
                return NotFound();
            }

            _context.StudyDays.Remove(studyDay);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudyDayExists(int id)
        {
            return _context.StudyDays.Any(e => e.Id == id);
        }
    }
}
