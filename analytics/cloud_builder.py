from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import matplotlib.pyplot as plt


def _generate_holistic_text(movies_array):
    text = ''
    for x in range(1, len(movies_array)):
        comments_list = movies_array[x]["movie"]["comments"]
        for comment in comments_list:
            text += comment
    return text


def build_word_cloud(movies_array):
    text = _generate_holistic_text(movies_array)
    wordcloud = WordCloud().generate(text)
    ordcloud = WordCloud(max_font_size=40).generate(text)
    plt.figure()
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.show()
