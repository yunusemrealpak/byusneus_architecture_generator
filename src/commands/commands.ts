import * as vscode from 'vscode';
import * as fs from 'fs';
import { FileStrings } from '../files/file_strings';
import { Helpers } from '../helpers/helpers';
import { LayerType } from '../helpers/layer_type';
import { FilePaths } from '../files/file_paths';
import { PubspecHelpers } from '../helpers/pubspec_helpers';

export class Commands {
    public static async cloneByusneusArchitecture(): Promise<void> {
        const githubUrl = 'https://github.com/yunusemrealpak/flutter_boilerplate.git';

        // clone repo
        Helpers.runFlutterCreateCommand(`git clone ${githubUrl} demo && mv demo/* . && mv demo/.gitignore . && rm -rf demo`);
    }

    public static async createModule(): Promise<void> {
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

        Helpers.showInformationMessage('Module created successfully');
    }

    public static async recreateAndroidAndIosFolders(): Promise<void> {
        const rawResult = await vscode.window.showInputBox({
            prompt: "Enter application bundle id",
            placeHolder: "com.example.app",
        });

        if (!rawResult) {
            Helpers.showErrorMessage('Please enter a valid bundle id');
            return;
        }

        // check rawResult is valid bundle id and contains '.' twice
        if (!rawResult.includes('.') && rawResult.split('.').length !== 2) {
            Helpers.showErrorMessage('Please enter a valid bundle id');
            return;
        }

        // remove android and ios folders
        FilePaths.androidPath && fs.rmdirSync(FilePaths.androidPath, { recursive: true });
        FilePaths.iosPath && fs.rmdirSync(FilePaths.iosPath, { recursive: true });

        let orgName = rawResult.split('.').slice(0, -1).join('.');
        let projectName = rawResult.split('.').pop();

        if (!orgName || !projectName) {
            Helpers.showErrorMessage('Please enter a valid bundle id');
            return;
        }

        const flutterCreateCommand = `flutter create --org ${orgName} --project-name ${projectName} . && rm -rf lib/main.dart`;

        // get pubspec.yaml file path and update it with new project name
        // recreate android and ios folders
        PubspecHelpers.updateProjectName(projectName);
        Helpers.runFlutterCreateCommand(flutterCreateCommand);
    }

    public static async upgradeDartPackages(): Promise<void> {
        Helpers.runFlutterCreateCommand('flutter pub upgrade --major-versions');
    }

    public static async updatePods(): Promise<void> {
        const iosFolderPath = FilePaths.iosPath

        Helpers.runFlutterCreateCommand(`
        flutter clean
        rm -rf ios/Pods
        rm -rf ios/Podfile.lock
        rm -rf ios/.symlinks
        rm -rf ios/Flutter/Flutter.framework
        rm -rf ios/Flutter/Flutter.podspec
        flutter pub get
        cd ios
        pod install
        cd ..
        `);
    }

    public static async addLanguageKeysToLanguageFiles(): Promise<void> {
        const languageFileNames = await vscode.window.showInputBox({
            prompt: "Enter language file names",
            placeHolder: "tr, en // tr-TR, en-US",
        });

        if (!languageFileNames) {
            Helpers.showErrorMessage('Please enter a valid language file names');
            return;
        }

        let languageFileNameArray = languageFileNames.split(',');

        const rawResult = await vscode.window.showInputBox({
            prompt: "Enter language key",
            placeHolder: "to specify groups use dot(.) like 'group.key'",
        });

        // check rawResult for dots. If it has dots, it means it has groups. if not it means it has no groups. So add key directly without group
        if (!rawResult) {
            Helpers.showErrorMessage('Please enter a valid language key');
            return;
        }

        let result = rawResult.split('.');
        let groups = result.slice(0, -1);
        let key = result.pop() as string;

        Helpers.showInformationMessage(`Groups: ${groups} Key: ${key}`);

        let meanings: string[] = [];

        for (const file of languageFileNameArray) {
            const meaning = await vscode.window.showInputBox({
                prompt: `Enter ${file} language meaning`,
                placeHolder: `<${file}> meaning`,
            });

            if (!meaning) {
                Helpers.showErrorMessage(`Please enter a valid ${file} language meaning`);
                return;
            }

            meanings.push(meaning);
        }

        // get all language files like tr.json, en.json
        const languageFiles = FilePaths.languagePaths(languageFileNameArray);

        // rawResult is language key like 'labels.modal_guest_title'
        // split it by '.' and get first item like 'labels'. It is language group. Second item is language key
        // get json file like 'tr.json' and add language key to it
        // tr.json => { "labels": { "modal_guest_title": "Guest" } }
        languageFiles.forEach((languageFile, index) => {

            Helpers.showInformationMessage(languageFile.path);

            const languageFileContent = fs.readFileSync(languageFile.path, 'utf-8');

            Helpers.showInformationMessage(languageFileContent);

            let languageFileContentJson = JSON.parse(languageFileContent);

            Helpers.showInformationMessage(languageFileContentJson);
            
            let group = languageFileContentJson;
            groups.forEach((groupItem) => {
                if(!group[groupItem]) {
                    group[groupItem] = {};
                }
                group = group[groupItem];
            });

            if(group[key]) {
                Helpers.showErrorMessage('Language key already exists');
                return;
            }

            group[key] = meanings[index];

            fs.writeFileSync(languageFile.path, JSON.stringify(languageFileContentJson, null, 2));

            setTimeout(() => {
                Helpers.runFlutterCreateCommand('sh ./scripts/localization.sh');
            }, 1000);
        });


        Helpers.showInformationMessage('Language key added successfully');

        // read file content and parse it to json
        // add language key to json
        
    }
}



// languageFiles.forEach((languageFile) => {
//     const languageGroup = rawResult.split('.')[0];
//     const languageKey = rawResult.split('.')[1];
//     const languageFileContent = require(languageFile);
//     const languageFileContentJson = JSON.parse(languageFileContent);

//     // check language key is already exists
//     if (languageFileContentJson[languageData]) {
//         Helpers.showErrorMessage('Language data already exists');
//         return;
//     }
// });