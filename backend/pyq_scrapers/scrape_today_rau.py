import requests

r = requests.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=PL7Nkpcu_k2VJC4Wwk4WDXAbtNTOEmGI_8&key=AIzaSyBJABsfWJY0oO52lcEHHlfYOTbLPLYDteg')
description = r.json()['items'][0]['snippet']['description']
video_id = r.json()['items'][0]['snippet']['resourceId']['videoId']

def get_seconds(minutes_str, seconds_str):
    minutes_int = int(minutes_str)
    seconds_int = int(seconds_str)

    return minutes_int*60 + seconds_int

def remove_time_stamp(title_with_time_stamp):
    characters = [c for c in title_with_time_stamp]
    sentence_length = len(characters)
    for i in range(sentence_length):
        if characters[i] == '(' and characters[i+1].isnumeric() and characters[i+2].isnumeric():
            break
    # print(characters[i], characters[i+1], characters[i+2], characters[i+3], characters[i+4], characters[i+5],characters[i+6])

    minutes_str = characters[i+1]+ characters[i+2]
    seconds_str = characters[i+4] +  characters[i+5]

    seconds_for_timestamp = get_seconds(minutes_str, seconds_str)
    
    for _ in range(7):
        del characters[i]

    title_without_time_stamp = ''.join(characters)
    return title_without_time_stamp, seconds_for_timestamp


array_of_lines = description.split('\n')
len_of_lines = len(array_of_lines)
index = 0

# get the index from where the heading of DNS starts
for i in range(len_of_lines):
    if "TODAY’S THE HINDU ANALYSIS" in array_of_lines[i]:
        index = i+1
        break

# till one encounteres a empty string
while len(array_of_lines[index]) != 0:
    heading_with_title, seconds_for_time_stamp = remove_time_stamp(array_of_lines[index].split('.')[1].lstrip())
    link = 'https://youtube.com/watch?v={}&t={}'.format(video_id,seconds_for_time_stamp)
    print(heading_with_title)
    print(link)
    index = index + 1


