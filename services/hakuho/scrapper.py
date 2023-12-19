from pydantic import BaseModel
import requests as req
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
}

BASE_URL = "https://finance.yahoo.com/quote"

class StatisticsResponse(BaseModel):
    name: str
    actual_value: str
    eps: str | None
    price_sales: str | None
    trailing_pe: str | None
    enterprise_value: str | None
    beta5: str | None
    ta_dividend_yield: str | None


def getGrowth(symbol) -> str:    
    page = req.get(f'{BASE_URL}/{symbol}/analysis?p={symbol}', headers=HEADERS)
    soup = BeautifulSoup(page.text, 'html.parser')
    return soup.find('span', string='Next 5 Years (per annum)').find_parent().find_next_sibling().get_text()[:-1]


def getEPS(symbol) -> str:    
    page = req.get(f'{BASE_URL}/{symbol}/key-statistics?p={symbol}', headers=HEADERS)
    soup = BeautifulSoup(page.text, 'html.parser')
    return soup.find('span', string='Diluted EPS').find_parent().find_next_sibling().get_text()

def getStatisticsInfo(symbol) -> StatisticsResponse:
    page = req.get(f'{BASE_URL}/{symbol}/key-statistics?p={symbol}', headers=HEADERS)
    soup = BeautifulSoup(page.text, 'html.parser')

    name = soup.find('h1').get_text()
    actual_value = soup.find('fin-streamer', {"data-symbol" : symbol}).get_text()

    eps = findStatisticPageSpanInfo(page=soup, string='Diluted EPS')
    price_sales = findStatisticPageSpanInfo(page=soup, string='Price/Sales')
    trailing_pe = findStatisticPageSpanInfo(page=soup, string='Trailing P/E')
    enterprise_value = findStatisticPageSpanInfo(page=soup, string='Enterprise Value')
    beta5 = findStatisticPageSpanInfo(page=soup, string='Beta (5Y Monthly)')
    ta_dividend_yield = findStatisticPageSpanInfo(page=soup, string='Trailing Annual Dividend Yield')

    return StatisticsResponse(
        name=name,
        actual_value=actual_value,
        eps=eps,
        price_sales=price_sales,
        trailing_pe=trailing_pe,
        enterprise_value=enterprise_value,
        beta5=beta5,
        ta_dividend_yield=ta_dividend_yield
    )

def findStatisticPageSpanInfo(page : BeautifulSoup, string : str) -> str | None:
    try:
        return page.find('span', string=string).find_parent().find_next_sibling().get_text()
    except Exception as e:
        print(f'[INFO]: An exception occurr trying to acess the value of {string}')
        print(e)
        return None
