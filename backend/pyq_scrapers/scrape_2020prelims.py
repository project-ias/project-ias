# from bs4 import BeautifulSoup
# import requests
# import time
# import json

# data = {}
# data["pyqs"] = []


# with open('2020/2020.html','r') as htmlFile :
# 	soupObject = BeautifulSoup(htmlFile,'lxml')

# table = soupObject.find_all('table', {'class': 'table table-striped'})
# print(table[0])

import time
import json
from selenium import webdriver
from selenium.webdriver import ActionChains
import re

data = {}
data["prelims"] = []


mapping = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3
}
# change the 2019 -> 2020 to get 2020 prelims questions
baseURL = "file:///home/rka/0repos/neera/project-ias/backend/pyq_scrapers/2019/2019.html"
driver = webdriver.Chrome()
driver.get(baseURL)
time.sleep(3)

ques_table = driver.find_elements_by_class_name('table-responsive')[0]
rows = ques_table.find_elements_by_tag_name('tr')
print(len(rows))
for row in rows:
    columns = row.find_elements_by_tag_name('td')
    if len(columns) == 7: 
        print(len(columns))
        question = columns[1]
        answer = columns[3]
        explanation = columns[-2].get_attribute('innerHTML')


        question_content = question.find_elements_by_tag_name('p')
        
        options = [
            question_content[-4].text,
            question_content[-3].text,
            question_content[-2].text,
            question_content[-1].text
        ]
        
        
        data['prelims'].append({
            'question': question.text.split('(a)')[0],
            'options': options,
            'answer': options[mapping[answer.text[0]]],
            'explanation': str(explanation)
        })

        print("---------")
        # time.sleep(2)

with open('prelims2019.json', 'w') as f:
        json.dump(data, f)