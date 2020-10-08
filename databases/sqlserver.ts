import { Connection } from "tedious";
import Logger from "../logger/logger";


const connection = new Connection({
    server: "192.168.1.210",
    authentication: {
        type: "default",
        options: {
            userName: "test",
            password: "hola12345caso5"
        }
    }
})

connection.on('connect', (err) => {
    if (err)
        Logger.error("No se pudo conectar a la base de datos de Sql Server", err)
    else
        Logger.info("Conectado a la base de datos de Sql Server")
})

export default connection;