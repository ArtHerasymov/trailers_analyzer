from Naked.toolshed.shell import execute_js


from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyser = SentimentIntensityAnalyzer()

def get_polarity_scores(comment):
    return analyser.polarity_scores(comment)["compound"]


def get_average_score(comment_list):
    if len(comment_list) != 0:
        average_score = 0.0
        for comment in comment_list:
            average_score += get_polarity_scores(comment)
    else:
        return 0
    return average_score/len(comment_list)



# def main():
#     success = execute_js('../test.js')
#     print(success)
#
#
#
# main()

