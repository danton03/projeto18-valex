# projeto18-valex
A Typescript designed project to manage benefit cards among companies and employees


<p align="center">
  <img  src="https://cdn.iconscout.com/icon/free/png-256/credit-card-2650080-2196542.png">
</p>
<h1 align="center">
  Valex
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<br/>

# Description

Valex simulates an API that manages a benefit card, generally made available by companies to their employees.

</br>

## Features

-   Get the card balance and transactions
-   Create cards
-   Activate / Block / Unlock a card
-   Recharge a card
-   Make card payments

</br>

## API Reference

### Get card balance

```http
GET /cards/:id
```

#### Request:

| Params      | Type      | Description           |
| :---------- | :-------- | :-------------------- |
| `id` | `integer` | **Required**. card ID |

#

### Create a card

```http
POST /cards
```

#### Request:

| Body         | Type     | Description                              |
| :------------| :------- | :--------------------------------------- |
| `employeeId` | `integer`| **Required**. user ID                    |
| `type`       | `string` | **Required**. type of card benefit       |

`Valid types: [groceries, restaurant, transport, education, health]`

####

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

</br>

#### Response:

```json
{
	"id": 7,
	"number": "1111111111111111",
	"cardholderName": "NAME N NAME",
	"cvc": "111",
	"expirationDate": "01/27",
	"type": "card type"
}
```
`"number" is formed by 16 numbers`

#

### Activate a card

```http
PATCH /cards
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `cardId`         | `integer`| **Required**. card Id              |
| `cvc`   | `string` | **Required**. card cvv             |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

`cvc max length: 3`

#

### Block a card

```http
PATCH /cards/block/:id
```

#### Request:

| Params      | Type      | Description           |
| :---------- | :-------- | :-------------------- |
| `id` | `integer` | **Required**. card ID |

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

#

### Unlock a card

```http
PATCH /cards/unblock/:id
```

#### Request:

| Params      | Type      | Description           |
| :---------- | :-------- | :-------------------- |
| `id` | `integer` | **Required**. card ID |

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

#

### Recharge a card

```http
POST /cards/recharge/:id
```

#### Request:

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

| Params      | Type      | Description           |
| :---------- | :-------- | :-------------------- |
| `id` | `integer` | **Required**. card ID |

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `amount`         | `integer` | **Required**. recharge amount      |

`"amount" must be at least 1`

#

### Card payments

```http
POST /cards/payment
```
#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `cardId`         | `integer` | **Required**. card Id              |
| `password`       | `string`  | **Required**. card password        |
| `businessId`     | `integer` | **Required**. card expiration date |
| `amount`         | `integer` | **Required**. payment amount       |

`"amount" must be at least 1`


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`PORT = number #recommended:5000`

`SECRET = any string`

</br>

## Run Locally

Clone the project

```bash (for SSH)
  git clone git@github.com:danton03/projeto18-valex.git
```

or

```bash (for HTTPS)
  git clone https://github.com/danton03/projeto18-valex.git
```

Go to the project directory

```bash
  cd projeto18-valex/
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  cd src/database/dbConfigs
```
```bash
  bash ./create-database
```
```bash
  cd ../../..
```

Start the server

```bash
  npm start
```

</br>

## Acknowledgements

-   [Awesome Badges](https://github.com/Envoy-VC/awesome-badges)

</br>

## Authors

-   Danton Matheus is a Full Stack Web Development student at Driven Education and engineering academic passionate about technology. 

<br/>

#
