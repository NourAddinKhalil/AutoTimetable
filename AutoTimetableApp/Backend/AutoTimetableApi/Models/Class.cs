using System.ComponentModel.DataAnnotations;

namespace AutoTimetableApi.Models
{
    public class Class
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? Description { get; set; }
        
        // Navigation properties
        public virtual ICollection<Division> Divisions { get; set; } = new List<Division>();
    }
}
