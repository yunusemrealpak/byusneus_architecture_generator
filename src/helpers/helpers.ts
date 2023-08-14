import * as vscode from "vscode";
import * as fs from "fs";
import { LayerType } from "./layer_type";
import { FileStrings } from "../files/file_strings";
import { FilePaths } from "../files/file_paths";

export class Helpers {
    public static createFile(className: string, layerType: LayerType): void {
        let layerTypes: LayerType[] = [];
        if (layerType === LayerType.All) {
            layerTypes = Object.values(LayerType).filter(layerType => layerType !== LayerType.All);
        } else {
            layerTypes.push(layerType);
        }

        Object.values(layerTypes).forEach(layerType => {
            let moduleFiles = FileStrings.getModuleFilePath(className, layerType);

            if (moduleFiles.length === 0) {
                return vscode.window.showErrorMessage('Could not find module file path for layer type');
            }

            let fileStrings = FileStrings.getDartClassString(className, layerType);

            if (fileStrings.length === 0) {
                return vscode.window.showErrorMessage('Could not find file string for layer type');
            }

            moduleFiles.forEach((moduleFile, index) => {
                if (fs.existsSync(moduleFile)) {
                    fs.writeFileSync(moduleFile, fileStrings[index]);
                } else {
                    fs.writeFileSync(moduleFile, fileStrings[index]);
                }
            });

        });
    }

    public static getLayerPath(layerType: LayerType): string | undefined {
        if (FilePaths.libPath === undefined) {
            return undefined;
        }

        return FilePaths.libPath + layerType;
    }

    public static runFlutterCreateCommand(command: string): void {
        const terminal = vscode.window.createTerminal();
        terminal.sendText(command);
        terminal.show();
    }

    public static showInformationMessage(message: string): void {
        vscode.window.showInformationMessage(message);
    }

    public static showErrorMessage(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}