from astrapy import DataAPIClient
from astrapy.constants import Environment

import sys


sys.path.append("api")
from local_creds import *

# defaults to Environment.PROD for Astra DB
db_env = Environment.PROD

if os.getenv("DB_ENV") != None:
    if os.environ["DB_ENV"] == "DSE":
        db_env = Environment.DSE;
    if os.environ["DB_ENV"] == "HCD":
        db_env = Environment.HCD;

client = DataAPIClient(token=ASTRA_DB_APPLICATION_TOKEN, environment=db_env)
astra_db = client.get_database(ASTRA_DB_API_ENDPOINT)
collection = astra_db.get_collection("recommendations")


def get_product(product_id):
    response = collection.find_one(filter={"uniq_id": product_id})
    return response


def get_product_vector(product_id):
    return get_product(product_id)["$vector"]


def get_products(pagingState):
    if pagingState is None:
        global res
        res = collection.find(limit=20)
    documents = []

    for doc in res:
        documents.append(doc)

    return documents


def get_similar_products(vector, count):
    product_list = collection.find(vector=vector, limit=count)
    provided_vector_removed_product_list = [
        row for row in product_list if row["$vector"] != vector
    ]
    remove_vector_field = lambda a_dict: {
        key: a_dict[key] for key in a_dict if key != "$vector"
    }
    return [remove_vector_field(row) for row in provided_vector_removed_product_list]
