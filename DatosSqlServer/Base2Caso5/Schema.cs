using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Base2Caso5
{
    public class Articulo
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public virtual List<Seccion> Secciones { get; set; } = new List<Seccion>();
        public virtual List<ArticuloHashtag> ArticuloHashtags { get; set; }
    }

    public class Seccion
    {
        public int Id { get; set; }
        public int ArticuloId { get; set; }
        public string Contenido { get; set; }
        public string SubTitulo { get; set; }
        public string Tipo { get; set; }
    }

    public class Hashtag
    {
        public int Id { get; set; }
        [Column("Hashtag")]
        public string Name { get; set; }
        public virtual List<ArticuloHashtag> ArticuloHashtags { get; set; }
    }

    public class ArticuloHashtag
    {
        public int Id { get; set; }
        public int ArticuloId { get; set; }
        public int HashtagId { get; set; }

        public virtual Articulo Articulo { get; set; }
        public virtual Hashtag Hashtag { get; set; }
    }
}
