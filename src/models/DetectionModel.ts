import * as fs from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';

export class DetectionModel{

// Function to perform prediction and return predicted classes
public static predictClasses(imagePath: string): string[] {
    // Write image path to input JSON file
    const inputData = { image_path: imagePath };
    fs.writeFileSync('input.json', JSON.stringify(inputData));

    // Execute Python script
    execSync('python src/models/yolo.py');

    // Read predicted classes from output JSON file
    const outputData = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
    const predictedClasses: string[] = outputData.predicted_classes;

    // Delete image the file 
    fs.unlinkSync(path.basename(imagePath));

    return predictedClasses;
}

}
