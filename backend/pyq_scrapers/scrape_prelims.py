import time
import json
from selenium import webdriver
from selenium.webdriver import ActionChains

data = {}
data["prelims"] = []


baseURL = "https://www.insightsonindia.com/2021/06/06/solve-upsc-previous-years-prelims-papers-2018/"
driver = webdriver.Chrome()
driver.get(baseURL)
time.sleep(15)


questions = driver.find_elements_by_class_name('wpProQuiz_question')
responses = driver.find_elements_by_class_name('wpProQuiz_response')

total_num = len(questions)

for i in range(total_num):
    ques = questions[i]
    response = responses[i]
    prev_q = ques.find_element_by_class_name('wpProQuiz_question_text').text
    options = []
    for opt in ques.find_element_by_class_name('wpProQuiz_questionList').find_elements_by_tag_name('li'):
        options.append(opt.text)
    
    right_ans = ques.find_element_by_class_name('wpProQuiz_answerCorrect').text
    explanation = response.find_element_by_class_name('wpProQuiz_incorrect').get_attribute('innerHTML')

    # add to json
    data["prelims"].append({
        'question': prev_q,
        'options': options,
        'answer': right_ans,
        'explanation': str(explanation)
    })
    print('--->',right_ans)
    # empty options
    options = []

with open('prelims2018.json', 'w') as f:
        json.dump(data, f)