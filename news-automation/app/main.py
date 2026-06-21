from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import crud, models, database
from .database import engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Free News Automation API")

# Mount static files
app.mount("/public", StaticFiles(directory="public"), name="public")

@app.get("/")
def read_root():
    return {"message": "Welcome to the News Automation API", "endpoints": ["/news/ai", "/news/lifestyle", "/news/world"]}

@app.get("/news/ai")
def get_ai_news(db: Session = Depends(database.get_db)):
    return crud.get_articles_by_category(db, category="ai")

@app.get("/news/lifestyle")
def get_lifestyle_news(db: Session = Depends(database.get_db)):
    return crud.get_articles_by_category(db, category="lifestyle")

@app.get("/news/world")
def get_world_news(db: Session = Depends(database.get_db)):
    return crud.get_articles_by_category(db, category="world")
