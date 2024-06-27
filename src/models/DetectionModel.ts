import * as fs from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';
import { Keyword } from '../entities/Keyword.js';

export class DetectionModel{

// Function to perform prediction and return predicted classes
public static predictClasses(imagePath: string): Keyword[] {
    // Write image path to input JSON file
    const inputData = { image_path: imagePath };
    fs.writeFileSync('input.json', JSON.stringify(inputData));
    try {
        // Execute Python script
        execSync('python src/models/yolo.py');
    } catch (error) {
        console.error('Error while executing Python script');
        return [];
    }
    // Read predicted classes from output JSON file
    const outputData = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
    const predictedClasses: Keyword[] = outputData.predicted_classes.map((item: { class: string; perc: number }) => {
        const keyword = new Keyword();
        keyword.name = item.class;
        keyword.confidence = item.perc;
        return keyword;
    });

    // Delete image the file 
    fs.unlinkSync(path.basename(imagePath));

    return predictedClasses;
}

public static mapToCaetgory(keyword:string):string{

    const keywordMap = new Map<string, string>([
    ["Golf ball",          "Golf"],
    ["Golf club-handle",   "Golf"],
    ["Golf club-head",     "Golf"],
    ["paddle rackets",     "Paddle"],
    ["ping pong rackets",  "Ping-Pong"],
    ["basketball hoop",    "Basketball"],
    ["basketball",         "Basketball"],
    ["bowling ball",       "Bowling"],
    ["bowling pin",        "Bowling"],
    ["billiard ball",      "Billiard"],
    ["billiard table",     "Billiard"],
    ["surfboard",          "Surfing"],
    ["Snowboard",          "Snow Boarding"],
    ["pizza",              "Food"],
    ["cake",               "Food"],
    ["donut",              "Food"],
    ["sandwich",           "Food"],
    ["tennis racket",      "Tennis"],
    ["baseball bat",       "Baseball"],
    ["baseball glove",     "Baseball"],
    ["skis",               "Skiing"],
    ["skateboard",         "Skating"],
    ["motorcycle",         "Motors"],
    ["car",                "Cars"],
    ["bicycle",            "Biking"],
    ["boat",               "Boats"],
    ["train",              "Travelling"],
    ["mouse",              "Gaming"],
    ["keyboard",           "Gaming"],
    ["monitor",            "Gaming"],
    ["dining table",       "Food"],
    ["bottle",             "Food"],
    ["bowl",               "Food"],
    ["knife",              "Food"],
    ["fork",               "Food"],
    ["cup" ,               "Food"],
    ["horse",              "Nature"],
    ["elephant",           "Nature"],
    ["airplane",           "Nature"],
    ["cat",                "Nature"],
    ["dog",                "Nature"],
    ["girrafe",            "Nature"],
    ["bird",               "Nature"],
    ["zebra",              "Nature"],
    ["bear",               "Nature"]
    ]);

    const category = keywordMap.get(keyword);
    return category as string;

}

}
