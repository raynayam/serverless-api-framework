# Getting Started with Serverless API Framework

This guide will help you get up and running with the Serverless API Framework locally and deploy it to AWS.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **AWS CLI** - [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Serverless Framework** - Install globally via npm: `npm install -g serverless`

## Setting Up AWS Credentials

1. Create an AWS account if you don't have one
2. Create an IAM user with programmatic access
3. Configure your AWS credentials:

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, default region (e.g., us-east-1), and output format (json).

## Installation

1. Clone this repository:

```bash
git clone https://github.com/your-username/serverless-api-framework.git
cd serverless-api-framework
```

2. Install dependencies:

```bash
npm install
```

3. Install DynamoDB Local:

```bash
npm run dynamodb:install
```

## Local Development

1. Start DynamoDB Local in one terminal:

```bash
npm run dynamodb:start
```

2. Start the Serverless Offline API in another terminal:

```bash
npm run start
```

This will start your API at `http://localhost:3000`.

## Testing Endpoints Locally

You can use tools like [Postman](https://www.postman.com/) or cURL to test your endpoints:

### Example: Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

The login response will include a JWT token you can use for authenticated endpoints.

### Example: Get all products (no auth required)

```bash
curl -X GET http://localhost:3000/api/v1/products
```

### Example: Create a product (auth required)

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Product 1",
    "description": "This is a test product",
    "price": 19.99,
    "category": "electronics"
  }'
```

## Running Tests

Run tests with Jest:

```bash
npm test
```

Run tests with coverage report:

```bash
npm run test:coverage
```

## Deployment

### Deploy to Development Stage

```bash
npm run deploy
```

### Deploy to Production Stage

```bash
npm run deploy:prod
```

After deployment, you'll see the endpoint URLs in the terminal output.

## Project Structure Explained

- `src/api/` - API handlers for each endpoint
- `src/models/` - Data models and validation schemas
- `src/services/` - Business logic and database operations
- `src/libs/` - Shared utilities and middleware
- `tests/` - Test files
- `serverless.yml` - Infrastructure as Code configuration

## Customization

1. Update `serverless.yml` with your service name
2. Update `package.json` with your project details
3. Add new endpoints by:
   - Creating handler functions in `src/api/`
   - Adding endpoint definitions in `serverless.yml`
   - Creating models in `src/models/`
   - Creating services in `src/services/`

## Need Help?

- Check the [Serverless Framework documentation](https://www.serverless.com/framework/docs/)
- Check the [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- Open an issue on the GitHub repository

Happy coding! 