
import * as vscode from 'vscode';
import { Commands } from './commands/commands';

export function activate(context: vscode.ExtensionContext) {

	const commands = [
		{ name: 'createModule', command: Commands.createModule },
		{ name: 'recreateAndroidAndIosFolders', command: Commands.recreateAndroidAndIosFolders },
		{ name: 'cloneByusneusArchitecture', command: Commands.cloneByusneusArchitecture },
		{ name: 'upgradeDartPackages', command: Commands.upgradeDartPackages },
		{ name: 'updatePods', command: Commands.updatePods },
	];

	commands.forEach((cmd) => {
		context.subscriptions.push(
			vscode.commands.registerCommand(`byusneus-architecture-generator.${cmd.name}`, cmd.command)
		);
	});
}

export function deactivate() {}
