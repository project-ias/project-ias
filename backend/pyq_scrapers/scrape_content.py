from bs4 import BeautifulSoup
import requests
import time
import json

data = {}
data["content"] = []

# {
# "date": "",
# "content": "",
# "link": "",
# "orginal_source": "",
# "tags": [],
# "exam" : "GS"
# }


link = "https://www.drishtiias.com/current-affairs-news-analysis-editorials/news-analysis/25-06-2021"
source = requests.get(link).text
soupObject = BeautifulSoup(source,'lxml')

headings = soupObject.find_all('h2')
for heading in headings:
    article_detail = heading.find_next('div', class_='article-detail')
    all_tags = heading.find_next('div', class_='tags-new')
    list_items = all_tags.find('ul').find_all('li')
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
                # print(a['href'])
                print()
        data["content"].append({
            'date': '',
            'content': str(article_detail),
            'link': heading.a['href'],
            'orginal_source': a['href'],
            'tags': tags,
            'exam': exam
        })

