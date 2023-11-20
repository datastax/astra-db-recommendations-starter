from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api.recommender_utils import *
from api.query import *

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    product_id: str
    count: int

class Search(BaseModel):
    query: str

@app.get("/api/product")
async def products(pagingState = None):
    return get_products(pagingState)

@app.get("/api/product/{product_id}")
async def product(product_id):
    return get_product(product_id)

@app.get("/api/product/{product_id}/recommended")
async def recommend_products(product_id, count = 4):
    return get_recommended_products(product_id,count)

@app.post("/api/search")
async def search(search: Search):
    return get_search_results(search.query, 20)
