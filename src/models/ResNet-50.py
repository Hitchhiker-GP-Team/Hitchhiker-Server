import os
import json
import torch
from torchvision import datasets, models, transforms
from PIL import Image
import matplotlib.pyplot as plt

# Define transforms for the images
test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Function to load and transform an image
def load_image(image_path, transform):
    image = Image.open(image_path).convert('RGB')
    image = transform(image).unsqueeze(0)  # Add batch dimension
    return image

# Function to predict the class of an image
def predict_image(model, image, device, class_names):
    model.eval()
    image = image.to(device)
    
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
    
    predicted_class = class_names[predicted.item()]
    return predicted_class

# Load class names
class_names = [
    'airport_terminal', 'aquarium', 'arcade', 'arena', 'art_gallery', 'bakery', 
    'basketball_court', 'bazaar', 'beach', 'bookstore', 'bowling_alley', 'boxing_ring', 
    'bus_station', 'church', 'clothing_store', 'desert', 'downtown', 'forest', 'fountain', 
    'golf_course', 'gymnasium', 'heliport', 'hotel', 'lake', 'mosque', 'mountain', 
    'movie_theater', 'museum', 'outing', 'racecourse', 'restaurant', 'shopping_mall', 
    'swimming_pool', 'volleyball_court'
]

# Set device to CPU
device = torch.device('cpu')

# Load the model
model = models.resnet50(pretrained=True)
num_classes = len(class_names)
model.fc = torch.nn.Sequential(
    torch.nn.Dropout(0.5),
    torch.nn.Linear(model.fc.in_features, num_classes)
)
model.load_state_dict(torch.load("C:/Users/zidan/Downloads/best_model.pth", map_location=device))  # Load saved weights
model = model.to(device)

input_json_path = 'input.json'
with open(input_json_path, 'r') as f:
    input_data = json.load(f)

# Get the image path from input data
image_path = input_data["image_path"]

# Load and predict the class for the image
image = load_image(image_path, test_transforms)
predicted_class = predict_image(model, image, device, class_names)

# Write output JSON file
output_json_path = 'output.json'
with open(output_json_path, 'w') as f:
    json.dump({"predicted_class": predicted_class}, f, indent=4)

print(f'Prediction saved to {output_json_path}')


# image = load_image("C:/Users/zidan/Downloads/pexels-asadphoto-457882.jpg", test_transforms)
# predicted_class = predict_image(model, image, device, class_names)
# print("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerreee: ",predicted_class)

# # Write output JSON file
# output_json_path = 'output.json'
# with open(output_json_path, 'w') as f:
#     json.dump(predicted_class, f, indent=4)

print(f'Predictions saved to {output_json_path}')