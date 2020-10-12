import { connect } from "mongoose"
import logger from "../logger/logger"


/** Funcion de conexion con MongoDB */
export default async () => {
    
    // Intanta conectarse
    try {

        // Abre la conexion
        await connect("mongodb://localhost:27017/caso5", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        // Indica que salió bien
        logger.info("Conexión existosa con MongoDB");
    }
    
    // Si sale mal
    catch (error) {
        logger.error("No se pudo conectar con MongoDB", error)
    }
} 