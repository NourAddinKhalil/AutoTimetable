using Microsoft.EntityFrameworkCore;

namespace AutoTimetableApi.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Class> Classes { get; set; } = null!;
        public DbSet<Division> Divisions { get; set; } = null!;
        public DbSet<Subject> Subjects { get; set; } = null!;
        public DbSet<Teacher> Teachers { get; set; } = null!;
        public DbSet<SubjectAssignment> SubjectAssignments { get; set; } = null!;
        public DbSet<StudyDay> StudyDays { get; set; } = null!;
        public DbSet<TimetableSession> TimetableSessions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // تكوين العلاقات بين الكيانات
            
            // علاقة Class - Division (1:n)
            modelBuilder.Entity<Division>()
                .HasOne(d => d.Class)
                .WithMany(c => c.Divisions)
                .HasForeignKey(d => d.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            // علاقة Subject - Teacher (1:n)
            modelBuilder.Entity<Teacher>()
                .HasOne(t => t.Subject)
                .WithMany(s => s.Teachers)
                .HasForeignKey(t => t.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            // علاقة SubjectAssignment
            modelBuilder.Entity<SubjectAssignment>()
                .HasOne(sa => sa.Division)
                .WithMany(d => d.SubjectAssignments)
                .HasForeignKey(sa => sa.DivisionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SubjectAssignment>()
                .HasOne(sa => sa.Subject)
                .WithMany(s => s.SubjectAssignments)
                .HasForeignKey(sa => sa.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SubjectAssignment>()
                .HasOne(sa => sa.Teacher)
                .WithMany(t => t.SubjectAssignments)
                .HasForeignKey(sa => sa.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);

            // علاقة StudyDay - Class (n:1)
            modelBuilder.Entity<StudyDay>()
                .HasOne(sd => sd.Class)
                .WithMany()
                .HasForeignKey(sd => sd.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            // علاقة TimetableSession
            modelBuilder.Entity<TimetableSession>()
                .HasOne(ts => ts.Division)
                .WithMany(d => d.TimetableSessions)
                .HasForeignKey(ts => ts.DivisionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TimetableSession>()
                .HasOne(ts => ts.SubjectAssignment)
                .WithMany(sa => sa.TimetableSessions)
                .HasForeignKey(ts => ts.SubjectAssignmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // إنشاء فهرس مركب لمنع التعارضات في الجدول الزمني
            modelBuilder.Entity<TimetableSession>()
                .HasIndex(ts => new { ts.DivisionId, ts.DayOfWeek, ts.SessionNumber })
                .IsUnique();

            // إنشاء فهرس مركب لمنع تعيين معلم لنفس الحصة في صفوف مختلفة
            modelBuilder.Entity<TimetableSession>()
                .HasIndex(ts => new { ts.SubjectAssignment.TeacherId, ts.DayOfWeek, ts.SessionNumber })
                .IsUnique();
        }
    }
}
