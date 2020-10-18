import { createLogger, transports, format } from 'winston';


/** Funcion para formatear el log */
const nicePrint = format.printf(({ level, message, timestamp }) => {
  return `${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()} [${level}]: ${message}`;
});

// Crea y exporta un logger por defecto
export default createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    nicePrint,
  ),
  transports: [
    new transports.Console()
  ]
})