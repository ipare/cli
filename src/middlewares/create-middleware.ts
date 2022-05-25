import { Middleware } from "@sfajs/core";
import * as fs from "fs";
import { CreateTemplateService } from "../services/create-template.service";
import { Inject } from "@sfajs/inject";
import { FileService } from "../services/file.service";
import { CreateEnvService } from "../services/create-env.service";
import { PluginService } from "../services/plugin.service";

export class CreateMiddleware extends Middleware {
  @Inject
  private readonly createTemplateService!: CreateTemplateService;
  @Inject
  private readonly createEnvService!: CreateEnvService;
  @Inject
  private readonly pluginService!: PluginService;
  @Inject
  private readonly fileService!: FileService;

  private get targetDir() {
    return this.createEnvService.targetDir;
  }

  async invoke(): Promise<void> {
    if (fs.existsSync(this.targetDir)) {
      const message = `Target directory ${this.targetDir} already exists. Overwrite?`;
      if (!(await this.fileService.isOverwrite(message))) {
        return;
      }
    }

    const plugins = await this.pluginService.getPlugins();
    this.createTemplateService.create(plugins, this.targetDir);

    await this.createEnvService.create();

    await this.next();
  }
}
