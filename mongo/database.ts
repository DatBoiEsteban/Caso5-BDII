import { Application } from "express";
import * as mongoose from "mongoose"
import logger from "../logger/logger"


/** Funcion de conexion con MongoDB */
export default async (app: Application) => {
    
    // Intanta conectarse
    try {

        // Abre la conexion
        await mongoose.connect("mongodb://localhost:27017/caso5", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        // Indica que salió bien
        logger.info("Conexión existosa con MongoDB");

        app.set("mongoose", mongoose);
    }
    
    // Si sale mal
    catch (error) {
        logger.error("No se pudo conectar con MongoDB", error)
    }
} 