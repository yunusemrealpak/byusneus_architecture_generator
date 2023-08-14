import * as fs from 'fs';
import { FilePaths } from '../files/file_paths';
import { Helpers } from './helpers';

export class PubspecHelpers {
    public static updateProjectName(projectName: string): void {
        if (FilePaths.pubspecPath === undefined) {
            Helpers.showErrorMessage('Could not find pubspec.yaml file');
            return;
        }

        const pubspecFile = fs.readFileSync(FilePaths.pubspecPath, 'utf8');
        const pubspecFileLines = pubspecFile.split('\n');
        const projectNameLineIndex = pubspecFileLines.findIndex(line => line.includes('name:'));
        pubspecFileLines[projectNameLineIndex] = `name: ${projectName}`;

        fs.writeFileSync(FilePaths.pubspecPath, pubspecFileLines.join('\n'));
    }
}