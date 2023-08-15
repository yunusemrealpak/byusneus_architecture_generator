import * as vscode from 'vscode';
import { LanguageFile } from '../models/language_file';

export class FilePaths {
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