import * as vscode from 'vscode';
import { LanguageFile } from '../models/language_file';
import { TestModuleFile } from '../models/test_module_file';

export class FilePaths {
    static async getSceneList(modulePath: string) : Promise<string[]> {
        const scenesPath = `${modulePath}/scenes`;
        const scenesPromise = vscode.workspace.fs.readDirectory(vscode.Uri.file(scenesPath)).then(files => {
            return files.filter(file => file[1] === vscode.FileType.Directory).map(file => file[0]);
        });

        const scenes = (await scenesPromise).values();

        return [...scenes];
    }
    public static async languagePaths(): Promise<LanguageFile[]> {
        if (this.rootPath === undefined) {
            return [];
        }

        // find all language files from the assets/i10n folder and return them as LanguageFile objects without thenable
        
        const languageFileNames = vscode.workspace.fs.readDirectory(vscode.Uri.file(`${this.rootPath}/assets/i10n`)).then(files => {
            return files.filter(file => file[1] === vscode.FileType.File).map(file => file[0].replace('.json', ''));
        });

        const files = languageFileNames.then(languageFileNames => {
            return languageFileNames.map(languageFileName => new LanguageFile(languageFileName, `${this.rootPath}/assets/i10n/${languageFileName}.json`));
        });
        
        const values = (await files).values();

        return [...values];
    }

    public static async testModulePaths(): Promise<TestModuleFile[]> {
        if (this.rootPath === undefined) {
            return [];
        }

        const testModleFileNames = vscode.workspace.fs.readDirectory(vscode.Uri.file(`${this.rootPath}/integration_test/robot`)).then(files => {
            return files.filter(file => file[1] === vscode.FileType.Directory).map(file => file[0]);
        });

        const files = testModleFileNames.then(testModleFileNames => {
            return testModleFileNames.map(testModleFileName => new TestModuleFile(testModleFileName, `${this.rootPath}/integration_test/robot/${testModleFileName}`));
        });
        
        const values = (await files).values();

        return [...values];
    }

    public static get testRunnerClassPath(): string | undefined {
        if (this.rootPath === undefined) {
            return undefined;
        }

        return this.rootPath + '/integration_test/test/';
    }

    public static get testRobotClassPath(): string | undefined {
        if (this.rootPath === undefined) {
            return undefined;
        }

        return this.rootPath + '/integration_test/robot';
    }

    public static get androidPath(): string | undefined {
        if (this.rootPath === undefined) {
            return undefined;
        }

        return this.rootPath + '/android';
    }

    public static get iosPath(): string | undefined {
        if (this.rootPath === undefined) {
            return undefined;
        }

        return this.rootPath + '/ios';
    }

    public static get pubspecPath(): string | undefined {
        if (this.rootPath === undefined) {
            return undefined;
        }

        return this.rootPath + '/pubspec.yaml';
    }

    public static get libPath(): string | undefined {
        if (this.rootPath === undefined) {
            return undefined;
        }

        return this.rootPath + '/lib';
    }

    private static get rootPath(): string | undefined {
        return vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    }
}