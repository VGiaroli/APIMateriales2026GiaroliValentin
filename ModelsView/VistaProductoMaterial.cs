namespace APIMateriales2026GiaroliValentin.ModelsView
{
    public class VistaProductoMaterial
    {
        //POR CADA PRODUCTO VAMOS A GUARDAR EN MEMORIA EL LISTADO DE MATERIALES QUE TIENE A CARGO
        public int ProductoID {get; set;}

        public string Descripcion {get; set;}

        public decimal PorcentajeGanancia {get; set;}

        public decimal PrecioVenta {get; set;}

        public decimal CostoTotal {get; set;}

        public List<VistaMaterial> ListadoMateriales {get; set; }
    }
}