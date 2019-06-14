import csv


def write_csv(data):
    for row in data:
        with open('dataset.csv', 'a') as readFile:
            writer = csv.writer(readFile)
            writer.writerow(row)
    readFile.close()