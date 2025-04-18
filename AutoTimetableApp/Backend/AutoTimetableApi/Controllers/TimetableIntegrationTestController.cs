using AutoTimetableApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoTimetableApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimetableIntegrationTestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TimetableIntegrationTestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("test-conflict-detection")]
        public async Task<ActionResult<TestResult>> TestConflictDetection()
        {
            var result = new TestResult
            {
                TestName = "اختبار اكتشاف التعارضات في الجدول الزمني",
                StartTime = DateTime.Now,
                TestCases = new List<TestCase>()
            };

            try
            {
                // اختبار 1: تعارض المعلم (نفس المعلم في نفس الحصة في قسمين مختلفين)
                var testCase1 = new TestCase
                {
                    TestCaseName = "تعارض المعلم - نفس المعلم في نفس الحصة في قسمين مختلفين",
                    Description = "يجب اكتشاف التعارض عند محاولة تعيين معلم لنفس الحصة في قسمين مختلفين"
                };

                var existingSessions = new List<TimetableSession>
                {
                    new TimetableSession
                    {
                        DivisionId = 1,
                        TeacherId = 1,
                        SubjectId = 1,
                        DayOfWeek = "الأحد",
                        SessionNumber = 1,
                        SubjectName = "الرياضيات",
                        TeacherName = "أحمد محمد"
                    }
                };

                var newSession = new TimetableSession
                {
                    DivisionId = 2,
                    TeacherId = 1,
                    SubjectId = 1,
                    DayOfWeek = "الأحد",
                    SessionNumber = 1,
                    SubjectName = "الرياضيات",
                    TeacherName = "أحمد محمد"
                };

                var conflictCheck = Services.TimetableConflictDetector.CheckAllConflicts(
                    existingSessions,
                    newSession,
                    5,
                    new List<object>()
                );

                testCase1.Passed = conflictCheck.HasConflict && conflictCheck.ConflictType == "teacher";
                testCase1.ActualResult = conflictCheck.HasConflict 
                    ? $"تم اكتشاف التعارض: {conflictCheck.Message}" 
                    : "لم يتم اكتشاف التعارض";
                testCase1.ExpectedResult = "تم اكتشاف تعارض المعلم";

                result.TestCases.Add(testCase1);

                // اختبار 2: عدم وجود تعارض (معلمون مختلفون في نفس الحصة)
                var testCase2 = new TestCase
                {
                    TestCaseName = "عدم وجود تعارض - معلمون مختلفون في نفس الحصة",
                    Description = "لا يجب اكتشاف تعارض عند تعيين معلمين مختلفين لنفس الحصة في أقسام مختلفة"
                };

                existingSessions = new List<TimetableSession>
                {
                    new TimetableSession
                    {
                        DivisionId = 1,
                        TeacherId = 1,
                        SubjectId = 1,
                        DayOfWeek = "الأحد",
                        SessionNumber = 1,
                        SubjectName = "الرياضيات",
                        TeacherName = "أحمد محمد"
                    }
                };

                newSession = new TimetableSession
                {
                    DivisionId = 2,
                    TeacherId = 2, // معلم مختلف
                    SubjectId = 1,
                    DayOfWeek = "الأحد",
                    SessionNumber = 1,
                    SubjectName = "الرياضيات",
                    TeacherName = "محمود علي"
                };

                conflictCheck = Services.TimetableConflictDetector.CheckAllConflicts(
                    existingSessions,
                    newSession,
                    5,
                    new List<object>()
                );

                testCase2.Passed = !conflictCheck.HasConflict;
                testCase2.ActualResult = conflictCheck.HasConflict 
                    ? $"تم اكتشاف التعارض: {conflictCheck.Message}" 
                    : "لم يتم اكتشاف التعارض";
                testCase2.ExpectedResult = "لا يوجد تعارض";

                result.TestCases.Add(testCase2);

                // اختبار 3: تعارض القسم (نفس القسم في نفس الحصة)
                var testCase3 = new TestCase
                {
                    TestCaseName = "تعارض القسم - نفس القسم في نفس الحصة",
                    Description = "يجب اكتشاف التعارض عند محاولة تعيين حصتين مختلفتين لنفس القسم في نفس الوقت"
                };

                existingSessions = new List<TimetableSession>
                {
                    new TimetableSession
                    {
                        DivisionId = 1,
                        TeacherId = 1,
                        SubjectId = 1,
                        DayOfWeek = "الأحد",
                        SessionNumber = 1,
                        SubjectName = "الرياضيات",
                        TeacherName = "أحمد محمد"
                    }
                };

                newSession = new TimetableSession
                {
                    DivisionId = 1, // نفس القسم
                    TeacherId = 2,
                    SubjectId = 2, // مادة مختلفة
                    DayOfWeek = "الأحد",
                    SessionNumber = 1, // نفس الحصة
                    SubjectName = "العلوم",
                    TeacherName = "محمود علي"
                };

                conflictCheck = Services.TimetableConflictDetector.CheckAllConflicts(
                    existingSessions,
                    newSession,
                    5,
                    new List<object>()
                );

                testCase3.Passed = conflictCheck.HasConflict && conflictCheck.ConflictType == "division";
                testCase3.ActualResult = conflictCheck.HasConflict 
                    ? $"تم اكتشاف التعارض: {conflictCheck.Message}" 
                    : "لم يتم اكتشاف التعارض";
                testCase3.ExpectedResult = "تم اكتشاف تعارض القسم";

                result.TestCases.Add(testCase3);

                // اختبار 4: تجاوز الحد الأقصى لعدد حصص المادة
                var testCase4 = new TestCase
                {
                    TestCaseName = "تجاوز الحد الأقصى لعدد حصص المادة",
                    Description = "يجب اكتشاف التعارض عند محاولة تعيين عدد حصص أكبر من الحد الأقصى المسموح به للمادة"
                };

                existingSessions = new List<TimetableSession>
                {
                    new TimetableSession
                    {
                        DivisionId = 1,
                        TeacherId = 1,
                        SubjectId = 1,
                        DayOfWeek = "الأحد",
                        SessionNumber = 1,
                        SubjectName = "الرياضيات",
                        TeacherName = "أحمد محمد"
                    },
                    new TimetableSession
                    {
                        DivisionId = 1,
                        TeacherId = 1,
                        SubjectId = 1,
                        DayOfWeek = "الاثنين",
                        SessionNumber = 1,
                        SubjectName = "الرياضيات",
                        TeacherName = "أحمد محمد"
                    }
                };

                newSession = new TimetableSession
                {
                    DivisionId = 1,
                    TeacherId = 1,
                    SubjectId = 1,
                    DayOfWeek = "الثلاثاء",
                    SessionNumber = 1,
                    SubjectName = "الرياضيات",
                    TeacherName = "أحمد محمد"
                };

                conflictCheck = Services.TimetableConflictDetector.CheckAllConflicts(
                    existingSessions,
                    newSession,
                    2, // الحد الأقصى هو حصتان في الأسبوع
                    new List<object>()
                );

                testCase4.Passed = conflictCheck.HasConflict && conflictCheck.ConflictType == "subject_limit";
                testCase4.ActualResult = conflictCheck.HasConflict 
                    ? $"تم اكتشاف التعارض: {conflictCheck.Message}" 
                    : "لم يتم اكتشاف التعارض";
                testCase4.ExpectedResult = "تم اكتشاف تجاوز الحد الأقصى لعدد حصص المادة";

                result.TestCases.Add(testCase4);

                // حساب نتيجة الاختبار الإجمالية
                result.EndTime = DateTime.Now;
                result.Duration = (result.EndTime - result.StartTime).TotalMilliseconds;
                result.TotalTests = result.TestCases.Count;
                result.PassedTests = result.TestCases.Count(tc => tc.Passed);
                result.FailedTests = result.TestCases.Count(tc => !tc.Passed);
                result.Success = result.FailedTests == 0;

                return Ok(result);
            }
            catch (Exception ex)
            {
                result.EndTime = DateTime.Now;
                result.Duration = (result.EndTime - result.StartTime).TotalMilliseconds;
                result.ErrorMessage = ex.Message;
                result.Success = false;
                return StatusCode(500, result);
            }
        }
    }

    public class TestResult
    {
        public string TestName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double Duration { get; set; }
        public int TotalTests { get; set; }
        public int PassedTests { get; set; }
        public int FailedTests { get; set; }
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public List<TestCase> TestCases { get; set; }
    }

    public class TestCase
    {
        public string TestCaseName { get; set; }
        public string Description { get; set; }
        public bool Passed { get; set; }
        public string ExpectedResult { get; set; }
        public string ActualResult { get; set; }
    }
}
