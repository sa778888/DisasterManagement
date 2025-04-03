import os
import cv2
import numpy as np
import tensorflow as tf
import imageio
from sentinelhub import SHConfig, SentinelHubRequest, MimeType, CRS, BBox, bbox_to_dimensions, DataCollection

# Set up Sentinel Hub API configuration
config = SHConfig()
config.sh_client_id = "7a3098a7-bfcd-4bff-baa4-6104fef14169"
config.sh_client_secret = "bTOS03EAVbfImGlrGqHjMkstr9IJ0aQ1"
config.save()

# Define coordinates for the area of interest (Modify as needed)
latitude = 28.108601
longitude = 96.509742

# Define bounding box (small area around given coordinates)
bbox = BBox([longitude - 0.01, latitude - 0.01, longitude + 0.01, latitude + 0.01], CRS.WGS84)
resolution = 10  # 10 meters per pixel
size = bbox_to_dimensions(bbox, resolution=resolution)

# Request Sentinel-2 imagery
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
    size=size,
    config=config
)

# Fetch image
image = request.get_data()[0]
image_path = "satellite_image.png"
imageio.imwrite(image_path, image)
print(f"Satellite image saved as {image_path}")

# Load trained landslide detection model
model_path = "landslide_model.h5"  # Path to your saved model
model = tf.keras.models.load_model(model_path)

def preprocess_image(img_path):
    """Preprocess image for model prediction."""
    image = cv2.imread(img_path)
    image = cv2.resize(image, (32, 32))  # Resize to match model input size
    image = image / 255.0  # Normalize
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

def predict_image(img_path):
    """Predict if the image contains a landslide."""
    image = preprocess_image(img_path)
    prediction = model.predict(image)[0][0]
    
    if prediction > 0.5:
        return f"Landslide detected with {prediction * 100:.2f}% confidence"
    else:
        return f"No landslide detected with {(1 - prediction) * 100:.2f}% confidence"

# Run prediction on the downloaded satellite image
result = predict_image(image_path)
print(result)