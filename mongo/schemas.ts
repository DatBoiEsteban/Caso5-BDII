import { Schema, Document, model } from 'mongoose';

/** Interfaz que muestra como se ve una seccion de un post */
interface ISeccion {
  contenido: string;
  subTitulo?: string;
}

/** Interfaz para modelar como se deberia ver y comportar un post */
export interface IPost extends Document {
  titulo: string;
  autor: string;
  secciones: ISeccion[];
  hashes: string[];
}

/** Schema para modelar los post de una base de datos */
const PostSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  secciones: [
    {
      contenido: {
        type: String,
        required: true,
      },
      subtitulo: {
        type: String,
      },
    },
  ],
  hashes: [String],
});

/** Exporta el modelo para poder ser utilizado */
export default model<IPost>('Post', PostSchema);
