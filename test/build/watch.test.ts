import { runin } from "../utils";
import { CliStartup } from "../../src/cli-startup";
import { BuildMiddlware } from "../../src/middlewares/build.middleware";
import * as fs from "fs";
import { parseInject } from "@sfajs/inject";
import { AssetsService } from "../../src/services/assets.service";
import { WatchCompilerService } from "../../src/services/watch-compiler.service";

function runTest(options: {
  callback?: boolean;
  preserveWatchOutput?: boolean;
}) {
  test(`build watch`, async () => {
    let callCount = 0;
    await runin(`test/build/watch`, async () => {
      await new CliStartup(undefined, {
        watch: true,
        watchAssets: true,
        preserveWatchOutput: options.preserveWatchOutput == true,
      })
        .use(async (ctx, next) => {
          if (options.callback) {
            ctx.bag("onWatchSuccess", () => {
              callCount++;
            });
          }
          try {
            await next();
          } finally {
            const assetsService = await parseInject(ctx, AssetsService);
            await assetsService.stopWatch();

            const watchCompilerService = await parseInject(
              ctx,
              WatchCompilerService
            );
            watchCompilerService.stop();
            watchCompilerService.stop(); // test again
          }
          callCount++;
        })
        .add(BuildMiddlware)
        .run();

      expect(fs.existsSync("./.sfa-cache")).toBeTruthy();
      expect(fs.existsSync("./.sfa-cache/build-test.js")).toBeTruthy();
      callCount++;
    });
    expect(callCount).toBe(options.callback ? 3 : 2);
  });
}

runTest({
  callback: true,
});
runTest({
  callback: false,
});
runTest({
  preserveWatchOutput: true,
});
