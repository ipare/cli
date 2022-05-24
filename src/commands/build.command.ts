import { Command } from "commander";
import { CliStartup } from "../cli-startup";
import { BuildMiddlware } from "../middlewares/build.middleware";
import { BaseCommand } from "./base.command";
import "./base-build";

export class BuildCommand extends BaseCommand {
  register(command: Command): void {
    command
      .command("build")
      .alias("b")
      .setBuildOptions()
      .description("Build sfa application.")
      .action(async (command: Record<string, boolean | string>) => {
        await new CliStartup(undefined, command).add(BuildMiddlware).run();
      });
  }
}
