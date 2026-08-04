using System.ComponentModel.DataAnnotations;

namespace APIMateriales2026GiaroliValentin.Models
{
    public class Rubro
    {
        [Key]
        public int RubroID {get; set;}

        public string Descripcion {get; set;}

        public bool Eliminado {get; set;}

        public ICollection<Material> Materiales {get; set;} = new List<Material>();
    }
}