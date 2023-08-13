
import * as vscode from 'vscode';
import { Commands } from './commands/commands';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('byusneus-architecture-generator.createModule', Commands.createModule)
	);
}

export function deactivate() {}
