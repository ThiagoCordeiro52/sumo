import yfinance as yf
from pydantic import BaseModel
from typing import Any
from scrapper import StatisticsResponse, getEPS, getStatisticsInfo
from scrapper import getGrowth

class Response(BaseModel):
    df: list[dict[str, Any]]
    date: str

class SumoResume(BaseModel):
    statistics : StatisticsResponse
    graham: float | None
    graham_revised: float | None
    lynch_number: str | None
    lynch_result: str | None

def getStockInfo(symbol : str) -> dict:
    stock_ticker = yf.Ticker(symbol)
    return stock_ticker.info

def getStockActions(symbol : str) -> dict:
    stock_ticker = yf.Ticker(symbol)
    return stock_ticker.actions


# Graham formula
#  (EPS * (8.5 + 2g) * 4.4) / Y
#  Using Y = 4.22 
def getStockGrahamFormula(symbol : str) -> float:
    EPS = float(getEPS(symbol=symbol))
    g = float(getGrowth(symbol=symbol))
    Y = 4.22
    return ((EPS * (8.5 + (2*g)) * 4.4 ) / Y)

# Graham revised formula
#  (EPS * (7 + 1g) * 4.4) / Y
#  Using Y = 4.22 
def getStockGrahamRevisedFormula(symbol : str) -> float:
    EPS = float(getEPS(symbol=symbol))
    g = float(getGrowth(symbol=symbol))
    Y = 4.22
    return ((EPS * (7 + g) * 4.4 ) / Y)

def getSumoResume(symbol : str) -> SumoResume:
    growth_rate = float(getGrowth(symbol=symbol))
    statistics = getStatisticsInfo(symbol=symbol)
    graham = grahamCalculator(EPS=float(statistics.eps), g=growth_rate)
    graham_revised = grahamCalculator(EPS=float(statistics.eps), g=growth_rate, revised=True)
    return SumoResume(
        statistics=statistics,
        graham=graham,
        graham_revised=graham_revised,
        lynch_number=None,
        lynch_result='Overvalued'
    )

def grahamCalculator(EPS: float, g: float, Y:float = 4.22, revised: bool = False) -> float | None:
    BPE = 7 if revised else 8.5
    C_g = 1.5 if revised else 2
    try:
        result = ((EPS * (BPE + (C_g * g)) * 4.4 ) / Y)
        return result
    except Exception:
        return None
    