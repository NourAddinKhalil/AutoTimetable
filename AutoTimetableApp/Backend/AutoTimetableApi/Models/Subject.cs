using System.ComponentModel.DataAnnotations;

namespace AutoTimetableApi.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<SubjectAssignment> SubjectAssignments { get; set; } = new List<SubjectAssignment>();
        public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
    }
}
