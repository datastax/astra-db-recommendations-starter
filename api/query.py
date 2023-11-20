import requests
import json
from api.local_creds import *

request_url = f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/{ASTRA_DB_NAMESPACE}/recommendations"
request_headers = { 'x-cassandra-token': ASTRA_DB_APPLICATION_TOKEN,  'Content-Type': 'application/json'}

def generate_request_payload_find_by_id(product_id):
    query = {"findOne": {"filter": {"uniq_id": product_id}}}
    return json.dumps(query)

def get_product(product_id):
    response = requests.request("POST", request_url, headers=request_headers, data=generate_request_payload_find_by_id(product_id))
    return response.json()["data"]["document"]

def get_product_vector(product_id):
    return get_product(product_id)["$vector"]

def generate_request_payload_find_by_pagination(pagingState):
    query = {"find": {}}
    if pagingState != None:
        query["find"] = {"options": {"pagingState": pagingState}}
    return json.dumps(query)

def get_products(pagingState):
    response = requests.request("POST", request_url, headers=request_headers, data=generate_request_payload_find_by_pagination(pagingState))
    return response.json()["data"]

def generate_request_payload_vector_search(vector, count):
    query = {"find": {"sort" : {"$vector" : vector},"options" : {"limit" : count}}}
    return json.dumps(query)

def get_similar_products(vector, count):
    response = requests.request("POST", request_url, headers=request_headers, data=generate_request_payload_vector_search(vector, count))
    product_list = response.json()["data"]["documents"]
    provided_vector_removed_product_list = [row for row in product_list if row["$vector"]!=vector]
    remove_vector_field = lambda a_dict : {key: a_dict[key] for key in a_dict if key != "$vector"}
    return [remove_vector_field(row) for row in provided_vector_removed_product_list]
