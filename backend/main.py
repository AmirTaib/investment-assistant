from fastapi import FastAPI
from firestore import write_hello_message

app = FastAPI()

@app.get("/")
def root():
    return {"status": "OK"}

@app.post("/run")
def run_job():
    write_hello_message()
    return {"status": "written"}
