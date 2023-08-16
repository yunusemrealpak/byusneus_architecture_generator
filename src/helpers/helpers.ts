import * as vscode from 'vscode';

export class Helpers {
    public static convertToSnakeCase(moduleName: string): string {
        return moduleName.replace(/([A-Z])/g, "_$1").toLowerCase().slice(1)
    }

    public static runFlutterCreateCommand(command: string): void {
        // if has terminal open, use it to run command else create new terminal
        const terminal = vscode.window.terminals.find((terminal) => terminal.name === 'generator');
        if (terminal) {
            terminal.sendText(command);
        }
        else {
            vscode.window.createTerminal('generator').sendText(command);
        }
       
    }

    public static showInformationMessage(message: string): void {
        vscode.window.showInformationMessage(message);
    }

    public static showErrorMessage(message: string): void {
        vscode.window.showErrorMessage(message);
    }

    public static convertToCamelCase(str: string): string {
        return str.replace(/[-_](.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    }
}