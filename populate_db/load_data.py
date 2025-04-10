import csv
import json
import os
import sys

from langchain_openai import OpenAIEmbeddings

from astrapy import DataAPIClient
from astrapy.info import CollectionDefinition

embeddings = OpenAIEmbeddings(openai_api_key=os.environ["OPENAI_API_KEY"])

EMBEDDING_CHUNK_SIZE = 80


def get_database():
    astra_db_client = DataAPIClient()
    database = astra_db_client.get_database(
        os.environ["ASTRA_DB_API_ENDPOINT"],
        token=os.environ["ASTRA_DB_APPLICATION_TOKEN"],
        keyspace=os.environ.get("ASTRA_DB_KEYSPACE"),
    )
    return database


def create_collection(database, collection_name, vector_dimension):
    collection = database.create_collection(
        collection_name,
        definition=(
            CollectionDefinition.builder()
            .set_vector_dimension(vector_dimension)
            .build()
        ),
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
    return embeddings.embed_query(text_to_embed)


def embed_list(texts_to_embed):
    return embeddings.embed_documents(texts_to_embed)


def main(collection, filepath):
    count = 0
    input_rows = load_csv_file(filepath)
    for chunk_start in range(0, len(input_rows), EMBEDDING_CHUNK_SIZE):
        chunk = input_rows[chunk_start : chunk_start + EMBEDDING_CHUNK_SIZE]
        to_embed_strings = [
            json.dumps(
                {
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
            )
            for row in chunk
        ]
        embedding_vectors = embed_list(to_embed_strings)
        documents_to_insert = []
        for row, embedding_vector in zip(chunk, embedding_vectors):
            document_to_insert = {
                "$vector": embedding_vector,
                **{key.lower().replace(" ", "_"): value for key, value in row.items()},
            }
            documents_to_insert.append(document_to_insert)
        insertion_result = collection.insert_many(documents_to_insert)
        count += len(insertion_result.inserted_ids)
    return count


if __name__ == "__main__":
    filepath = sys.argv[1]

    database = get_database()
    collection = create_collection(
        database,
        collection_name="recommendations",
        vector_dimension=os.environ["VECTOR_DIMENSION"],
    )

    total_inserted = main(collection=collection, filepath=filepath)
    print(f"Finished: inserted {total_inserted} products.")
