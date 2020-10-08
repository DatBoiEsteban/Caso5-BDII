import { createLogger, transports, format } from 'winston';


const nicePrint = format.printf(({ level, message, timestamp }) => {
  return `${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()} [${level}]: ${message}`;
});

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