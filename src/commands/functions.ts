import * as vscode from "vscode";
import * as fs from "fs";
import { LayerType } from "../helpers/layer_type";
import { FileStrings } from "../files/file_strings";
import { FilePaths } from "../files/file_paths";
import { Strings } from "../files/strings";

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

    public static createTestFile(moduleName: string, scenarioList: string[]): void {
        const robotPath = FilePaths.testRobotClassPath;
        const modulePath = `${robotPath}/${moduleName}`;
        const scenarioPath = `${modulePath}/scenarios`;

        this.createFolder(modulePath);
        this.createFolder(scenarioPath);

        let imports = scenarioList.map((scenario) => {
            let val = scenario.replace(/([A-Z])/g, "_$1").toLowerCase().slice(1);
            let scenarioClassName = val.split('_').splice(1);
            
            this.createFolder(`${scenarioPath}/${scenarioClassName}`);

            const scenarioInterfaceFilePath = `${scenarioPath}/${scenarioClassName}/i_${val}_scenario.dart`;
            const scenarioFilePath = `${scenarioPath}/${scenarioClassName}/${val}_scenario.dart`;

            fs.writeFileSync(scenarioInterfaceFilePath, new Strings('').getTestScenarioInterfaceClassString(scenario));
            fs.writeFileSync(scenarioFilePath, new Strings('').getTestScenarioClassString(scenario));

            return `import 'scenarios/${scenarioClassName}/${val}_scenario.dart';`;
        });

        fs.writeFileSync(`${modulePath}/${moduleName}_robot.dart`, new Strings(moduleName).getTestModuleClassString(imports.join('\n'), scenarioList));

        const testRunnerClassPath = FilePaths.testRunnerClassPath + moduleName + '_test.dart';
        fs.writeFileSync(testRunnerClassPath, new Strings('').getTestRunnerClassString(moduleName, scenarioList));
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