using System;
using System.Collections.Generic;
using System.Linq;
using AutoTimetableApi.Models;

namespace AutoTimetableApi.Services
{
    public class TimetableConflictDetector
    {
        /// <summary>
        /// التحقق من وجود تعارض في تعيين معلم لنفس الحصة في صفوف مختلفة
        /// </summary>
        /// <param name="sessions">قائمة حصص الجدول الزمني الحالية</param>
        /// <param name="newSession">الحصة الجديدة المراد إضافتها</param>
        /// <returns>true إذا كان هناك تعارض، false إذا لم يكن هناك تعارض</returns>
        public static bool HasTeacherConflict(IEnumerable<TimetableSession> sessions, TimetableSession newSession)
        {
            return sessions.Any(session =>
                session.SubjectAssignment.TeacherId == newSession.SubjectAssignment.TeacherId &&
                session.DayOfWeek == newSession.DayOfWeek &&
                session.SessionNumber == newSession.SessionNumber &&
                session.DivisionId != newSession.DivisionId
            );
        }

        /// <summary>
        /// التحقق من وجود تعارض في تعيين قسم لنفس الحصة مرتين
        /// </summary>
        /// <param name="sessions">قائمة حصص الجدول الزمني الحالية</param>
        /// <param name="newSession">الحصة الجديدة المراد إضافتها</param>
        /// <returns>true إذا كان هناك تعارض، false إذا لم يكن هناك تعارض</returns>
        public static bool HasDivisionConflict(IEnumerable<TimetableSession> sessions, TimetableSession newSession)
        {
            return sessions.Any(session =>
                session.DivisionId == newSession.DivisionId &&
                session.DayOfWeek == newSession.DayOfWeek &&
                session.SessionNumber == newSession.SessionNumber
            );
        }

        /// <summary>
        /// التحقق من تجاوز الحد الأقصى لعدد حصص المادة في الأسبوع
        /// </summary>
        /// <param name="sessions">قائمة حصص الجدول الزمني الحالية</param>
        /// <param name="newSession">الحصة الجديدة المراد إضافتها</param>
        /// <param name="maxSessionsPerWeek">الحد الأقصى لعدد حصص المادة في الأسبوع</param>
        /// <returns>true إذا كان هناك تجاوز، false إذا لم يكن هناك تجاوز</returns>
        public static bool HasSubjectLimitExceeded(
            IEnumerable<TimetableSession> sessions,
            TimetableSession newSession,
            int maxSessionsPerWeek)
        {
            int subjectSessionsCount = sessions.Count(session =>
                session.SubjectAssignment.SubjectId == newSession.SubjectAssignment.SubjectId &&
                session.DivisionId == newSession.DivisionId
            );

            return subjectSessionsCount >= maxSessionsPerWeek;
        }

        /// <summary>
        /// التحقق من توفر المعلم في اليوم والحصة المحددة
        /// </summary>
        /// <param name="sessions">قائمة حصص الجدول الزمني الحالية</param>
        /// <param name="newSession">الحصة الجديدة المراد إضافتها</param>
        /// <param name="teacherAvailability">قائمة توفر المعلمين</param>
        /// <returns>true إذا كان المعلم غير متوفر، false إذا كان المعلم متوفر</returns>
        public static bool IsTeacherUnavailable(
            IEnumerable<TimetableSession> sessions,
            TimetableSession newSession,
            IEnumerable<TeacherAvailability> teacherAvailability)
        {
            // البحث عن سجل توفر المعلم
            var availability = teacherAvailability.FirstOrDefault(a =>
                a.TeacherId == newSession.SubjectAssignment.TeacherId
            );

            if (availability == null)
            {
                return false; // إذا لم يكن هناك سجل توفر، نفترض أن المعلم متوفر
            }

            // التحقق من توفر المعلم في اليوم والحصة المحددة
            return !availability.AvailableTimes.Any(time =>
                time.DayOfWeek == newSession.DayOfWeek &&
                time.SessionNumber == newSession.SessionNumber
            );
        }

        /// <summary>
        /// التحقق من جميع التعارضات المحتملة
        /// </summary>
        /// <param name="sessions">قائمة حصص الجدول الزمني الحالية</param>
        /// <param name="newSession">الحصة الجديدة المراد إضافتها</param>
        /// <param name="maxSessionsPerWeek">الحد الأقصى لعدد حصص المادة في الأسبوع</param>
        /// <param name="teacherAvailability">قائمة توفر المعلمين</param>
        /// <returns>كائن يحتوي على نتائج التحقق من التعارضات</returns>
        public static ConflictCheckResult CheckAllConflicts(
            IEnumerable<TimetableSession> sessions,
            TimetableSession newSession,
            int maxSessionsPerWeek,
            IEnumerable<TeacherAvailability> teacherAvailability)
        {
            // التحقق من تعارض المعلم
            if (HasTeacherConflict(sessions, newSession))
            {
                return new ConflictCheckResult
                {
                    HasConflict = true,
                    ConflictType = "teacher",
                    Message = "المعلم مشغول في نفس الحصة في قسم آخر"
                };
            }

            // التحقق من تعارض القسم
            if (HasDivisionConflict(sessions, newSession))
            {
                return new ConflictCheckResult
                {
                    HasConflict = true,
                    ConflictType = "division",
                    Message = "القسم لديه حصة أخرى في نفس الوقت"
                };
            }

            // التحقق من تجاوز الحد الأقصى لعدد حصص المادة
            if (HasSubjectLimitExceeded(sessions, newSession, maxSessionsPerWeek))
            {
                return new ConflictCheckResult
                {
                    HasConflict = true,
                    ConflictType = "subject_limit",
                    Message = $"تم تجاوز الحد الأقصى لعدد حصص المادة ({maxSessionsPerWeek} حصص في الأسبوع)"
                };
            }

            // التحقق من توفر المعلم
            if (IsTeacherUnavailable(sessions, newSession, teacherAvailability))
            {
                return new ConflictCheckResult
                {
                    HasConflict = true,
                    ConflictType = "teacher_availability",
                    Message = "المعلم غير متوفر في هذا الوقت"
                };
            }

            // لا يوجد تعارضات
            return new ConflictCheckResult
            {
                HasConflict = false,
                ConflictType = null,
                Message = null
            };
        }
    }

    public class ConflictCheckResult
    {
        public bool HasConflict { get; set; }
        public string ConflictType { get; set; }
        public string Message { get; set; }
    }

    public class TeacherAvailability
    {
        public int TeacherId { get; set; }
        public List<AvailableTimeSlot> AvailableTimes { get; set; } = new List<AvailableTimeSlot>();
    }

    public class AvailableTimeSlot
    {
        public DayOfWeek DayOfWeek { get; set; }
        public int SessionNumber { get; set; }
    }
}
