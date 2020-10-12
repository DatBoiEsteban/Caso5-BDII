import { Application } from "express";
import { Connection } from "tedious";
import Logger from "../logger/logger";


/** Establece una nueva conexion con Sql Server */
const connection = new Connection({
    server: ".",
    authentication: {
        type: "default",
        options: {
            userName: "caso5admin",
            password: "test"
        }
    }
});

/** Listener cuando se conecta a la base de datos */
connection.on('connect', (err) => {
    if (err)
        Logger.error("No se pudo conectar a la base de datos de Sql Server", err)
    else
        Logger.info("Conectado a la base de datos de Sql Server")
})

/** Exporta la conexion */
export default (app: Application) => app.set("sql", connection);