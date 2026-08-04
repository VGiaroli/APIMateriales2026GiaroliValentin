using System.ComponentModel.DataAnnotations;

namespace APIMateriales2026GiaroliValentin.Models
{
    public class Material
    {
        [Key]
        public int MaterialID {get; set; }

        public string Descripcion {get; set;}

        public decimal PrecioCosto {get; set;}

        public int RubroID {get; set;}

        public Rubro? Rubro {get; set;}

        public bool Eliminado {get; set;}
    }
}