import * as vscode from 'vscode';

export class Helpers {
    public static convertToSnakeCase(moduleName: string): string {
        return moduleName.replace(/([A-Z])/g, "_$1").toLowerCase().slice(1)
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