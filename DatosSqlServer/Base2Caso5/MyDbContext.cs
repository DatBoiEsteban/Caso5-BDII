using Microsoft.EntityFrameworkCore;

namespace Base2Caso5
{
    public class MyDbContext : DbContext
    {
        public DbSet<Articulo> Articulos { get; set; }
        public DbSet<ArticuloHashtag> Articulo_Hashtags { get; set; }
        public DbSet<Seccion> Articulo_Secciones { get; set; }
        public DbSet<Hashtag> Hashtags { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=127.0.0.1,1433;Database=caso5; User Id=sa; Password=reallyStrongPassword123");
        }
    }
}
