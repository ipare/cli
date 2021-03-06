import { Inject } from "@ipare/inject";
import path from "path";
import { TsconfigService } from "./tsconfig.service";
import * as chokidar from "chokidar";
import * as fs from "fs";
import { AssetConfig } from "../../configuration";
import glob from "glob";
import { FileService } from "../file.service";
import { ConfigService } from "./config.service";

type FixedAsset = {
  include: string;
  exclude: string[];
  outDir: string;
  root: string;
};

export class AssetsService {
  @Inject
  private readonly tsconfigService!: TsconfigService;
  @Inject
  private readonly configService!: ConfigService;
  @Inject
  private readonly fileService!: FileService;

  private readonly watchers: chokidar.FSWatcher[] = [];

  public get assets(): FixedAsset[] {
    let assCfg = this.configService.getOptionOrConfigValue<
      string,
      AssetConfig[]
    >("assets", "build.assets", []);

    if (typeof assCfg == "string") {
      assCfg = [
        {
          include: assCfg.split("|"),
        },
      ];
    }

    const result: FixedAsset[] = [];
    assCfg
      .map((asset) => {
        if (typeof asset == "string") {
          return {
            include: asset,
          };
        } else {
          return asset;
        }
      })
      .filter((asset) => !!asset.include)
      .forEach((asset) => {
        let exclude = asset.exclude ?? [];
        if (typeof exclude == "string") {
          exclude = [exclude];
        }

        const outDir = path.join(this.cacheDir, asset.outDir ?? "");
        const root = asset.root
          ? path.resolve(process.cwd(), asset.root)
          : process.cwd();

        if (typeof asset.include == "string") {
          result.push({
            include: asset.include,
            exclude,
            outDir,
            root,
          });
        } else {
          for (const item of asset.include) {
            result.push({
              include: item,
              exclude,
              outDir,
              root,
            });
          }
        }
      });
    return result;
  }

  private get cacheDir() {
    return this.tsconfigService.cacheDir;
  }
  private get watch() {
    return this.configService.getOptionOrConfigValue<boolean>(
      "watch",
      "build.watch",
      false
    );
  }
  private get watchAssets() {
    return this.configService.getOptionOrConfigValue<boolean>(
      "watchAssets",
      "build.watchAssets",
      this.watch
    );
  }

  public async stopWatch() {
    await Promise.all(this.watchers.map((watcher) => watcher.close()));
  }

  public async copy() {
    if (!this.assets.length) return;

    for (const asset of this.assets) {
      if (this.watchAssets) {
        this.watchAsset(asset);
      } else {
        await this.globCopy(asset);
      }
    }
  }

  private async globCopy(asset: FixedAsset) {
    const paths = glob.sync(asset.include, {
      ignore: asset.exclude,
      cwd: asset.root,
      dot: true,
      nodir: true,
    });
    for (const p of paths) {
      const sourceFile = path.join(asset.root, p);
      const targetFile = path.join(asset.outDir, p);

      await this.fileService.createDir(targetFile);
      await fs.promises.copyFile(sourceFile, targetFile);
    }
  }

  private watchAsset(asset: FixedAsset) {
    const getTargetPath = (file: string) => {
      return path.join(asset.outDir, file);
    };
    const getSourcePath = (file: string) => {
      return path.join(asset.root, file);
    };
    const onChange = async (filePath: string) => {
      const targetPath = getTargetPath(filePath);
      const sourcePath = getSourcePath(filePath);
      await this.fileService.createDir(targetPath);
      await fs.promises.copyFile(sourcePath, targetPath);
    };
    const onUnlink = async (filePath: string) => {
      const targetPath = getTargetPath(filePath);
      await fs.promises.unlink(targetPath);
    };

    const watcher = chokidar
      .watch(asset.include, {
        ignored: asset.exclude,
        cwd: asset.root,
      })
      .on("add", onChange)
      .on("change", onChange)
      .on("unlink", onUnlink);
    this.watchers.push(watcher);
  }
}
