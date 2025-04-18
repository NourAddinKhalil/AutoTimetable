using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoTimetableApi.Models
{
    public class SubjectAssignment
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("Division")]
        public int DivisionId { get; set; }
        
        [ForeignKey("Subject")]
        public int SubjectId { get; set; }
        
        [ForeignKey("Teacher")]
        public int TeacherId { get; set; }
        
        [Required]
        public int WeeklyFrequency { get; set; }
        
        // Navigation properties
        public virtual Division Division { get; set; } = null!;
        public virtual Subject Subject { get; set; } = null!;
        public virtual Teacher Teacher { get; set; } = null!;
        public virtual ICollection<TimetableSession> TimetableSessions { get; set; } = new List<TimetableSession>();
    }
}
