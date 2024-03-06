import json
import csv
from langchain.embeddings import OpenAIEmbeddings
import sys
import os

sys.path.append("api")
from local_creds import *
from astrapy.db import AstraDB
import time

embeddings = OpenAIEmbeddings(openai_api_key=os.environ["OPENAI_API_KEY"])


def create_collection(api_endpoint, token, collection_name, vector_dimension):
    astra_db = AstraDB(token=token, api_endpoint=api_endpoint, namespace="default_keyspace")
    collection = astra_db.create_collection(
        collection_name=collection_name,
        dimension=vector_dimension
    )
    return collection


def load_csv_file(filename):
    result = []
    with open(filename, newline="\n") as temp_csvfile:
        temp_reader = csv.DictReader(temp_csvfile)
        for row in temp_reader:
            result.append(row)

    return result


def embed(text_to_embed):
    embedding = embeddings.embed_query(text_to_embed)
    return [float(component) for component in embedding]


def main(collection, filepath):
    count = 0
    data_file = load_csv_file(filepath)
    for row in data_file:
        to_embed = {
            key.lower().replace(" ", "_"): row[key]
            for key in (
                "Product Name",
                "Brand Name",
                "Category",
                "Selling Price",
                "About Product",
                "Product Url",
            )
        }
        to_embed_string = json.dumps(to_embed)
        embedded_product = embed(json.dumps(to_embed_string))
        to_insert = {key.lower().replace(" ", "_"): row[key] for key in row.keys()}
        to_insert["$vector"] = embedded_product
        response = collection.insert_one(to_insert)
        count += 1


if __name__ == "__main__":
    collection = create_collection(
        api_endpoint=os.environ["ASTRA_DB_API_ENDPOINT"],
        token=os.environ["ASTRA_DB_APPLICATION_TOKEN"],
        collection_name="recommendations",
        vector_dimension=os.environ["VECTOR_DIMENSION"],
    )
    filepath = sys.argv[1]
    main(collection=collection, filepath=filepath)
