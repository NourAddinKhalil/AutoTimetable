using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoTimetableApi.Models
{
    public class Division
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [ForeignKey("Class")]
        public int ClassId { get; set; }
        
        // Navigation properties
        public virtual Class Class { get; set; } = null!;
        public virtual ICollection<SubjectAssignment> SubjectAssignments { get; set; } = new List<SubjectAssignment>();
        public virtual ICollection<TimetableSession> TimetableSessions { get; set; } = new List<TimetableSession>();
    }
}
