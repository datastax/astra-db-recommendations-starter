from astrapy.db import AstraDB, AstraDBCollection

import sys

sys.path.append("api")
from local_creds import *

astra_db = AstraDB(
    token=ASTRA_DB_APPLICATION_TOKEN,
    api_endpoint=f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com",
    namespace=ASTRA_DB_NAMESPACE,
)
collection = AstraDBCollection(collection_name="recommendations", astra_db=astra_db)


def get_product(product_id):
    response = collection.find_one(filter={"uniq_id": product_id})
    return response["data"]["document"]


def get_product_vector(product_id):
    return get_product(product_id)["$vector"]


def get_products(pagingState):
    generator = collection.paginated_find(prefetched=20)
    return [i for i in generator]


def get_similar_products(vector, count):
    product_list = collection.vector_find(vector=vector, limit=count)
    provided_vector_removed_product_list = [
        row for row in product_list if row["$vector"] != vector
    ]
    remove_vector_field = lambda a_dict: {
        key: a_dict[key] for key in a_dict if key != "$vector"
    }
    return [remove_vector_field(row) for row in provided_vector_removed_product_list]
