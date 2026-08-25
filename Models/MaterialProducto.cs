using System.ComponentModel.DataAnnotations;
using APIMateriales2026GiaroliValentin.Models;

namespace APIMateriales2026GiaroliValentin.Models
{
    public class MaterialProducto
    {
        [Key]
        public int MaterialProductoID { get; set; }

        public int MaterialID {get; set;}

        public virtual Material? Material {get; set;}

        public int ProductoID {get; set;}

        public virtual Producto? Producto {get; set;}

        public decimal Cantidad {get; set;}

        public decimal PrecioCostoUnitario {get; set;}

        public decimal SubTotal {get; set;}

    }
}