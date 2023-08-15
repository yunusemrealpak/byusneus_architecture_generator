export class LanguageHelpers {
    public static getLanguageFileContent(language: string): any {
        return require(`../assets/languages/${language}.json`);
    }
}