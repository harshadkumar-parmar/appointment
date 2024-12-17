# Doctor Appointment API

This project is a backend service for managing doctor appointments. It is built using NestJS, TypeORM, and Postgres.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js**
- **npm** 
- **PostgreSQL**

## Getting Started

To get a local copy up and running, follow these steps:

### Clone the Repository
```sh
git clone https://github.com/your-username/doctor-appointment.git
cd doctor-appointment
```

### Install Dependencies

```sh
npm install
```

### Configure Environment Variables
Create a .env file in the root directory of the project and add the following environment variables:

```sh
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
```

### Run the Application
Make sure your PostgreSQL server is running and then start the application:

```sh
npm run start:dev
```

### Testing
To run the tests, use the following command:
```sh
npm test
```

### Test Coverage
To generate a test coverage report, use the following command:
```sh
npm run test:cov
```

### API Documentation
The Swagger documentation for the API is available at the following URL:

[http://localhost:3000/api](http://localhost:3000/api)

