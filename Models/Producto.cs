using System.ComponentModel.DataAnnotations;

namespace APIMateriales2026GiaroliValentin.Models
{
    public class Producto
    {
        [Key]
        public int ProductoID { get; set;}

        public string Descripcion {get; set;}

        public bool Eliminado {get; set; }
    }
}