import requests
import json
import csv
import pprint 
import random

pp = pprint.PrettyPrinter(indent=4)

from sentence_transformers import SentenceTransformer

import sys
sys.path.append('../utils')
from local_creds import *

request_url = f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/{KEYSPACE_NAME}/{COLLECTION_NAME}"
request_headers = { 'x-cassandra-token': app_token,  'Content-Type': 'application/json'}

def load_csv_file(filename):
    result = []
    with open(filename, newline='\n') as temp_csvfile:
        temp_reader = csv.DictReader(temp_csvfile)
        for row in temp_reader:
                result.append(row)

    return result

def embed(text_to_embed):
    model_name = "intfloat/multilingual-e5-small"
    model = SentenceTransformer(model_name)
    embedding = list(model.encode(text_to_embed))
    return [float(component) for component in embedding]

def main():
    search_terms_file = "search_terms"
    with open(search_terms_file) as file:
        search_term_lines = file.readlines()
    for line in search_term_lines:
        print("----------------------------------------------")
        print("search_terms", line)

        # search for product data vector
        to_embed_product_string = json.dumps(line)
        embedded_product = embed(to_embed_product_string)

        payload = json.dumps({
        "find": {
            "sort": {
              "$vector": embedded_product
            },
            "options": {
              "limit": 10
            }
        }})

        print("top 10 when searching using search terms embedding vector:")
        print("===================")
        response = requests.request("POST", request_url, headers=request_headers, data=payload)
        response_dict = json.loads(response.text)
        for d in response_dict['data']['documents']:
            print(d["product_name"])
        print("nextPageState", response_dict['data']['nextPageState'])
        print("----------------------------------------------")



if __name__ == "__main__":
    main()
