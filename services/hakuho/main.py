import yfinance as yf
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from services import getStockInfo, getSumoResume
from services import getStockActions
from services import getStockGrahamFormula
from services import getStockGrahamRevisedFormula

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/stocks/{symbol}/info")
async def root(symbol):
    return getStockInfo(symbol)

@app.get("/stocks/{symbol}/actions")
async def getActions(symbol):
    return getStockActions(symbol)

@app.get("/stocks/{symbol}/graham")
async def getGrahamValuation(symbol):
    return getStockGrahamFormula(symbol)

@app.get("/stocks/{symbol}/graham/revised")
async def getGrahamRevisedValuation(symbol):
    return getStockGrahamRevisedFormula(symbol)

@app.get("/stocks/{symbol}/sumo")
async def getSumoInfo(symbol):
    return getSumoResume(symbol)


if __name__ == "__main__":
   uvicorn.run("main:app", port=8004, reload=True)