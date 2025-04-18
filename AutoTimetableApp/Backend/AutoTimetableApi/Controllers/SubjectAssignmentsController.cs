using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoTimetableApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class SubjectAssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubjectAssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/v1/subjectassignments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectAssignment>>> GetSubjectAssignments()
        {
            return await _context.SubjectAssignments
                .Include(sa => sa.Division)
                .Include(sa => sa.Subject)
                .Include(sa => sa.Teacher)
                .ToListAsync();
        }

        // GET: api/v1/subjectassignments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectAssignment>> GetSubjectAssignment(int id)
        {
            var subjectAssignment = await _context.SubjectAssignments
                .Include(sa => sa.Division)
                .Include(sa => sa.Subject)
                .Include(sa => sa.Teacher)
                .FirstOrDefaultAsync(sa => sa.Id == id);

            if (subjectAssignment == null)
            {
                return NotFound();
            }

            return subjectAssignment;
        }

        // GET: api/v1/subjectassignments/division/5
        [HttpGet("division/{divisionId}")]
        public async Task<ActionResult<IEnumerable<SubjectAssignment>>> GetSubjectAssignmentsByDivision(int divisionId)
        {
            return await _context.SubjectAssignments
                .Where(sa => sa.DivisionId == divisionId)
                .Include(sa => sa.Division)
                .Include(sa => sa.Subject)
                .Include(sa => sa.Teacher)
                .ToListAsync();
        }

        // GET: api/v1/subjectassignments/teacher/5
        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<SubjectAssignment>>> GetSubjectAssignmentsByTeacher(int teacherId)
        {
            return await _context.SubjectAssignments
                .Where(sa => sa.TeacherId == teacherId)
                .Include(sa => sa.Division)
                .Include(sa => sa.Subject)
                .Include(sa => sa.Teacher)
                .ToListAsync();
        }

        // POST: api/v1/subjectassignments
        [HttpPost]
        public async Task<ActionResult<SubjectAssignment>> CreateSubjectAssignment(SubjectAssignment subjectAssignment)
        {
            // التحقق من وجود القسم
            var divisionExists = await _context.Divisions.AnyAsync(d => d.Id == subjectAssignment.DivisionId);
            if (!divisionExists)
            {
                return BadRequest("القسم المحدد غير موجود");
            }

            // التحقق من وجود المادة
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == subjectAssignment.SubjectId);
            if (!subjectExists)
            {
                return BadRequest("المادة المحددة غير موجودة");
            }

            // التحقق من وجود المعلم
            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == subjectAssignment.TeacherId);
            if (!teacherExists)
            {
                return BadRequest("المعلم المحدد غير موجود");
            }

            // التحقق من أن المعلم يدرس المادة المحددة
            var teacher = await _context.Teachers.FindAsync(subjectAssignment.TeacherId);
            if (teacher.SubjectId != subjectAssignment.SubjectId)
            {
                return BadRequest("المعلم المحدد لا يدرس المادة المحددة");
            }

            _context.SubjectAssignments.Add(subjectAssignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubjectAssignment), new { id = subjectAssignment.Id }, subjectAssignment);
        }

        // PUT: api/v1/subjectassignments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubjectAssignment(int id, SubjectAssignment subjectAssignment)
        {
            if (id != subjectAssignment.Id)
            {
                return BadRequest();
            }

            // التحقق من وجود القسم
            var divisionExists = await _context.Divisions.AnyAsync(d => d.Id == subjectAssignment.DivisionId);
            if (!divisionExists)
            {
                return BadRequest("القسم المحدد غير موجود");
            }

            // التحقق من وجود المادة
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == subjectAssignment.SubjectId);
            if (!subjectExists)
            {
                return BadRequest("المادة المحددة غير موجودة");
            }

            // التحقق من وجود المعلم
            var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == subjectAssignment.TeacherId);
            if (!teacherExists)
            {
                return BadRequest("المعلم المحدد غير موجود");
            }

            // التحقق من أن المعلم يدرس المادة المحددة
            var teacher = await _context.Teachers.FindAsync(subjectAssignment.TeacherId);
            if (teacher.SubjectId != subjectAssignment.SubjectId)
            {
                return BadRequest("المعلم المحدد لا يدرس المادة المحددة");
            }

            _context.Entry(subjectAssignment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectAssignmentExists(id))
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

        // DELETE: api/v1/subjectassignments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubjectAssignment(int id)
        {
            var subjectAssignment = await _context.SubjectAssignments.FindAsync(id);
            if (subjectAssignment == null)
            {
                return NotFound();
            }

            _context.SubjectAssignments.Remove(subjectAssignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubjectAssignmentExists(int id)
        {
            return _context.SubjectAssignments.Any(e => e.Id == id);
        }
    }
}
