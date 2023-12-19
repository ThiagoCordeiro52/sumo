import yfinance as yf
from pydantic import BaseModel
from typing import Any
from scrapper import StatisticsResponse, getEPS, getStatisticsInfo
from scrapper import getGrowth

lynchValuationDict = {
    1 : 'Fairly Valued',
    2 : 'Under Valued',
    3 : 'Very Under Valued'
}

#Establish the relation between lynch valuation and graham intrisic value and recommends
#a safety margin based on the share value.
sumoValuationDict = {
    'Fairly Valued' : 0.56,
    'Under Valued' : 0.65,
    'Very Under Valued' : 0.69
}

class Response(BaseModel):
    df: list[dict[str, Any]]
    date: str

class SumoResume(BaseModel):
    statistics : StatisticsResponse
    graham: float | None
    graham_revised: float | None
    lynch_number: float | None
    lynch_result: str | None
    bazin: float | None
    sumo_result: str

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
    lynch_number = lynchCalculator(
                    earnings_growth_rate=growth_rate, 
                    dividend_yield=(statistics.fw_dividend_yield[:-1]),
                    eps=float(statistics.eps),
                    share_value=float(statistics.actual_value)
                )
    bazin = bazinCalculator(five_years_dividend_yield=statistics.five_years_dividend_yield_avg)
    return SumoResume(
        statistics=statistics,
        graham=graham,
        graham_revised=graham_revised,
        lynch_number=lynch_number,
        lynch_result=lynchValuation(lynch_number=lynch_number),
        bazin=bazin,
        sumo_result=sumoValuation(
            lynch_number=lynch_number, 
            lynch_result=lynchValuation(lynch_number=lynch_number),
            graham_price=graham,
            actual_price=float(statistics.actual_value)
            )
    )

def grahamCalculator(EPS: float, g: float, Y:float = 4.22, revised: bool = False) -> float | None:
    BPE = 7 if revised else 8.5
    C_g = 1.5 if revised else 2
    try:
        result = ((EPS * (BPE + (C_g * g)) * 4.4 ) / Y)
        return round(result, 2)
    except Exception:
        return None
    
def lynchCalculator(earnings_growth_rate : float | None, dividend_yield : str | None, eps : float | None, share_value : float | None) -> float | None:
    try:
        dividend_yield_float = float(dividend_yield)
        pe_ratio = share_value / eps
        result = ((earnings_growth_rate + dividend_yield_float) / pe_ratio)
        return round(result, 2)
    except Exception:
        return None
    
def lynchValuation(lynch_number : float | None) -> str:
        
        if not lynch_number:
            return "Unavailable" 
        
        if lynch_number and lynch_number < 1:
            return "Overvalued"
        
        minor_diff = 99999
        int_key = 0

        for i in range (1, 4): 
            if abs(lynch_number - i) < minor_diff:
                minor_diff = abs(lynch_number - i)
                int_key = i
    
        return lynchValuationDict[int_key]

def bazinCalculator(five_years_dividend_yield : str | None):
    try:
        dividend_avg = float(five_years_dividend_yield)
        result = dividend_avg / 0.06
        return round(result,2)
    except Exception:
        return None

def sumoValuation(lynch_number : float | None, lynch_result : str, graham_price : float | None, actual_price : float) -> str:
    if ( (not lynch_number) or (not graham_price) or lynch_result == "Unavailable"):
        return "Unavailable"
    
    if(lynch_result == "Overvalued"):
        return "VENDA"
    
    safety_margin = sumoValuationDict[lynch_result]
    actual_margin = actual_price / graham_price
    
    return f"COMPRE" if (actual_margin < safety_margin) else f"VENDA%"

    