
import time
import json
from selenium import webdriver
from selenium.webdriver import ActionChains
import re

data = {}
data["dns"] = []


def remove_time_stamp(title_with_time_stamp):
    characters = [c for c in title_with_time_stamp]
    sentence_length = len(characters)
    for i in range(sentence_length):
        if characters[i] == '(' and characters[i+1].isnumeric() and characters[i+2].isnumeric():
            break
    print(characters[i], characters[i+1], characters[i+2], characters[i+3], characters[i+4], characters[i+5],characters[i+6])

    for _ in range(7):
        del characters[i]

    title_without_time_stamp = ''.join(characters)
    return title_without_time_stamp

print(remove_time_stamp('Conclusive land titling and its challenges â€“ (Polity & Governance) â€“ (03:02) (Land Titling System in India)'))

baseURL  = "file:///home/rka/0repos/neera/project-ias/backend/pyq_scrapers/rau_july21.html"
driver = webdriver.Chrome()
driver.get(baseURL)
time.sleep(3)


all_ols = driver.find_elements_by_tag_name('ol')
for ol in all_ols:
    list_items = ol.find_elements_by_tag_name('li')
    for list_item in list_items:
        try:
            print(list_item.text)
            yt_link = list_item.find_element_by_tag_name('a').get_attribute('href')
            cleaned_title = remove_time_stamp(list_item.text)
        except  Exception as e:
            print('###########################',e)

        try:
            data['dns'].append(
                {
                    'title': cleaned_title,
                    'link': yt_link
                }
            )
        except Exception as e:
            print('---------------------------', list_item.text)
            print(e)



with open('rau_july21.json', 'w') as f:
        json.dump(data, f)


    
