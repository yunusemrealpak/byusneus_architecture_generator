import * as vscode from "vscode";
import * as fs from "fs";
import { LayerType } from "../helpers/layer_type";
import { FileStrings } from "../files/file_strings";
import { FilePaths } from "../files/file_paths";
import { Strings } from "../files/strings";
import { Helpers } from "../helpers/helpers";

export class Functions {
    public static createFile(className: string, layerType: LayerType): void {
        let layerTypes: LayerType[] = [];
        if (layerType === LayerType.All) {
            layerTypes = Object.values(LayerType).filter(layerType => layerType !== LayerType.All);
        } else {
            layerTypes.push(layerType);
        }

        Object.values(layerTypes).forEach(layerType => {
            let moduleFiles = FileStrings.getModuleFilePath(className, layerType);

            if (moduleFiles.length === 0) {
                return vscode.window.showErrorMessage('Could not find module file path for layer type');
            }

            let fileStrings = FileStrings.getDartClassString(className, layerType);

            if (fileStrings.length === 0) {
                return vscode.window.showErrorMessage('Could not find file string for layer type');
            }

            moduleFiles.forEach((moduleFile, index) => {
                if (fs.existsSync(moduleFile)) {
                    fs.writeFileSync(moduleFile, fileStrings[index]);
                } else {
                    fs.writeFileSync(moduleFile, fileStrings[index]);
                }
            });

        });
    }

    public static createTestModule(moduleName: string, sceneList: string[]): void {
        const robotPath = FilePaths.testRobotClassPath;
        const modulePath = `${robotPath}/${moduleName}`;
        const scenesPath = `${modulePath}/scenes`;

        this.createFolder(modulePath);
        this.createFolder(scenesPath);
        
        let robotImports: string[] = [];
        let testImports: string[] = [];
        sceneList.map((scene) => {
            const scenePath = `${scenesPath}/${moduleName}_${scene}`;

            this.createFolder(scenePath);
            
            const scenarioInterfaceFilePath = `${scenePath}/i_${moduleName}_${scene}_scene.dart`;
            const scenarioFilePath = `${scenePath}/${moduleName}_${scene}_scene.dart`;

            fs.writeFileSync(scenarioInterfaceFilePath, new Strings('').getTestSceneInterfaceClassString(moduleName, scene));
            fs.writeFileSync(scenarioFilePath, new Strings('').getTestSceneClassString(moduleName, scene));

            robotImports.push(`import 'scenes/${moduleName}_${scene}/${moduleName}_${scene}_scene.dart';`);
            testImports.push(`import '../robot/${moduleName}/scenes/${moduleName}_${scene}/${moduleName}_${scene}_scene.dart';`);
        });

        fs.writeFileSync(`${modulePath}/${moduleName}_robot.dart`, new Strings(moduleName).getTestModuleClassString(robotImports.join('\n'), sceneList));

        const testRunnerClassPath = FilePaths.testRunnerClassPath + moduleName + '_test.dart';
        fs.writeFileSync(testRunnerClassPath, new Strings('').getTestRunnerClassString(moduleName, sceneList, testImports.join('\n')));
    }

    public static async createTestModuleScene(modulePath: string, scene: string): Promise<void> {
        const module = modulePath.split('/').pop() as string;
        const scenePath = `${modulePath}/scenes`;
        const sceneFolderPath = `${scenePath}/${module}_${scene}`;

        this.createFolder(sceneFolderPath);
        const scenarioInterfaceFilePath = `${sceneFolderPath}/i_${module}_${scene}_scene.dart`;
        const scenarioFilePath = `${sceneFolderPath}/${module}_${scene}_scene.dart`;

        fs.writeFileSync(scenarioInterfaceFilePath, new Strings('').getTestSceneInterfaceClassString(module, scene));
        fs.writeFileSync(scenarioFilePath, new Strings('').getTestSceneClassString(module, scene));

        const sceneList = (await FilePaths.getSceneList(modulePath)).map((scene) => scene.replace(`${module}_`, ''));
        
        let robotImports: string[] = [];
        let testImports: string[] = [];
        sceneList.map((scene) => {
            robotImports.push(`import 'scenes/${module}_${scene}/${module}_${scene}_scene.dart';`);
            testImports.push(`import '../robot/${module}/scenes/${module}_${scene}/${module}_${scene}_scene.dart';`);
        });

        fs.writeFileSync(`${modulePath}/${module}_robot.dart`, new Strings(module).getTestModuleClassString(robotImports.join('\n'), sceneList));

        const testRunnerClassPath = FilePaths.testRunnerClassPath + module + '_test.dart';
        fs.writeFileSync(testRunnerClassPath, new Strings('').getTestRunnerClassString(module, sceneList, testImports.join('\n')));   
    }

    public static createFolder(folderPath: string): void {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

    public static getLayerPath(layerType: LayerType): string | undefined {
        if (FilePaths.libPath === undefined) {
            return undefined;
        }

        return FilePaths.libPath + layerType;
    }

}