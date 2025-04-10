import sys

from astrapy import DataAPIClient

from .local_creds import (
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_KEYSPACE,
)

astra_db_client = DataAPIClient()
database = astra_db_client.get_database(
    ASTRA_DB_API_ENDPOINT,
    token=ASTRA_DB_APPLICATION_TOKEN,
    keyspace=ASTRA_DB_KEYSPACE,
)
collection = database.get_collection(ASTRA_DB_COLLECTION)


def get_product(product_id):
    return collection.find_one(filter={"uniq_id": product_id})


def get_product_vector(product_id):
    return collection.find_one(
        filter={"uniq_id": product_id},
        projection={"$vector": True},
    )["$vector"]


def get_products(pagingState):
    return collection.find({}, limit=100).to_list()


def get_similar_products(originating_id, vector, count):
    similar_products = collection.find(
        sort={"$vector": vector},
        limit=count,
    )
    other_products = [
        row for row in similar_products if row["uniq_id"] != originating_id
    ]
    return other_products
