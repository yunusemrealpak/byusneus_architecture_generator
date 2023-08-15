import * as vscode from 'vscode';
import { LanguageFile } from '../models/language_file';

export class FilePaths {
    public static languagePaths(languageFileNames: string[]): LanguageFile[] {
        if (this.rootPath === undefined) {
            return [];
        }

        return languageFileNames.map(languageFileName => new LanguageFile(languageFileName, `${this.rootPath}/assets/i10n/${languageFileName}.json`));
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