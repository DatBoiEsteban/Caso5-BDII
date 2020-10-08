import { Application } from "express";
import sqlserver from "./sqlserver"

export default (app: Application) => {

    app.set("Sql Server", sqlserver)
} 