using System.ComponentModel.DataAnnotations;

namespace APIMateriales2026GiaroliValentin.ModelsView
{
    public class VistaMaterial
    {
        public int MaterialID { get; set; }

        public string? Descripcion { get; set; }

        public decimal PrecioCosto { get; set; }

        public bool Eliminado { get; set; }
    }
}