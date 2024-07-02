import * as fs from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';
import request from 'sync-request';
import { fileURLToPath } from 'url';
import { Keyword } from '../entities/Keyword.js';

// Helper function to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ClassificationModel {

    // Function to download the image from the URL synchronously
    public static downloadImageSync(url: string, filePath: string): void {
        const res = request('GET', url);
        fs.writeFileSync(filePath, res.getBody());
    }

    // Function to perform prediction and return predicted classes
    public static predictClasses(imageUrl: string): string {
        const imagePath = path.resolve(__dirname, 'downloaded_image.jpg');
        
        // Download the image
        try {
            this.downloadImageSync(imageUrl, imagePath);
        } catch (error) {
            console.error('Error while downloading the image', error);
            return 'Error while downloading the image';
        }
        
        // Write image path to input JSON file
        const inputData = { image_path: imagePath };
        fs.writeFileSync('input.json', JSON.stringify(inputData));
        
        try {
            // Construct the path to the Python script
            //const scriptPath = path.resolve(__dirname, 'yolo.py');
            //console.log(`Executing Python script at: ${scriptPath}`);
            execSync('python D:/Hitchhiker-Server/src/models/ResNet-50.py');
        } catch (error) {
            console.error('Error while executing classification Python script', error);
            return 'Error while executing Python script';
        }

        // Read predicted classes from output JSON file
        let predictedClass: string;
        try {
            const outputData = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
            predictedClass = outputData.predicted_class;
        } catch (error) {
            console.error('Error while reading output JSON file', error);
            return 'Error while reading output JSON file';
        }

        // Delete the image file
        //fs.unlinkSync(imagePath);

        return predictedClass;
    }
}

// Example usage
// const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/ndeel-98aba.appspot.com/o/CAP3771724188684002096.jpg?alt=media&token=b27e2de8-f7c8-413f-8fda-cf1a05776a00';
// const predictedClass = ClassificationModel.predictClasses(imageUrl);
// console.log(predictedClass);