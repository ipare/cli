import { HttpStartup } from "@ipare/http";
import chalk from "chalk";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const setupStartup = require("./startup").default;

const mode = "{{MODE}}";
const port = "{{PORT}}";

async function bootstrap() {
  const startup = await setupStartup(new HttpStartup().useHttpJsonBody(), mode);
  const result = await startup.dynamicListen(parseInt(port) ?? 2333);
  console.log(chalk.blue(`start: http://localhost:${result.port}`));
  return result;
}

bootstrap();
