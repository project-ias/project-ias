import csv
import json

data = {}
data["pyqs"] = []

with open('mains2020GS3.csv') as f:
    csv_reader = csv.reader(f)
    for row in csv_reader:
        q = row[0]
        topics = []
        topics_raw = row[1].split(',')
        for topic in topics_raw:
            if len(topic) != 0:
                topics.append(topic.rstrip().rstrip('.').rstrip(';'))
        print(q)
        print(topics)
        data["pyqs"].append({
             "question": q,
              "year": '2020',
              "topics": topics,
              "exam": 'GS3'
        })
        print("=====")

with open('mains2020GS3.json', 'w') as f:
    json.dump(data, f)

