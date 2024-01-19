import json
import csv
from langchain.embeddings import OpenAIEmbeddings
import sys

sys.path.append("api")
from local_creds import *
from astrapy.db import AstraDB
import time

embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)


def create_collection(api_endpoint, token, namespace, collection_name, vector_dimesion):
    astra_db = AstraDB(token=token, api_endpoint=api_endpoint, namespace=namespace)
    collection = astra_db.create_collection(
        collection_name=collection_name, dimension=vector_dimesion
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
    embedding = list(embeddings.embed_query(text_to_embed))
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
        embedded_product = embed(to_embed_string)
        to_insert = {key.lower().replace(" ", "_"): row[key] for key in row.keys()}
        to_insert["$vector"] = embedded_product
        response = collection.insert_one(to_insert)
        print("this is response", response)
        print(f"response: {response}, \t Count: {count}")
        count += 1
        time.sleep(1)


if __name__ == "__main__":
    collection = create_collection(
        api_endpoint=ASTRA_DB_API_ENDPOINT,
        token=ASTRA_DB_APPLICATION_TOKEN,
        namespace=ASTRA_DB_NAMESPACE,
        collection_name=ASTRA_DB_COLLECTION,
        vector_dimesion=VECTOR_DIMENSION,
    )
    filepath = sys.argv[1]
    main(collection=collection, filepath=filepath)
