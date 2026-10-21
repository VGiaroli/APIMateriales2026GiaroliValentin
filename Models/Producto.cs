using System.ComponentModel.DataAnnotations;

namespace APIMateriales2026GiaroliValentin.Models
{
    public class Producto
    {
        [Key]
        public int ProductoID { get; set;}

        public string Descripcion {get; set;}

        public bool Eliminado {get; set; }

        public decimal CostoTotal {get; set;}
        public decimal PorcentajeGanancia {get;set;}
        public decimal PrecioVenta {get;set;}

        public ICollection<MaterialProducto> MaterialProductos {get; set;} = new List<MaterialProducto>();
    }
}