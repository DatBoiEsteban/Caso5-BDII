import mongoConnect from "../mongo/database";
import mongoData from "../mongo/data";
import sqlConnect from "../sqlserver/database";
import { Application } from "express";


/** Metodo para configurar las bases de datos de Sql Server y Mongo */
export default (app: Application) => {

    // Se conecta y genera la informacion de pruebas para Mongo
    mongoConnect(app);
    mongoData();

    // Se conecta y genera la informacion de pruebas para Sql Server
    sqlConnect(app);
}