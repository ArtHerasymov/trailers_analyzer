import pymongo
from semantics import get_revenues_distribution, get_semantic_graphs
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import sys
from Naked.toolshed.shell import execute_js
from cloud_builder import build_word_cloud

client = pymongo.MongoClient("mongodb://localhost:40000/")
db = client["movies"]

collection = db["movies"]

def _load_data():
    return list(collection.find())


def load_interface():
    movies_array = _load_data()
    print('Youtube scraper 1.0 by Artem Herasymov\n')
    print('1. Form dataset')
    print('2. Build word cloud')
    print('3. Get revenues distribution')
    print('4. Get semantic graphs')
    key = int(input("Choose module to load : "))
    if key == 1:
        # success = execute_js('../test.js')
        print('Gathering data. It can take some time')
    elif key == 2:
        build_word_cloud(movies_array)
        load_interface()
    elif key == 3:
        get_revenues_distribution(movies_array)
        load_interface()
    elif key == 4:
        get_semantic_graphs(movies_array)
        load_interface()
    else:
        load_interface()


load_interface()





