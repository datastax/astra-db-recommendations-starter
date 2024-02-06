import json
import csv
import pprint

pp = pprint.PrettyPrinter(indent=4)

from sentence_transformers import SentenceTransformer
from astrapy.db import AstraDBCollection
import sys

sys.path.append("utils")
sys.path.append("api")
from local_creds import *


def load_csv_file(filename):
    result = []
    with open(filename, newline="\n") as temp_csvfile:
        temp_reader = csv.DictReader(temp_csvfile)
        for row in temp_reader:
            result.append(row)

    return result


def embed(text_to_embed):
    model_name = "intfloat/multilingual-e5-small"
    model = SentenceTransformer(model_name)
    embedding = list(model.encode(text_to_embed))
    return [float(component) for component in embedding]


def main(collection):
    search_terms_file = "test_queries/search_terms"
    with open(search_terms_file) as file:
        search_term_lines = file.readlines()
    for line in search_term_lines:
        print("----------------------------------------------")
        print("search_terms", line)

        # search for product data vector
        to_embed_product_string = json.dumps(line)
        embedded_product = embed(to_embed_product_string)
        payload = collection.vector_find(
            embedded_product,
            limit=10,
        )
        print("top 10 when searching using search terms embedding vector:")
        print("===================")
        print(payload)
        print("----------------------------------------------")


if __name__ == "__main__":
    collection = AstraDBCollection(
        collection_name="recommendations",
        token=ASTRA_DB_APPLICATION_TOKEN,
        api_endpoint=ASTRA_DB_API_ENDPOINT,
    )
    main(collection=collection)
