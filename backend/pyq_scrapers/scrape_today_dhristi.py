from bs4 import BeautifulSoup
import requests
import time
from datetime import datetime, timedelta
import json

data = {}
data["content"] = []

# {
# "date": "",
# "content": "",
# "link": "",
# "orginal_source": "",
# "tags": [],
# "exam" : "GS",
# "title": ""
# }

date_to_be_scraped_obj = datetime.now()
date_to_be_scraped = date_to_be_scraped_obj.strftime("%Y-%m-%d")


link = "https://www.drishtiias.com/current-affairs-news-analysis-editorials/news-analysis/{}".format(date_to_be_scraped)
print("Working on ",link)
source = requests.get(link).text
soupObject = BeautifulSoup(source,'lxml')

    

headings = soupObject.find_all('h2')
for heading in headings:
    article_detail = heading.find_next('div', class_='article-detail')
    all_tags = heading.find_next('div', class_='tags-new')
    try:
        list_items = all_tags.find('ul').find_all('li')
    except:
        list_items = []
    tags = []
    exam = ''
    for list_item in list_items:
        tags.append(list_item.text)
        if 'GS' in list_item.text:
            exam = list_item.text
    print(len(tags))
    if article_detail != None:
        all_as = article_detail.find_all('a')
        for a in all_as:
            if "Source:" in a.text:
                data["content"].append({
                    'date': date_to_be_scraped,
                    'content': str(article_detail),
                    'link': heading.a['href'],
                    'orginal_source': a['href'],
                    'tags': tags,
                    'exam': exam,
                    'title': heading.a.text
                })
    print("len ",len(data["content"]))

with open('today_dhristi.json', 'w') as f:
        json.dump(data, f)