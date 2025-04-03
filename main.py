import pandas as pd
import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
import rasterio
from sentinelhub import SHConfig, BBox, CRS, SentinelHubRequest, DataCollection, MimeType
from fastapi import FastAPI, UploadFile, File
import os
import requests
import numpy as np
import tensorflow as tf
import imageio
from fastapi import FastAPI, Query
import pandas as pd
import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
import imageio
import subprocess
from sentinelhub import (
    SHConfig, BBox, CRS, SentinelHubRequest, MimeType, bbox_to_dimensions, DataCollection
)
from sentinelhub import SHConfig, SentinelHubRequest, MimeType, CRS, BBox, bbox_to_dimensions, DataCollection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained models
model_rgb = tf.keras.models.load_model("RGB_CNN.h5", compile=False)
model_s2 = tf.keras.models.load_model("S2_CNN.h5", compile=False)
model_sar = tf.keras.models.load_model("SAR_CNN.h5", compile=False)

# Configure SentinelHub API (replace with your credentials)
config = SHConfig()
config.sh_client_id = "7a3098a7-bfcd-4bff-baa4-6104fef14169"
config.sh_client_secret = "bTOS03EAVbfImGlrGqHjMkstr9IJ0aQ1"
config.save()

model_rgb = tf.keras.models.load_model("/home/arshlaan/projext/codathon/RGB_CNN.h5", compile=False)
model_s2 = tf.keras.models.load_model("/home/arshlaan/projext/codathon/S2_CNN.h5", compile=False)
model_sar = tf.keras.models.load_model("/home/arshlaan/projext/codathon/SAR_CNN.h5", compile=False)

# Function to fetch Sentinel-2 image
def get_satellite_image(latitude: float, longitude: float, image_path: str = "satellite_image.png"):
    bbox = BBox([longitude - 0.01, latitude - 0.01, longitude + 0.01, latitude + 0.01], CRS.WGS84)
    resolution = 10  # 10m per pixel
    size = bbox_to_dimensions(bbox, resolution=resolution)

    request = SentinelHubRequest(
        evalscript="""
        function setup() {
            return { input: ["B04", "B03", "B02"], output: { bands: 3 } };
        }
        function evaluatePixel(sample) {
            return [sample.B04, sample.B03, sample.B02];
        }
        """,
        input_data=[SentinelHubRequest.input_data(DataCollection.SENTINEL2_L2A, maxcc=0.1, time_interval=("2024-01-01", "2024-12-31"))],
        responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
        bbox=bbox,
        size=size
    )

    image = request.get_data()[0]
    imageio.imwrite(image_path, image)
    return image_path

# Function to preprocess image
def preprocess_image(image_path: str):
    image = Image.open(image_path).convert("RGB")
    image_array = np.array(image)

    # Ensure 12 channels by padding with zeros
    if image_array.shape[-1] == 3:
        padding_channels = 12 - 3
        image_array = np.concatenate([image_array, np.zeros((image_array.shape[0], image_array.shape[1], padding_channels), dtype=image_array.dtype)], axis=-1)

    image_resized = cv2.resize(image_array, (256, 256))
    image_normalized = image_resized / 255.0
    tensor_image = tf.convert_to_tensor(image_normalized, dtype=tf.float32)
    tensor_image = tf.expand_dims(tensor_image, axis=0)

    return {
        "rgb": tensor_image[..., :3],
        "s2": tensor_image,
        "sar": tensor_image[..., :2]
    }

# Prediction function
def get_flood_probability(tensor_image_rgb, tensor_image_s2, tensor_image_sar):
    pred_rgb = model_rgb.predict(tensor_image_rgb)
    pred_s2 = model_s2.predict(tensor_image_s2)
    pred_sar = model_sar.predict(tensor_image_sar)

    avg_pred = np.mean([pred_rgb, pred_s2, pred_sar], axis=0)

    prob_no_flood = avg_pred[0][0] * 100
    prob_flood = avg_pred[0][1] * 100

    return {
        "probability_no_flood": round(prob_no_flood, 2),
        "probability_flood": round(prob_flood, 2),
        "prediction": "Flooding is likely" if prob_flood > prob_no_flood else "No flooding detected"
    }

