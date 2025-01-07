
# Doffaire REST API with Node using Typescript

This is a doffaire REST API developed using node and express with typescript

![alt text](https://image.ibb.co/nAd9OF/logos.png "Node Typescript")

## Requirements

[Node.js](https://nodejs.org/en/), [mongodb](https://www.mongodb.com/)

### Getting Started

### Run the app locally

- git clone https://github.com/Pallari/doffaire-rest-api.git

- `npm install`
- `npm start` - This will start the application and run on port 3000
- `npm run dev` - This will start the application in development mode
- `npm run watch & pm2 start ecosystem.config.js` to start the application with cluster for scalability

you can change port in `.env` file check `.env-sample`

## Folder Structure

```
src
└───index.ts          # Application entry point
└───routes            # Application routes / endpoints
└───controllers       # Express route controllers for all the endpoints of the app
└───repositories      # All the database interaction logic is here
└───db                # DB related files like connection / seed data
└───handlers          # Common logic
└───logs              # application logs
└───middlewares       # express middlewares
└───models            # DB Models (Postgress)
└───validators        # API Request object validations

```

## Features

- CRUD operations for Groomer
- CRUD operations for Veteran
- REST API Request object validations - Basic
- Error Logs
