import { HttpStartup } from "@ipare/http";
import startup from "./startup";

const app = startup(new HttpStartup());
async function bootstrap() {
  const listen = await app.dynamicListen(2333);
  console.log(`start: http://localhost:${listen.port}`);
}
bootstrap();
