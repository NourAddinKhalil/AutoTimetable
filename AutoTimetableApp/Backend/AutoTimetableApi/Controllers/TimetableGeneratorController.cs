using AutoTimetableApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimetableGeneratorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TimetableGeneratorController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("generate")]
        public async Task<ActionResult<IEnumerable<TimetableSession>>> GenerateTimetable([FromBody] TimetableGenerationRequest request)
        {
            if (request == null || request.DivisionId <= 0)
            {
                return BadRequest("يجب تحديد القسم لإنشاء الجدول الزمني");
            }

            // التحقق من وجود القسم
            var division = await _context.Divisions
                .Include(d => d.Class)
                .FirstOrDefaultAsync(d => d.Id == request.DivisionId);

            if (division == null)
            {
                return NotFound($"لم يتم العثور على القسم بالمعرف {request.DivisionId}");
            }

            // الحصول على تعيينات المواد للقسم
            var subjectAssignments = await _context.SubjectAssignments
                .Include(sa => sa.Subject)
                .Include(sa => sa.Teacher)
                .Where(sa => sa.DivisionId == request.DivisionId)
                .ToListAsync();

            if (!subjectAssignments.Any())
            {
                return BadRequest("لا توجد مواد معينة لهذا القسم");
            }

            // الحصول على أيام الدراسة
            var studyDays = await _context.StudyDays
                .Where(sd => sd.IsActive)
                .OrderBy(sd => sd.DayOrder)
                .ToListAsync();

            if (!studyDays.Any())
            {
                return BadRequest("لا توجد أيام دراسة محددة");
            }

            // حذف الجدول الزمني الحالي للقسم إذا وجد
            var existingSessions = await _context.TimetableSessions
                .Where(ts => ts.DivisionId == request.DivisionId)
                .ToListAsync();

            if (existingSessions.Any())
            {
                _context.TimetableSessions.RemoveRange(existingSessions);
                await _context.SaveChangesAsync();
            }

            // إنشاء الجدول الزمني الجديد
            var newSessions = new List<TimetableSession>();
            var random = new System.Random();

            // الحصول على جميع الحصص الحالية لجميع الأقسام (للتحقق من تعارضات المعلمين)
            var allExistingSessions = await _context.TimetableSessions
                .Where(ts => ts.DivisionId != request.DivisionId)
                .ToListAsync();

            // تحديد الحد الأقصى لعدد الحصص في اليوم
            int maxSessionsPerDay = request.MaxSessionsPerDay > 0 ? request.MaxSessionsPerDay : 8;

            // إنشاء قائمة بجميع الفترات الزمنية المتاحة
            var allTimeSlots = new List<(string DayOfWeek, int SessionNumber)>();
            foreach (var day in studyDays)
            {
                for (int session = 1; session <= maxSessionsPerDay; session++)
                {
                    allTimeSlots.Add((day.Name, session));
                }
            }

            // خلط الفترات الزمنية لتوزيع عشوائي
            allTimeSlots = allTimeSlots.OrderBy(x => random.Next()).ToList();

            // توزيع المواد على الفترات الزمنية
            foreach (var assignment in subjectAssignments)
            {
                int sessionsToSchedule = assignment.SessionsPerWeek;
                int attemptsCount = 0;
                const int maxAttempts = 100; // الحد الأقصى لعدد المحاولات لتجنب الحلقات اللانهائية

                while (sessionsToSchedule > 0 && attemptsCount < maxAttempts)
                {
                    attemptsCount++;

                    // اختيار فترة زمنية عشوائية
                    if (allTimeSlots.Count == 0)
                    {
                        break; // لا توجد فترات زمنية متاحة
                    }

                    var timeSlot = allTimeSlots[0];
                    allTimeSlots.RemoveAt(0); // إزالة الفترة المستخدمة

                    // إنشاء حصة جديدة
                    var newSession = new TimetableSession
                    {
                        DivisionId = request.DivisionId,
                        SubjectId = assignment.SubjectId,
                        TeacherId = assignment.TeacherId,
                        DayOfWeek = timeSlot.DayOfWeek,
                        SessionNumber = timeSlot.SessionNumber,
                        SubjectName = assignment.Subject.Name,
                        TeacherName = assignment.Teacher.Name
                    };

                    // التحقق من التعارضات
                    var conflictCheck = Services.TimetableConflictDetector.CheckAllConflicts(
                        allExistingSessions.Concat(newSessions).ToList(),
                        newSession,
                        assignment.SessionsPerWeek,
                        new List<object>() // قائمة فارغة لتوفر المعلمين، يمكن تنفيذها لاحقاً
                    );

                    if (!conflictCheck.HasConflict)
                    {
                        // إضافة الحصة إلى الجدول الزمني
                        newSessions.Add(newSession);
                        sessionsToSchedule--;
                    }
                }

                // إذا لم نتمكن من جدولة جميع الحصص المطلوبة
                if (sessionsToSchedule > 0)
                {
                    return BadRequest($"لم نتمكن من جدولة جميع حصص المادة {assignment.Subject.Name} بسبب التعارضات");
                }
            }

            // حفظ الجدول الزمني الجديد في قاعدة البيانات
            await _context.TimetableSessions.AddRangeAsync(newSessions);
            await _context.SaveChangesAsync();

            return Ok(newSessions);
        }
    }

    public class TimetableGenerationRequest
    {
        public int DivisionId { get; set; }
        public int MaxSessionsPerDay { get; set; }
    }
}
