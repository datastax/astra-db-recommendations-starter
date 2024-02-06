# Astra DB Recommendations Starter

## Environment Variables
Replace the `REPLACE_ME` values with your Astra DB and OpenAI credentials, then run the the following command:
```
export OPENAI_API_KEY=REPLACE_ME
export ASTRA_DB_API_ENDPOINT=REPLACE_ME
export ASTRA_DB_APPLICATION_TOKEN=REPLACE_ME
```
## Local Setup

To install backend dependencies, run the following command:

```
pip install -r requirements.txt
```

To install frontend dependencies, run the following command:

```
npm install
```

## Load Data

Load the DB into a collection named `recommendations`

```
python3 populate_db/load_data.py populate_db/product_data.csv
```

## Start Servers

To start the backend server, in a terminal tab run the following:

```
uvicorn api.index:app --reload
```

To start the frontend, in a new terminal run the following:

```
npm run dev
```

## Quick deploy to Vercel

Clone & deploy this app to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/datastax/astra-db-recommendations-starter)