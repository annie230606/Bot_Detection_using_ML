import urllib.request
import json

url = "http://127.0.0.1:5000/predict"
data = {
    "retweet_count": 1,
    "mention_count": 1,
    "follower_count": 1,
    "verified": True,
    "tweet_length": 10,
    "hashtag_count": 1,
    "has_location": False
}
req = urllib.request.Request(url, json.dumps(data).encode(), {"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as res:
        print(res.read().decode())
except urllib.error.HTTPError as e:
    print(f"Error {e.code}: {e.read().decode()}")
