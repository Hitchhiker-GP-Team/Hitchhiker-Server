import * as fs from "fs";
import { execSync } from "child_process";
import * as path from "path";
import request from "sync-request";
import { fileURLToPath } from "url";
import { Keyword } from "../entities/Keyword.js";

// Helper function to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DetectionModel {
  // Function to download the image from the URL synchronously
  public static downloadImageSync(url: string, filePath: string): void {
    const res = request("GET", url);
    fs.writeFileSync(filePath, res.getBody());
  }

  // Function to perform prediction and return predicted classes
  public static predictClasses(imageUrl: string): Keyword[] {
    const imagePath = path.resolve(__dirname, "downloaded_image.jpg");

    // Download the image
    try {
      this.downloadImageSync(imageUrl, imagePath);
    } catch (error) {
      console.error("Error while downloading the image", error);
      return [];
    }

    // Write image path to input JSON file
    const inputData = { image_path: imagePath };
    fs.writeFileSync("input.json", JSON.stringify(inputData));

    try {
      // Construct the path to the Python script
      //const scriptPath = path.resolve(__dirname, 'yolo.py');
      //console.log(`Executing Python script at: ${scriptPath}`);
      execSync("python src/models/yolo.py");
    } catch (error) {
      console.error("Error while executing Python script", error);
      return [];
    }

    // Read predicted classes from output JSON file
    const outputData = JSON.parse(fs.readFileSync("output.json", "utf-8"));
    const predictedClasses: Keyword[] = outputData.predicted_classes.map(
      (item: { class: string; perc: number }) => {
        const keyword = new Keyword();
        keyword.name = item.class;
        keyword.confidence = item.perc;
        return keyword;
      }
    );

    // Delete the image file
    fs.unlinkSync(imagePath);

    return predictedClasses;
  }

  public static mapToCategory(keyword: string): string {
    const keywordMap = new Map<string, string>([
      ["Golf ball", "Golf"],
      ["Golf club-handle", "Golf"],
      ["Golf club-head", "Golf"],
      ["paddle rackets", "Paddle"],
      ["ping pong rackets", "Ping-Pong"],
      ["basketball hoop", "Basketball"],
      ["basketball", "Basketball"],
      ["bowling ball", "Bowling"],
      ["bowling pin", "Bowling"],
      ["billiard ball", "Billiard"],
      ["billiard table", "Billiard"],
      ["surfboard", "Surfing"],
      ["Snowboard", "Snow Boarding"],
      ["pizza", "Food"],
      ["cake", "Food"],
      ["donut", "Food"],
      ["sandwich", "Food"],
      ["tennis racket", "Tennis"],
      ["baseball bat", "Baseball"],
      ["baseball glove", "Baseball"],
      ["skis", "Skiing"],
      ["skateboard", "Skating"],
      ["motorcycle", "Motors"],
      ["car", "Cars"],
      ["bicycle", "Biking"],
      ["boat", "Boats"],
      ["train", "Travelling"],
      ["mouse", "Gaming"],
      ["keyboard", "Gaming"],
      ["monitor", "Gaming"],
      ["dining table", "Food"],
      ["bottle", "Food"],
      ["bowl", "Food"],
      ["knife", "Food"],
      ["fork", "Food"],
      ["cup", "Food"],
      ["horse", "Nature"],
      ["elephant", "Nature"],
      ["airplane", "Nature"],
      ["cat", "Nature"],
      ["dog", "Nature"],
      ["giraffe", "Nature"],
      ["bird", "Nature"],
      ["zebra", "Nature"],
      ["bear", "Nature"],
    ]);

    const category = keywordMap.get(keyword);
    return category as string;
  }
}

// Example usage
//const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/ndeel-98aba.appspot.com/o/CAP3771724188684002096.jpg?alt=media&token=b27e2de8-f7c8-413f-8fda-cf1a05776a00';
//const predictedClasses = DetectionModel.predictClasses(imageUrl);
//console.log(predictedClasses);
