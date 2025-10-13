from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal
import pandas as pd
import pickle
from datetime import datetime

# Load trained LightGBM pipeline
with open("/Users/nakulmahajan/Desktop/sih-final2/voidframe-async/backend/src/models/predict-pipeline.pkl", "rb") as f:
    model_pipeline = pickle.load(f)

app = FastAPI(title="DPR LightGBM Classifier API")

# Input model for API
class DPRInput(BaseModel):
    State: str
    Sector: str
    Present_Status: Literal["Completed", "Ongoing", "Not Started", "Delayed"]
    Approved_Cost: float
    Total_Financial_Expenditure: float
    UC_Received: float
    Sanctioned_Date: str  # format: DD-MM-YYYY
    Scheduled_Completion_Date: str  # format: DD-MM-YYYY

@app.post("/predict")
def predict(data: DPRInput):
    # Convert input to DataFrame
    df = pd.DataFrame([data.dict()])

    # Standardize column names to match training data
    df.rename(columns={
        "Sanctioned_Date": "Sanctioned Date",
        "Scheduled_Completion_Date": "Scheduled Completion Date",
        "Present_Status": "Present Status",
        "Approved_Cost": "Approved Cost",
        "Total_Financial_Expenditure": "Total Financial Expenditure",
        "UC_Received": "U.C. Received"
    }, inplace=True)

    # Convert dates
    df["Sanctioned Date"] = pd.to_datetime(df["Sanctioned Date"], format="%d-%m-%Y")
    df["Scheduled Completion Date"] = pd.to_datetime(df["Scheduled Completion Date"], format="%d-%m-%Y")
    today = pd.Timestamp(datetime.now().date())

    # Compute derived numeric features
    df["Planned_Duration_days"] = (df["Scheduled Completion Date"] - df["Sanctioned Date"]).dt.days
    df["Elapsed_Days"] = (today - df["Sanctioned Date"]).dt.days
    df["Delay_Flag"] = ((today > df["Scheduled Completion Date"]) & (df["Present Status"] != "Completed")).astype(int)
    df["FUR"] = df["U.C. Received"] / df["Approved Cost"]
    df["EPR"] = df["Total Financial Expenditure"] / df["Approved Cost"]
    df["UCEG"] = abs(df["U.C. Received"] - df["Total Financial Expenditure"]) / df["Approved Cost"]
    df["SDR"] = (df["Elapsed_Days"] / df["Planned_Duration_days"]).clip(upper=10)

    # Ensure all columns expected by the pipeline exist
    pipeline_columns = model_pipeline.named_steps["preprocessor"].transformers_[0][2] + \
                       model_pipeline.named_steps["preprocessor"].transformers_[1][2]
    for col in pipeline_columns:
        if col not in df.columns:
            df[col] = 0  # fill missing columns with 0

    # Predict using the full pipeline
    pred_num = int(model_pipeline.predict(df)[0])

    # Map numeric prediction to label
    risk_mapping = {0: "Low", 1: "Medium", 2: "High"}
    pred_label = risk_mapping.get(pred_num, "Unknown")

    return {"prediction": pred_label}

@app.get("/")
def root():
    return {"message": "DPR LightGBM Classifier API running!"}



# Example JSON input for testing the API:
"""
{
  "State": "ARUNACHAL PRADESH",
  "Sector": "Transport and Communication",
  "Present_Status": "Completed",
  "Approved_Cost": 33.69,
  "Total_Financial_Expenditure": 32.8254,
  "UC_Received": 32.8254,
  "Sanctioned_Date": "24-03-2020",
  "Scheduled_Completion_Date": "24-01-2023"
}
"""
