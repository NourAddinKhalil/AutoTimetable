using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using AutoTimetableApi.Models;
using AutoTimetableApi.Services;

namespace AutoTimetableApi.Tests
{
    [TestClass]
    public class TimetableConflictDetectorTests
    {
        private List<TimetableSession> _sessions;
        private List<TeacherAvailability> _teacherAvailability;

        [TestInitialize]
        public void Initialize()
        {
            // إعداد بيانات الاختبار
            _sessions = new List<TimetableSession>
            {
                new TimetableSession
                {
                    Id = 1,
                    DivisionId = 1,
                    DayOfWeek = "Monday",
                    SessionNumber = 1,
                    SubjectAssignment = new SubjectAssignment
                    {
                        TeacherId = 1,
                        SubjectId = 1
                    }
                },
                new TimetableSession
                {
                    Id = 2,
                    DivisionId = 1,
                    DayOfWeek = "Monday",
                    SessionNumber = 2,
                    SubjectAssignment = new SubjectAssignment
                    {
                        TeacherId = 2,
                        SubjectId = 2
                    }
                },
                new TimetableSession
                {
                    Id = 3,
                    DivisionId = 2,
                    DayOfWeek = "Monday",
                    SessionNumber = 1,
                    SubjectAssignment = new SubjectAssignment
                    {
                        TeacherId = 3,
                        SubjectId = 1
                    }
                }
            };

            _teacherAvailability = new List<TeacherAvailability>
            {
                new TeacherAvailability
                {
                    TeacherId = 1,
                    AvailableTimes = new List<AvailableTimeSlot>
                    {
                        new AvailableTimeSlot { DayOfWeek = "Monday", SessionNumber = 1 },
                        new AvailableTimeSlot { DayOfWeek = "Monday", SessionNumber = 2 },
                        new AvailableTimeSlot { DayOfWeek = "Tuesday", SessionNumber = 1 }
                    }
                },
                new TeacherAvailability
                {
                    TeacherId = 2,
                    AvailableTimes = new List<AvailableTimeSlot>
                    {
                        new AvailableTimeSlot { DayOfWeek = "Monday", SessionNumber = 2 },
                        new AvailableTimeSlot { DayOfWeek = "Tuesday", SessionNumber = 1 }
                    }
                }
            };
        }

        [TestMethod]
        public void HasTeacherConflict_ShouldReturnTrue_WhenTeacherHasConflict()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 3,
                DayOfWeek = "Monday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 3
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.HasTeacherConflict(_sessions, newSession);

            // تأكيد
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void HasTeacherConflict_ShouldReturnFalse_WhenTeacherHasNoConflict()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 3,
                DayOfWeek = "Monday",
                SessionNumber = 2,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 3
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.HasTeacherConflict(_sessions, newSession);

            // تأكيد
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void HasDivisionConflict_ShouldReturnTrue_WhenDivisionHasConflict()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 1,
                DayOfWeek = "Monday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 4,
                    SubjectId = 3
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.HasDivisionConflict(_sessions, newSession);

            // تأكيد
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void HasDivisionConflict_ShouldReturnFalse_WhenDivisionHasNoConflict()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 1,
                DayOfWeek = "Monday",
                SessionNumber = 3,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 1
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.HasDivisionConflict(_sessions, newSession);

            // تأكيد
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void HasSubjectLimitExceeded_ShouldReturnTrue_WhenLimitExceeded()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 1,
                DayOfWeek = "Tuesday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 1
                }
            };

            // إضافة حصة أخرى لنفس المادة
            _sessions.Add(new TimetableSession
            {
                Id = 4,
                DivisionId = 1,
                DayOfWeek = "Tuesday",
                SessionNumber = 2,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 1
                }
            });

            // تنفيذ
            bool result = TimetableConflictDetector.HasSubjectLimitExceeded(_sessions, newSession, 2);

            // تأكيد
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void HasSubjectLimitExceeded_ShouldReturnFalse_WhenLimitNotExceeded()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 1,
                DayOfWeek = "Tuesday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 1
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.HasSubjectLimitExceeded(_sessions, newSession, 2);

            // تأكيد
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void IsTeacherUnavailable_ShouldReturnTrue_WhenTeacherIsUnavailable()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 3,
                DayOfWeek = "Wednesday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 3
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.IsTeacherUnavailable(_sessions, newSession, _teacherAvailability);

            // تأكيد
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void IsTeacherUnavailable_ShouldReturnFalse_WhenTeacherIsAvailable()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 3,
                DayOfWeek = "Monday",
                SessionNumber = 2,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 3
                }
            };

            // تنفيذ
            bool result = TimetableConflictDetector.IsTeacherUnavailable(_sessions, newSession, _teacherAvailability);

            // تأكيد
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void CheckAllConflicts_ShouldReturnTeacherConflict_WhenTeacherHasConflict()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 3,
                DayOfWeek = "Monday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 3
                }
            };

            // تنفيذ
            var result = TimetableConflictDetector.CheckAllConflicts(_sessions, newSession, 5, _teacherAvailability);

            // تأكيد
            Assert.IsTrue(result.HasConflict);
            Assert.AreEqual("teacher", result.ConflictType);
        }

        [TestMethod]
        public void CheckAllConflicts_ShouldReturnNoConflict_WhenNoConflictsExist()
        {
            // ترتيب
            var newSession = new TimetableSession
            {
                DivisionId = 3,
                DayOfWeek = "Tuesday",
                SessionNumber = 1,
                SubjectAssignment = new SubjectAssignment
                {
                    TeacherId = 1,
                    SubjectId = 3
                }
            };

            // تنفيذ
            var result = TimetableConflictDetector.CheckAllConflicts(_sessions, newSession, 5, _teacherAvailability);

            // تأكيد
            Assert.IsFalse(result.HasConflict);
            Assert.IsNull(result.ConflictType);
            Assert.IsNull(result.Message);
        }
    }
}
