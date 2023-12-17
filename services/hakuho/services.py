import yfinance as yf
from pydantic import BaseModel
from typing import Any
from scrapper import getEPS
from scrapper import getGrowth

class Response(BaseModel):
    df: list[dict[str, Any]]
    date: str


def getStockInfo(symbol : str) -> dict:
    stock_ticker = yf.Ticker(symbol)
    return stock_ticker.info

def getStockActions(symbol : str) -> dict:
    stock_ticker = yf.Ticker(symbol)
    return stock_ticker.actions


# Graham formula
#  (EPS * (8.5 + 2g) * 4.4) / Y
#  Using Y = 4.22 
def getStockGrahamFormula(symbol : str):
    EPS = float(getEPS(symbol=symbol))
    g = float(getGrowth(symbol=symbol))
    Y = 4.22
    return ((EPS * (8.5 + (2*g)) * 4.4 ) / Y)

# Graham revised formula
#  (EPS * (7 + 1g) * 4.4) / Y
#  Using Y = 4.22 
def getStockGrahamRevisedFormula(symbol : str):
    EPS = float(getEPS(symbol=symbol))
    g = float(getGrowth(symbol=symbol))
    Y = 4.22
    return ((EPS * (7 + g) * 4.4 ) / Y)