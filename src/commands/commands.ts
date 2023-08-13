import * as vscode from 'vscode';
import * as fs from 'fs';
import { FileStrings } from '../files/file_strings';
import { Helpers } from '../helpers/helpers';
import { LayerType } from '../helpers/layer_type';

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
}