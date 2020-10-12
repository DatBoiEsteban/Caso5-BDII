import * as faker from "faker/locale/es";
import logger from "../logger/logger";
import Post, { IPost } from "./schemas";


/** Numero de cuantos posts se quieren usar */
const POSTS_NUMBER = 1000;

/** Indicador si quiere sobrescribir siempre los posts */
const OVERRIDE = false;

/** Funcion para generar posts random para mongodb */
export default async () => {

    // Si ya hay post, sigue
    if (await Post.countDocuments({}) != 0 && !OVERRIDE)
        return;

    // Elimina todos los posts para empezar desde 0
    await Post.deleteMany({});

    // Instancia una lista para ir agregando los posts
    const posts: Partial<IPost>[] = [];

    // Agrega la cantidad de posts solicitada
    for (let i = 0; i < POSTS_NUMBER; i++) 
        posts.push({
            titulo: faker.lorem.words(20),
            autor: `${faker.name.findName()} ${faker.name.lastName()}`,
            secciones: [
                { contenido: faker.lorem.paragraphs(3), subTitulo: faker.lorem.words(4) },
                { contenido: faker.lorem.paragraphs(3), subTitulo: faker.lorem.words(4) },
                { contenido: faker.lorem.paragraphs(3), subTitulo: faker.lorem.words(4) },
            ],
            hashes: faker.lorem.words(10).split(" ")
        });

    // Agrega los posts en la base de datos
    await Post.insertMany(posts);

    // Informa que se insertaron
    logger.info(`${POSTS_NUMBER} posts insertados en MongoDB`);
}