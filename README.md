# Calorie Tracker application

## Setup guide

### Prerequisites

 - Node 14 > (recommended to install vie nvm)
 - docker
 - docker-compose

### Installation

The application consists of three components:
 - backend  - Apollo graphql server runnin on Node.js
 - frontend - React project bootstrapped with create react app
 - database - for local development, it's a postgresql DB running with docker-compose

### Database

In the project root:
```bash
docker-compose up
```

### Backend

```bash
cd backend
npm i
npm run prisma:generate
npm start
```

### Frontend

```bash
cd frontend
npm i
npm start
```

## Ports used by the application:

 - localhost:3001 - database
 - localhost:4000 - backend
 - localhost:3000 - frontend