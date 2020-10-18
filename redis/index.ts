import Redis from "ioredis";
import logger from "../logger/logger"

// Abre una conexion con redis
const client = new Redis();

// Informa que se conecto bien
logger.info("Conexión a Redis existosa");

// Y la exporta para ser usada luego
export default client;