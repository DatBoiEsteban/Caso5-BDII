import { Application } from 'express';
import Posts from './posts';


/** Metodo para configurar las rutas */
export default function(app: Application) {

    // Configura el controlador de posts
    app.use('/api/posts', Posts);
};
