import * as vscode from 'vscode';
import * as fs from 'fs';
import { FileStrings } from '../files/file_strings';
import { Helpers } from '../helpers/helpers';
import { LayerType } from '../helpers/layer_type';
import { FilePaths } from '../files/file_paths';

export class Commands {
    public static async createModule(moduleName: string): Promise<void> {
        const rawResult = await vscode.window.showInputBox({
            prompt: "Enter module name",
            placeHolder: "Module names (auth, chat, home ...)",
        });

        if (!rawResult) {
            vscode.window.showErrorMessage('Please enter a valid module name');
            return;
        }

        // select layer types
        const selectedLayerType = await vscode.window.showQuickPick(
            Object.values(LayerType),
            {
                canPickMany: false,
                placeHolder: "Select layer types",
            }
        ) as LayerType;
        
        if (!selectedLayerType) {
            vscode.window.showErrorMessage('Please select at least one layer type');
            return;
        }

        Helpers.createFile(rawResult, selectedLayerType);

        vscode.window.showInformationMessage('Module created successfully');
    }

    public static async recreateAndroidAndIosFolders(): Promise<void> {
        const rawResult = await vscode.window.showInputBox({
            prompt: "Enter application bundle id",
            placeHolder: "com.example.app",
        });

        if (!rawResult) {
            vscode.window.showErrorMessage('Please enter a valid bundle id');
            return;
        }

        // remove android and ios folders
        FilePaths.androidPath && fs.rmdirSync(FilePaths.androidPath, { recursive: true });
        FilePaths.iosPath && fs.rmdirSync(FilePaths.iosPath, { recursive: true });

        let orgName = rawResult.split('.').slice(0, -1).join('.');
        let projectName = rawResult.split('.').pop();
        const flutterCreateCommand = `flutter create --org ${orgName} --project-name ${projectName} .`;

        Helpers.runFlutterCreateCommand(flutterCreateCommand);
    }
}