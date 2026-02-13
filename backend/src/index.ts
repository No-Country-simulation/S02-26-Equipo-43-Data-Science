/**
 * Entry point del servidor.
 * - Carga variables de entorno
 * - Levanta Express
 */
import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";

const app = createApp();

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(` DATAMARK Backend corriendo en http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});
