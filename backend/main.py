from fastapi import FastAPI, HTTPException #i import FastAPI class from the fastapi package into the file
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv() # loads the env vars

app = FastAPI()
client = genai.Client(api_key=os.getenv("API_KEY")) # creates a stateless one-time client

origins = ["http://localhost:5173"] #only this host can communicate with me

app.add_middleware( # declaring the rules
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    code: str

@app.get("/")
def root():
    return {
        "Hi": "there"
    }

@app.post("/gen")
def query(prompt: Prompt):
    try:
        response = client.models.generate_content(
            model = "gemini-3.1-flash-lite-preview", contents=prompt.code
        )
        return {
            "response": response.text
        }
    except Exception as e:
            # 2. Print the REAL error to your Uvicorn terminal
            print(f"CRASH DETAILS: {str(e)}")
            
            # 3. Raise a controlled HTTP error so CORS headers are still sent
            raise HTTPException(status_code=500, detail=str(e))