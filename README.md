# Serverless API Framework

A scalable serverless API architecture using AWS Lambda, API Gateway, and DynamoDB with automated deployment pipelines.

![API Architecture](docs/images/architecture.png)

## Features

- **Serverless Architecture**: Built on AWS Lambda, API Gateway, and DynamoDB
- **Automated CI/CD**: GitHub Actions workflow for testing and deployment
- **Authentication**: JWT-based authentication with user management
- **Data Validation**: Schema validation using Zod
- **TypeScript**: Type-safe development experience
- **Documentation**: OpenAPI documentation for all endpoints
- **Error Handling**: Centralized error handling
- **Local Development**: DynamoDB Local for offline development
- **Security**: IAM roles per function, CORS, and other security best practices
- **Monitoring**: CloudWatch integration for monitoring and logging

## Architecture

This project uses a modern serverless architecture:

- **API Gateway**: HTTP endpoint management, authentication, and authorization
- **Lambda Functions**: Business logic execution
- **DynamoDB**: NoSQL database for data persistence
- **CloudWatch**: Monitoring and logging
- **IAM**: Security and access control
- **CloudFormation**: Infrastructure as Code deployment

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/raynayam/serverless-api-framework.git
cd serverless-api-framework

# Install dependencies
npm install

# Install DynamoDB Local
npm run dynamodb:install
```

### Local Development

```bash
# Start DynamoDB Local
npm run dynamodb:start

# Start the API in offline mode
npm run start
```

This will start the API at `http://localhost:3000`.

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Deployment

```bash
# Deploy to dev stage
npm run deploy

# Deploy to production stage
npm run deploy:prod
```

## API Documentation

After deployment, Swagger documentation is available at:
- Dev: `https://{api-id}.execute-api.{region}.amazonaws.com/dev/api/docs`
- Prod: `https://{api-id}.execute-api.{region}.amazonaws.com/production/api/docs`

## Project Structure

```
serverless-api-framework/
├── .github/                  # GitHub Actions workflows
├── config/                   # Configuration files
├── docs/                     # Documentation
├── src/
│   ├── api/                  # API handlers
│   │   ├── auth/             # Authentication endpoints
│   │   ├── users/            # User management endpoints
│   │   └── products/         # Product management endpoints
│   ├── libs/                 # Shared libraries
│   ├── models/               # Data models and validation schemas
│   └── services/             # Business logic services
├── tests/                    # Tests
├── serverless.yml           # Serverless Framework configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Environment Variables

| Name | Description | Default |
|------|-------------|---------|
| `STAGE` | Deployment stage | `dev` |
| `REGION` | AWS region | `us-east-1` |
| `JWT_SECRET` | Secret key for JWT signing | `dev-secret-key` (dev only) |
| `JWT_EXPIRATION` | JWT expiration time | `1d` |

## Available Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products` - Create a new product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product

## Security

This project implements several security best practices:

- **API Gateway Authorizers**: JWT validation for protected routes
- **IAM Roles Per Function**: Least privilege principle
- **DynamoDB Encryption**: Server-side encryption for data at rest
- **Input Validation**: Schema validation for all inputs
- **CORS Configuration**: Secure cross-origin resource sharing
- **HTTP Security Headers**: Protection against common attacks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Serverless Framework](https://www.serverless.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://github.com/colinhacks/zod)
- [Middy](https://middy.js.org/) 
