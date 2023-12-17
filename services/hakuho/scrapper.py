import requests as req
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
}

BASE_URL = "https://finance.yahoo.com/quote"



def getGrowth(symbol) -> str:    
    page = req.get(f'{BASE_URL}/{symbol}/analysis?p={symbol}', headers=HEADERS)
    soup = BeautifulSoup(page.text, 'html.parser')
    return soup.find('span', string='Next 5 Years (per annum)').find_parent().find_next_sibling().get_text()[:-1]


def getEPS(symbol) -> str:    
    page = req.get(f'{BASE_URL}/{symbol}/key-statistics?p={symbol}', headers=HEADERS)
    soup = BeautifulSoup(page.text, 'html.parser')
    return soup.find('span', string='Diluted EPS').find_parent().find_next_sibling().get_text()


