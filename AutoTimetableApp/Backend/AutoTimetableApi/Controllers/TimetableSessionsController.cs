using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoTimetableApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace AutoTimetableApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TimetableSessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TimetableSessionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/timetablesessions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimetableSession>>> GetTimetableSessions()
        {
            return await _context.TimetableSessions
                .Include(ts => ts.Division)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Subject)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Teacher)
                .ToListAsync();
        }

        // GET: api/v1/timetablesessions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TimetableSession>> GetTimetableSession(int id)
        {
            var timetableSession = await _context.TimetableSessions
                .Include(ts => ts.Division)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Subject)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Teacher)
                .FirstOrDefaultAsync(ts => ts.Id == id);

            if (timetableSession == null)
            {
                return NotFound();
            }

            return timetableSession;
        }

        // GET: api/v1/timetablesessions/division/5
        [HttpGet("division/{divisionId}")]
        public async Task<ActionResult<IEnumerable<TimetableSession>>> GetTimetableSessionsByDivision(int divisionId)
        {
            return await _context.TimetableSessions
                .Where(ts => ts.DivisionId == divisionId)
                .Include(ts => ts.Division)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Subject)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Teacher)
                .OrderBy(ts => ts.DayOfWeek)
                .ThenBy(ts => ts.SessionNumber)
                .ToListAsync();
        }

        // GET: api/v1/timetablesessions/teacher/5
        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<TimetableSession>>> GetTimetableSessionsByTeacher(int teacherId)
        {
            return await _context.TimetableSessions
                .Where(ts => ts.SubjectAssignment.TeacherId == teacherId)
                .Include(ts => ts.Division)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Subject)
                .Include(ts => ts.SubjectAssignment)
                    .ThenInclude(sa => sa.Teacher)
                .OrderBy(ts => ts.DayOfWeek)
                .ThenBy(ts => ts.SessionNumber)
                .ToListAsync();
        }

        // POST: api/v1/timetablesessions
        [HttpPost]
        public async Task<ActionResult<TimetableSession>> CreateTimetableSession(TimetableSession timetableSession)
        {
            // التحقق من وجود القسم
            var divisionExists = await _context.Divisions.AnyAsync(d => d.Id == timetableSession.DivisionId);
            if (!divisionExists)
            {
                return BadRequest("القسم المحدد غير موجود");
            }

            // التحقق من وجود تعيين المادة
            var subjectAssignmentExists = await _context.SubjectAssignments.AnyAsync(sa => sa.Id == timetableSession.SubjectAssignmentId);
            if (!subjectAssignmentExists)
            {
                return BadRequest("تعيين المادة المحدد غير موجود");
            }

            // التحقق من أن تعيين المادة ينتمي إلى نفس القسم
            var subjectAssignment = await _context.SubjectAssignments.FindAsync(timetableSession.SubjectAssignmentId);
            if (subjectAssignment.DivisionId != timetableSession.DivisionId)
            {
                return BadRequest("تعيين المادة المحدد لا ينتمي إلى القسم المحدد");
            }

            // التحقق من عدم وجود تعارض في الجدول الزمني للقسم
            var divisionConflict = await _context.TimetableSessions
                .AnyAsync(ts => ts.DivisionId == timetableSession.DivisionId && 
                           ts.DayOfWeek == timetableSession.DayOfWeek && 
                           ts.SessionNumber == timetableSession.SessionNumber);
            if (divisionConflict)
            {
                return BadRequest("يوجد تعارض في الجدول الزمني للقسم المحدد");
            }

            // التحقق من عدم وجود تعارض في جدول المعلم
            var teacherId = subjectAssignment.TeacherId;
            var teacherConflict = await _context.TimetableSessions
                .Include(ts => ts.SubjectAssignment)
                .AnyAsync(ts => ts.SubjectAssignment.TeacherId == teacherId && 
                           ts.DayOfWeek == timetableSession.DayOfWeek && 
                           ts.SessionNumber == timetableSession.SessionNumber);
            if (teacherConflict)
            {
                return BadRequest("يوجد تعارض في جدول المعلم المحدد");
            }

            _context.TimetableSessions.Add(timetableSession);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTimetableSession), new { id = timetableSession.Id }, timetableSession);
        }

        // PUT: api/v1/timetablesessions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTimetableSession(int id, TimetableSession timetableSession)
        {
            if (id != timetableSession.Id)
            {
                return BadRequest();
            }

            // التحقق من وجود القسم
            var divisionExists = await _context.Divisions.AnyAsync(d => d.Id == timetableSession.DivisionId);
            if (!divisionExists)
            {
                return BadRequest("القسم المحدد غير موجود");
            }

            // التحقق من وجود تعيين المادة
            var subjectAssignmentExists = await _context.SubjectAssignments.AnyAsync(sa => sa.Id == timetableSession.SubjectAssignmentId);
            if (!subjectAssignmentExists)
            {
                return BadRequest("تعيين المادة المحدد غير موجود");
            }

            // التحقق من أن تعيين المادة ينتمي إلى نفس القسم
            var subjectAssignment = await _context.SubjectAssignments.FindAsync(timetableSession.SubjectAssignmentId);
            if (subjectAssignment.DivisionId != timetableSession.DivisionId)
            {
                return BadRequest("تعيين المادة المحدد لا ينتمي إلى القسم المحدد");
            }

            // التحقق من عدم وجود تعارض في الجدول الزمني للقسم
            var divisionConflict = await _context.TimetableSessions
                .AnyAsync(ts => ts.Id != id && 
                           ts.DivisionId == timetableSession.DivisionId && 
                           ts.DayOfWeek == timetableSession.DayOfWeek && 
                           ts.SessionNumber == timetableSession.SessionNumber);
            if (divisionConflict)
            {
                return BadRequest("يوجد تعارض في الجدول الزمني للقسم المحدد");
            }

            // التحقق من عدم وجود تعارض في جدول المعلم
            var teacherId = subjectAssignment.TeacherId;
            var teacherConflict = await _context.TimetableSessions
                .Include(ts => ts.SubjectAssignment)
                .AnyAsync(ts => ts.Id != id && 
                           ts.SubjectAssignment.TeacherId == teacherId && 
                           ts.DayOfWeek == timetableSession.DayOfWeek && 
                           ts.SessionNumber == timetableSession.SessionNumber);
            if (teacherConflict)
            {
                return BadRequest("يوجد تعارض في جدول المعلم المحدد");
            }

            _context.Entry(timetableSession).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimetableSessionExists(id))
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

        // DELETE: api/v1/timetablesessions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTimetableSession(int id)
        {
            var timetableSession = await _context.TimetableSessions.FindAsync(id);
            if (timetableSession == null)
            {
                return NotFound();
            }

            _context.TimetableSessions.Remove(timetableSession);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TimetableSessionExists(int id)
        {
            return _context.TimetableSessions.Any(e => e.Id == id);
        }
    }
}
