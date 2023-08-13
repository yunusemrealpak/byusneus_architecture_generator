// create a static class with a method that returns a string for dart class file
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Helpers } from "../helpers/helpers";
import { LayerType } from "../helpers/layer_type";
import { Strings } from "./strings";

export class FileStrings {
    public static getDartClassString(className: string, layerType: LayerType): string[] {
        let strings = new Strings(className);

        switch (layerType) {
            case LayerType.Infrastructure:
                return [strings.getInfrastructureClassString];
            case LayerType.Application:
                return [strings.getApplicationCubitClassString, strings.getApplicationStateClassString]
            case LayerType.Presentation:
                return [strings.getPresentationClassString];
            case LayerType.Domain:
                return [strings.getDomainClassString];
            default:
                return [];
        }
    }

    public static getModuleFilePath(className: string, layerType: LayerType): string[] {
        let layerPath = Helpers.getLayerPath(layerType);
        let modulePath = layerPath + '/' + className;

        if (!fs.existsSync(modulePath)) {
            fs.mkdirSync(modulePath);
            vscode.window.showInformationMessage('Creating module path: ' + modulePath);
        }

        vscode.window.showInformationMessage('Creating module layer: ' + layerType);

        switch (layerType) {
            case LayerType.Infrastructure:
                return [modulePath + `/${className}_repository.dart`];
            case LayerType.Application:
                return [modulePath + `/${className}_cubit.dart`, modulePath + `/${className}_state.dart`];
            case LayerType.Presentation:
                return [modulePath + `/${className}_view.dart`];
            case LayerType.Domain:
                return [modulePath + `/i_${className}_repository.dart`];
            default:
                return [];
        }
    }
}