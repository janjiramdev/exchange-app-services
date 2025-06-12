# exchange-app-services-nest

## Description

This project create for exchange app services with NestJS and TypeScript

## Prerequisite

- Node v20.x.x or later
- Docker (MongoDB v8.0)
- Use repository directory as terminal to run command and project

## Project setup

- Setup database

```bash
$ docker-compose up -d
```

- Config env follow up .env.example
- Install NodeJS dependencies

```bash
$ npm install
```

- Seeding mockup data for initial test
- Mockup data store in `/src/seeders/mockups`

```bash
$ npm run seed
```

## Compile and run the project

```bash
$ npm run start:dev
```

## Features

- ### System

  - Request [GET] /system/health-check => Get system current status

- ### Auth

  - Request [POST] /auth/signup => Signup user
  - Request [POST] /auth/signin => Signin to system
  - Request [POST] /auth/signout => Signout of system
  - Request [POST] /auth/refresh => Refresh authentication tokens

- ### Users

  - Request [GET] /users/profile => Get authenticated user

- ### Balance

  - Request [POST] /balance => Update user system cash USD and THB

- ### Coins

  - Request [POST] /coins => Create coin

- ### Pockets

  - Request [POST] /pockets => Create user coin pocket
  - Request [PATCH] /pockets => Update user coin pocket

- ### Sales

  - Request [POST] /sales => Create coin sale offer
  - Request [PATCH] /sales => Update coin sale offer
  - Request [PATCH] /sales => Buy coin sale offer

- ### Transfer

  - Request [POST] /transfers => Transfer user coin

## Author

- CodeOwner - Janjira Mosamai

## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE)
