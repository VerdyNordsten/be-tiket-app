<br />
<p align="center">
<div align="center">
<img height="150" src="./documentation/logo.png" alt="BuroQ" border="0"/>
</div>
  <h3 align="center">Backend BuroQ</h3>
  <p align="center">
    <a href="https://github.com/VerdyNordsten/buroq_backend"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://buroq-backend.up.railway.app">View Demo</a>
    ·
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env example](#setup-env-example)
- [Rest Api](#rest-api)
- [Contributing](#contributing)
- [Related Project](#related-project)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

BuroQ is a website project that aims to provide a service for booking intercity or interregional flight tickets in Indonesia. The site offers various airline options and flight schedules that can be booked by users online.

One of the outstanding features of BuroQ is the ability to compare prices and flight schedules from different airlines in one display. This makes it easy for users to choose the best option according to their needs and budget.

To use this service, users only need to create an account and enter their travel details such as the city of origin, destination, date, and number of passengers. BuroQ will display a list of available flights, and users can choose the most suitable option for them.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- and other


<!-- GETTING STARTED -->


## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- [nodejs](https://nodejs.org/en/download/)


| Thrid Party     | npm install         |
| --------------- | ------------------- |
| [Express]       | npm i express       |
| [Nodemon]       | npm i nodemon       |
| [Morgan]        | npm i morgan        |
| [XSS-CLEAN]        | npm i xss-clean        |
| [PostgresSQL]   | npm i pg            |
| [Dotenv]        | npm i dotenv        |
| [CORS]          | npm i cors          |
| [Eslint]        | npm i eslint        |
| [jsonwebtoken]  | npm i jsonwebtoken  |
| [googleapis]    | npm i googleapis    |
| [passport]    | npm i passport    |
| [bcrypt]    | npm i bcrypt    |
| [cookie-session]    | npm i cookie-session    |
| [uuid]    | npm i uuid    |

[express]: http://expressjs.com
[nodemon]: https://www.npmjs.com/package/nodemon
[morgan]: https://www.npmjs.com/package/morgan
[XSS-CLEAN]: https://www.npmjs.com/package/xss-clean
[postgressql]: https://node-postgres.com
[dotenv]: https://www.npmjs.com/package/dotenv
[cors]: https://www.npmjs.com/package/cos
[eslint]: https://eslint.org/
[joi]: https://www.npmjs.com/package/joi
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[cookie-parser]: https://www.npmjs.com/package/cookie-parser
[googleapis]: https://www.npmjs.com/package/googleapis
[passport]: https://www.npmjs.com/package/passport
[bcrypt]: https://www.npmjs.com/package/bcrypt
[cookie-session]: https://www.npmjs.com/package/cookie-session
[uuid]: https://www.npmjs.com/package/uuid

### Requirements

Documentation files are provided in the [documentation](./documentation) folder

- [PostgreSQL database query](./query.sql)
- [Database diagram](./documentation/relational-table.jpg)

API endpoint list are also available as published postman documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/26297454/2s93XyUPAS#045eda52-1002-411b-b792-1b447a208b0a)

- [Node.js](https://nodejs.org/en/)
- [Postman](https://www.getpostman.com/) for testing

### Installation

- Clone This Back End Repo

```
git clone https://github.com/VerdyNordsten/buroq_backend.git
```

- Go To Folder Repo

```
cd buroq_backend
```

- Install Module

```
npm install
```

- <a href="#setup-env-example">Setup .env</a>
- Starting application

```
  <!-- Run App -->
  npm run dev
```

```
  <!-- Run Linter -->
  npm run lint
```

### Setup .env example

Create .env file in your root project folder.

```env
GOOGLE_DRIVE_TYPE
GOOGLE_DRIVE_PROJECT_ID
GOOGLE_DRIVE_PRIVATE_KEY_ID
GOOGLE_DRIVE_PRIVATE_KEY 
GOOGLE_DRIVE_CLIENT_EMAIL
GOOGLE_DRIVE_CLIENT_ID
GOOGLE_DRIVE_AUTH_URI 
GOOGLE_DRIVE_TOKEN_URI 
GOOGLE_DRIVE_AUTH_PROVIDER
GOOGLE_DRIVE_CLIENT_URL

GOOGLE_DRIVE_PHOTO_PATH=https://drive.google.com/uc?id=

# SSO
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URL

# Database (PostgreSQL)
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT
DB_USER

PORT
ORIGIN_DOMAIN

SECRET_KEY_JWT
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Related Project

:rocket: [`Backend BuroQ`](https://github.com/VerdyNordsten/buroq_backend)

:rocket: [`Frontend BuroQ`](https://github.com/VerdyNordsten/buroq_frontend)

:rocket: [`Demo BuroQ`](https://buroq.digty.co.id/)

## Meet The Team Members

<center>
  <table align="center">
    <tr >
      <th >Fullstack Developer / Project Manager</th>
      <th >Frontend Developer</th>
      <th >Frontend Developer</th>
      <th >Backend Developer</th>
      <th >Backend Developer</th>
    </tr>
    <tr >
      <td align="center">
        <a href="https://github.com/mhmdiamd">
          <img width="200"  src="./documentation/ilham.png" alt="Muhamad Ilham Darmawan"><br/>
          <b>Muhamad Ilham Darmawan</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Dhimasswara">
          <img width="200"  src="./documentation/dhimas.png" alt="Dhimas Pandu Yogaswara"><br/>
          <b>Dhimas Pandu Yogaswara</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Shaniara28">
          <img width="200"  src="./documentation/shania.png" alt="Shania Rizky Agustin"><br/>
          <b>Shania Rizky Agustin</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/VerdyNordsten">
          <img width="200"   src="./documentation/verdy.png" alt="Verdy Prido Lugara"><br/>
          <b>Verdy Prido Lugara</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/ikkair">
          <img width="200"  src="./documentation/kamal.png" alt="Ikhlasul Kamal Irmansyah"><br/>
          <b>Ikhlasul Kamal Irmansyah</b>
        </a>
      </td>
    </tr>
  </table>
</center>


Project Link: [https://github.com/VerdyNordsten/buroq_backend](https://github.com/VerdyNordsten/buroq_backend)

