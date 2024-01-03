## Quick deploy to Vercel

You can clone & deploy it to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anant/astra-llm-recommendation-demo)

# Environment Variables

When you deploy with vercel, create envrionment variables via the Vercel UI. When deploying locally, create them using the terminal command 

```
export NAME=VALUE
```

- OPENAI_API_KEY=api key for OPENAI
- ASTRA_DB_ID=Astra database id
- ASTRA_DB_REGION=Astra database region
- ASTRA_DB_APPLICATION_TOKEN=Generate app token for Astra database
- ASTRA_DB_NAMESPACE=Existing Astra keyspace in a vector enables DB

# Local Setup

To install backend deps run the following command

```
pip install -r requirements.txt

```

To install frontend deps run the following command

```
npm install

```

# Load Data

Load the DB into a collection named `recommendations`

```
python3 populate_db/load_data.py populate_db/product_data.csv

```

# Start Servers

To start the backend server, in a terminal tab run the following

```
uvicorn api.index:app --reload
```

To start the frontend in a new terminal run the following

```
npm run dev
```
