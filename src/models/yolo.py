import json
from PIL import Image
from ultralytics import YOLO

# Function to perform prediction and return predicted classes
def perform_prediction(img_path):
    # Load the YOLOv8 model
    model = YOLO(r"src\models\best.pt")

    # Perform prediction
    results = model.predict(source=img_path, verbose=False, save=False)

    # list to store predicted classes
    predicted_classes = []


    # Define confidence threshold

    confidenceThreshold = 60

    # Iterate over the results and store the predicted classes in the list
    for result in results:
        for box in result.boxes:
            class_id = int(box.data[0][-1])
            confidence = round(float(box.data[0][4]), 2) * 100 
            predicted_class = model.names[class_id]
            if(confidence> confidenceThreshold ) :
                predicted_classes.append({"class" :predicted_class,"perc" : confidence})

    return predicted_classes

# Read image path from JSON file
with open('input.json', 'r') as file:
    data = json.load(file)
    img_path = data['image_path']

# Perform prediction
predicted_classes = perform_prediction(img_path)

# Write predicted classes to JSON file
with open('output.json', 'w') as file:
    json.dump({'predicted_classes': predicted_classes}, file)
