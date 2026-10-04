from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
import joblib
import uvicorn
import os

# Initialize FastAPI app and Templates
app = FastAPI(title="Placement Predictor API")
templates = Jinja2Templates(directory="templates")

# Load the model and the saved columns from the 'model' directory
MODEL_PATH = "model/rf_model.pkl"
COLUMNS_PATH = "model/model_columns.pkl"

if os.path.exists(MODEL_PATH) and os.path.exists(COLUMNS_PATH):
    model = joblib.load(MODEL_PATH)
    training_columns = joblib.load(COLUMNS_PATH)
else:
    raise RuntimeError("Model files not found. Please run train_model.py first.")

# Define the expected data structure coming from the frontend
class StudentData(BaseModel):
    gender: str
    ssc_p: float
    ssc_b: str
    hsc_p: float
    hsc_b: str
    hsc_s: str
    degree_p: float
    degree_t: str
    workex: str
    etest_p: float
    specialisat: str
    mba_p: float

# Route 1: Serve the HTML page
@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(request=request, name="index.html", context={"request": request})

# Route 2: Handle the prediction logic
@app.post("/predict")
async def predict_placement(data: StudentData):
    # 1. Convert the incoming JSON payload into a pandas DataFrame (1 row)
    input_data = pd.DataFrame([data.dict()])
    
    # 2. Apply One-Hot Encoding just like we did in training
    input_encoded = pd.get_dummies(input_data)
    
    # 3. Align the columns with the training data
    # This step ensures missing dummy columns are added with 0s, and extra columns are ignored
    input_aligned = input_encoded.reindex(columns=training_columns, fill_value=0)
    
    # 4. Make the prediction
    prediction = model.predict(input_aligned)[0]
    
    # Return as JSON to the frontend JavaScript
    return {"prediction": int(prediction)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)