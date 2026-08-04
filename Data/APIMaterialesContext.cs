using Microsoft.EntityFrameworkCore;

namespace APIMateriales2026GiaroliValentin.Models
{
    public class APIMaterialesContext : DbContext
    {
        public APIMaterialesContext(DbContextOptions<APIMaterialesContext> options)
        : base(options)
        {
            
        }

        public DbSet<Material> Materiales {get; set;}

        public DbSet<Producto> Productos {get; set;}

        public DbSet<Rubro> Rubros {get; set;}
    }
}