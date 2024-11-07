from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from typing import List, Dict
import uvicorn
from predictive import MaintenancePredictor
import requests

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Aircraft Maintenance Predictor API")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = MaintenancePredictor('model.pkl')


class AircraftData(BaseModel):
    file_url: str


class FleetData(BaseModel):
    aircraft_id: str
    sensor_data: AircraftData


@app.post("/predict")
async def predict_maintenance(data: AircraftData):
    try:
        r = requests.get(data.file_url, stream=True)
        with open(f'downloads/{data.file_url[76:]}', 'wb') as f:
            for chunk in r.iter_content(chunk_size=16*1024):
                f.write(chunk)

        # Convert input data to numpy array
        input_data = model.load_input(f'downloads/{data.file_url[76:]}')

        # Make prediction
        prediction = model.predict(input_data)

        return {
            "prediction": prediction[0],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/fetch")
async def fetch(data: AircraftData):
    try:
        features = model.fetch_features(f'downloads/{data.file_url[76:]}')
        print(features)

        return {
            "features": features,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
