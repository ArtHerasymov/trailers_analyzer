import pymongo
from semantics import get_average_score

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["movies"]

collection = db["movies"]
movies_array = list(collection.find())

resulting_dict = {}

for x in range(1, len(movies_array)):
    resulting_dict[movies_array[x]["revenue"]] = get_average_score(movies_array[x]["movie"]["comments"])
print(resulting_dict)



