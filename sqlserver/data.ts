import { Application } from 'express';
import * as faker from 'faker/locale/es';
import { Connection, Request } from 'tedious';
import { IPost } from '../mongo/schemas';
import { TYPES } from "tedious";

/** Numero de cuantos posts se quieren usar */
const POSTS_NUMBER = 1000;

/** Indicador si quiere sobrescribir siempre los posts */
const OVERRIDE = false;

/** Funcion para generar posts random para mongodb */
export default async (app: Application) => {

	// Obtiene la conexion
	const sql: Connection = app.get("sql");

	const isEmpty = new Request("SELECT 1 FROM [dbo].[Articulos]", (err, rowCount, rows) => {
		if (rows.length === 0)
			generateData(sql);
	})

	sql.execSql(isEmpty);
};


const generateData = (connection: Connection) => {
	// Instancia una lista para ir agregando los posts
	const posts: Partial<IPost>[] = [];

	// Agrega la cantidad de posts solicitada
	for (let i = 0; i < POSTS_NUMBER; i++)
		posts.push({
			titulo: faker.lorem.words(20),
			autor: `${faker.name.findName()} ${faker.name.lastName()}`,
			secciones: [
				{
					contenido: faker.lorem.paragraphs(3),
					subTitulo: faker.lorem.words(4),
				},
				{
					contenido: faker.lorem.paragraphs(3),
					subTitulo: faker.lorem.words(4),
				},
				{
					contenido: faker.lorem.paragraphs(3),
					subTitulo: faker.lorem.words(4),
				},
			],
			hashes: faker.lorem.words(10).split(' '),
		});

	const articulosBulk = connection.newBulkLoad('[dbo].[Articulos]', (err, rowCount) => {});
	articulosBulk.addColumn("Titulo", TYPES.NVarChar, { nullable: false });
	articulosBulk.addColumn("Autor", TYPES.NVarChar, { nullable: false });
	posts.forEach(post => articulosBulk.addRow({ "Titulo": post.titulo, "Autor": post.autor }));

	connection.execBulkLoad(articulosBulk);
}