# API Endpoint
@app.get("/predict_flood")
def predict_flood():
    flood_locations = []
    df = pd.read_csv("/home/arshlaan/projext/codathon/flood-risk-in-india/flood_risk_dataset_india.csv")
    df_sorted = df.sort_values(by="Rainfall (mm)", ascending=False)

    # Load models
    model_rgb = tf.keras.models.load_model("/home/arshlaan/projext/codathon/RGB_CNN.h5", compile=False)
    model_s2  = tf.keras.models.load_model("/home/arshlaan/projext/codathon/S2_CNN.h5", compile=False)
    model_sar = tf.keras.models.load_model("/home/arshlaan/projext/codathon/SAR_CNN.h5", compile=False)

    for _, row in df_sorted.head(2).iterrows():  # Limit to 5 iterations
        latitude = row["Latitude"]
        longitude = row["Longitude"]

        bbox = BBox([longitude - 0.01, latitude - 0.01, longitude + 0.01, latitude + 0.01], CRS.WGS84)
        resolution = 2
        size = bbox_to_dimensions(bbox, resolution=resolution)

        request = SentinelHubRequest(
            evalscript="""
            function setup() {
                return { input: ["B04", "B03", "B02"], output: { bands: 3 } };
            }
            function evaluatePixel(sample) {
                return [sample.B04, sample.B03, sample.B02];
            }
            """,
            input_data=[SentinelHubRequest.input_data(DataCollection.SENTINEL2_L2A, maxcc=0.1, time_interval=("2024-01-01", "2024-12-31"))],
            responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
            bbox=bbox,
            size=size
        )

        image = request.get_data()[0]

        # Preprocess Image
        image = Image.fromarray(image).convert('RGB')
        image_array = np.array(image)
        padding_channels = 12 - 3
        image_array = np.concatenate([image_array, np.zeros((image_array.shape[0], image_array.shape[1], padding_channels), dtype=image_array.dtype)], axis=-1)
        image_resized = cv2.resize(image_array, (256, 256))
        image_normalized = image_resized / 255.0
        tensor_image = tf.expand_dims(tf.convert_to_tensor(image_normalized, dtype=tf.float32), axis=0)

        # Prepare inputs
        tensor_image_rgb = tensor_image[..., :3]
        tensor_image_s2 = tensor_image
        tensor_image_sar = tensor_image[..., :2]

        # Get Predictions
        pred_rgb = model_rgb.predict(tensor_image_rgb)
        pred_s2  = model_s2.predict(tensor_image_s2)
        pred_sar = model_sar.predict(tensor_image_sar)

        avg_pred = np.mean([pred_rgb, pred_s2, pred_sar], axis=0)
        prob_flood = avg_pred[0] * 100  # Convert to percentage
        print(pred_rgb)
        print(pred_s2)
        print(pred_s2)
        # If probability of flooding is more than 70%, store location
        if prob_flood[0] > 0.60:
            flood_locations.append({"latitude": latitude, "longitude": longitude})
            result = subprocess.run(
            ["python", "/home/arshlaan/projext/codathon/alert.py"],  # Command to execute
            capture_output=True,  # Capture stdout and stderr
            text=True  # Return output as a string
            )

    return {"flood_risk_locations": flood_locations}



USGS_API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

@app.get("/latest-earthquake/")
async def latest_earthquake():
    response = requests.get(USGS_API_URL)
    data = response.json()

    if "features" in data and len(data["features"]) > 0:
        latest_quake = data["features"][0]  # Get the most recent earthquake
        coords = latest_quake["geometry"]["coordinates"]
        longitude, latitude, depth = coords  # USGS provides [longitude, latitude, depth]

        return {
            "latitude": latitude,
            "longitude": longitude,
            "depth": depth,
            "magnitude": latest_quake["properties"]["mag"],
            "place": latest_quake["properties"]["place"],
            "time": latest_quake["properties"]["time"]
        }

    return {"error": "No earthquake data available"}

model = tf.keras.models.load_model("wildfire.h5")
class_names = ["nofire", "fire"]

def preprocess_image(img_path):
    image = cv2.imread(img_path)
    image = cv2.resize(image, (32, 32))
    image = np.array(image, dtype=np.float32) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

def predict_image(img_path):
    image = preprocess_image(img_path)
    predictions = model.predict(image)
    predicted_class = np.argmax(predictions)
    confidence = np.max(predictions) * 100
    return {"prediction": class_names[predicted_class], "confidence": f"{confidence:.2f}%"}

@app.get("/predict")
async def predict(file: UploadFile = File(...)):
    file_location = f"temp_image.png"
    with open(file_location, "wb") as buffer:
        buffer.write(file.file.read())
    result = predict_image(file_location)
    return result

def download_satellite_image():
    config = SHConfig()
    # config.sh_client_id = "your_client_id"
    # config.sh_client_secret = "your_client_secret"
    
    latitude, longitude = 28.108601, 96.509742
    bbox = BBox([longitude - 0.01, latitude - 0.01, longitude + 0.01, latitude + 0.01], CRS.WGS84)
    resolution = 2
    size = bbox_to_dimensions(bbox, resolution=resolution)
    
    request = SentinelHubRequest(
        evalscript="""
        function setup() {
            return {
                input: ["B04", "B03", "B02"],
                output: { bands: 3 }
            };
        }
        function evaluatePixel(sample) {
            return [sample.B04, sample.B03, sample.B02];
        }
        """,
        input_data=[SentinelHubRequest.input_data(DataCollection.SENTINEL2_L2A, maxcc=0.1, time_interval=("2024-01-01", "2024-12-31"))],
        responses=[SentinelHubRequest.output_response("default", MimeType.PNG)],
        bbox=bbox,
        size=size
    )
    image = request.get_data()[0]
    imageio.imwrite("satellite_image.png", image)
    return "satellite_image.png"

@app.get("/download_image")
def get_satellite_image():
    image_path = download_satellite_image()
    return {"message": "Image downloaded", "image_path": image_path}