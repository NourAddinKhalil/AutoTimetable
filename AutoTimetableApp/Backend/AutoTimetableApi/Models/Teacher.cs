using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoTimetableApi.Models
{
    public class Teacher
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Email { get; set; }
        
        [ForeignKey("Subject")]
        public int SubjectId { get; set; }
        
        // Navigation properties
        public virtual Subject Subject { get; set; } = null!;
        public virtual ICollection<SubjectAssignment> SubjectAssignments { get; set; } = new List<SubjectAssignment>();
    }
}
