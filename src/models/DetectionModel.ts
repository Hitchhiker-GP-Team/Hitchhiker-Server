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

    // Execute Python script
    execSync('python src/models/yolo.py');

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
    ["golf ball",          "golf"],
    ["golf club-handle",   "golf"],
    ["golf club-head",     "golf"],
    ["paddle rackets",     "paddel"],
    ["ping pong rackets",  "ping-pong"],
    ["basketball hoop",    "basketball"],
    ["basketball",         "basketball"],
    ["bowling ball",       "bowling"],
    ["bowling pin",        "bowling"],
    ["billiard ball",      "billiard"],
    ["billiard table",     "billiard"],
    ["surfboard",          "surfing"],
    ["Snowboard",          "snow_boarding"],
    ["pizza",              "Food"],
    ["cake",               "Food"],
    ["donut",              "Food"],
    ["sandwich",           "Food"],
    ["tennis racket",      "tennis"],
    ["baseball bat",       "baseball"],
    ["baseball glove",     "baseball"],
    ["skis",               "skiing"],
    ["skateboard",         "skating"],
    ["motorcycle",         "motors"],
    ["car",                "cars"],
    ["bicycle",            "biking"],
    ["boat",               "boats"],
    ["train",              "travelling"],
    ["mouse",              "gaming"],
    ["keyboard",           "gaming"],
    ["monitor",            "gaming"],
    ["dining table",       "Food"],
    ["bottle",             "Food"],
    ["bowl",               "Food"],
    ["knife",              "Food"],
    ["fork",               "Food"],
    ["cup" ,               "Food"],
    ["horse",              "nature"],
    ["elephant",           "nature"],
    ["airplane",           "nature"],
    ["cat",                "nature"],
    ["dog",                "nature"],
    ["girrafe",            "nature"],
    ["bird",               "nature"],
    ["zebra",              "nature"],
    ["bear",               "nature"]
    ]);

    const category = keywordMap.get(keyword);
    return category as string;

}

}
