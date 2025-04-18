using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoTimetableApi.Models
{
    public class TimetableSession
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("Division")]
        public int DivisionId { get; set; }
        
        [ForeignKey("SubjectAssignment")]
        public int SubjectAssignmentId { get; set; }
        
        [Required]
        public DayOfWeek DayOfWeek { get; set; }
        
        [Required]
        public int SessionNumber { get; set; }
        
        // Navigation properties
        public virtual Division Division { get; set; } = null!;
        public virtual SubjectAssignment SubjectAssignment { get; set; } = null!;
    }
}
