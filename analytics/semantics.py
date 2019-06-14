from Naked.toolshed.shell import execute_js
import matplotlib.pyplot as plt


from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyser = SentimentIntensityAnalyzer()


def _get_polarity_scores(comment):
    return analyser.polarity_scores(comment)["compound"]


def _get_average_score(comment_list):
    if len(comment_list) != 0:
        average_score = 0.0
        for comment in comment_list:
            average_score += _get_polarity_scores(comment)
    else:
        return 0
    return average_score/len(comment_list)


def get_revenues_distribution(movies_array):
    xs = []
    ys = []
    for x in range(1, len(movies_array)):
        xs.append(movies_array[x]["revenue"])
        ys.append(_get_average_score(movies_array[x]["movie"]["comments"]))

    plt.hist(ys, normed=True, bins=20)
    plt.show()


def get_semantic_graphs(movies_array):
    xs = []
    ys = []
    for x in range(1, len(movies_array)):
        xs.append(movies_array[x]["revenue"])
        ys.append(_get_average_score(movies_array[x]["movie"]["comments"]))

    plt.plot(ys, xs, color='green', marker='o', linestyle='none')
    plt.show()
