from bs4 import BeautifulSoup
import requests
import time
import json

data = {}
data["pyqs"] = []

PYQ_links = ["https://mrunal.org/2020/05/download-upsc-mains-general-studies-paper-1-topicwise-2013-19.html","https://mrunal.org/2020/06/download-upsc-mains-general-studies-paper-2-topicwise.html", "https://mrunal.org/2020/06/download-upsc-mains-general-studies-paper-3-topicwise.html", "https://mrunal.org/2018/10/dl-upsc-csm18-gsm4.html"]
PYQ_Headings = ["GS1 Syllabus Topic","GS2 Syllabus Topic", "GS3 Syllabus Topic", "GSM4 Syllabus Topic"]
EXAM_TYPE = ["GS1", "GS2", "GS3", "GS4"]

for i in range(4):
    link = PYQ_links[i]
    heading = PYQ_Headings[i]
    exam = EXAM_TYPE[i]

    source = requests.get(link).text
    soupObject = BeautifulSoup(source,'lxml')
    paragraphs = soupObject.find_all('p')
    for paragraph in paragraphs:
        if heading in paragraph.text:
            topic = paragraph.text.split(':')[1]
            topics_arr = []    
            if topic == '':
                ul = paragraph.find_next('ul')
                topics = []
                list_items = ul.find_all('li')
                topics_arr = [list_item.text for list_item in list_items]
            else:
                topics_arr = [topic]
            
            next_table = paragraph.find_next('table')
            table_rows = next_table.find_all('tr')
            for table_row in table_rows:
                tds = table_row.find_all('td')
                if len(tds) != 0:
                    pyq = tds[0].text
                    year = tds[1].text
                    data["pyqs"].append({
                        "question": pyq,
                        "year": year,
                        "topics": topics_arr,
                        "exam": exam
                    })
            print(len(data["pyqs"]))    
    
    with open('pyqs.json', 'w') as f:
        json.dump(data, f)
