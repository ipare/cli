import { Startup } from "@ipare/core";
import "@ipare/router";
import "@ipare/swagger";
import "@ipare/inject";
import "@ipare/mva";
import "@ipare/filter";
import "@ipare/static";
import "@ipare/jwt";
import "@ipare/view";
import "@ipare/validator";
import * as fs from "fs";
import path from "path";
import { GlobalActionFilter } from "./filters/global.action.filter";
import { getSwaggerOptions } from "./utils/swagger";
import { JwtService } from "@ipare/jwt";
import { parseInject } from "@ipare/inject";

export default <T extends Startup>(startup: T, mode?: string) =>
  startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("version", version);
      ctx.res.setHeader("mode", mode ?? "");
      await next();
    })
    .useSwagger({
      docOptions: getSwaggerOptions(version),
    })
    // static homepage: /s
    .useStatic({
      dir: "static",
      prefix: "s",
    })
    .useValidator()
    .useJwt({
      secret: "jwt-secret",
    })
    .use(async (ctx, next) => {
      const jwtService = await parseInject(ctx, JwtService);
      const testJwt = await jwtService.sign({
        id: 1,
      });
      // just for jwt test
      ctx.req.setHeader("Authorization", "Bearer " + testJwt);
      await next();
    })
    // default verify
    .useJwtVerify()
    .useFilter()
    .useGlobalFilter(GlobalActionFilter)
    .useMva();

const version = (() => {
  const pkgName = "package.json";
  let dir = __dirname;
  let filePath = path.join(dir, pkgName);
  while (!fs.existsSync(filePath)) {
    dir = path.dirname(dir);
    filePath = path.join(dir, pkgName);
  }
  const pkgStr = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(pkgStr).version;
})();
