using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoTimetableApi.Models
{
    public class StudyDay
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public DayOfWeek DayOfWeek { get; set; }
        
        [ForeignKey("Class")]
        public int ClassId { get; set; }
        
        [Required]
        public int SessionsCount { get; set; }
        
        // Navigation properties
        public virtual Class Class { get; set; } = null!;
    }
}
