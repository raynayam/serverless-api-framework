import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

// Initialize DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = `${process.env.SERVICE_NAME || 'serverless-api-framework'}-${
  process.env.STAGE || 'dev'
}-users`;

export class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const result = await dynamoDb
      .scan({
        TableName: USERS_TABLE,
      })
      .promise();

    // Remove password from user objects
    return (result.Items as User[]).map(({ password, ...rest }) => rest);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const result = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      throw new createHttpError.NotFound(`User with ID "${id}" not found`);
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = result.Item as User;
    return userWithoutPassword;
  }

  /**
   * Get user by email (for login)
   */
  async getUserByEmail(email: string): Promise<User> {
    const result = await dynamoDb
      .query({
        TableName: USERS_TABLE,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      })
      .promise();

    if (!result.Items || result.Items.length === 0) {
      throw new createHttpError.NotFound(`User with email "${email}" not found`);
    }

    return result.Items[0] as User;
  }

  /**
   * Create a new user
   */
  async createUser(user: CreateUserRequest): Promise<Omit<User, 'password'>> {
    // Check if user with the same email already exists
    try {
      await this.getUserByEmail(user.email);
      throw new createHttpError.Conflict(`User with email "${user.email}" already exists`);
    } catch (error) {
      // Only proceed if the error is NotFound (user doesn't exist)
      if (!(error instanceof createHttpError.NotFound)) {
        throw error;
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const timestamp = new Date().toISOString();
    const newUser: User = {
      id: uuid(),
      ...user,
      password: hashedPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDb
      .put({
        TableName: USERS_TABLE,
        Item: newUser,
      })
      .promise();

    // Remove password from user object
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: Partial<UpdateUserRequest>): Promise<Omit<User, 'password'>> {
    // Check if user exists
    await this.getUserById(id);

    // Remove id from update data (cannot update primary key)
    const { id: _, ...updateData } = userData;

    let updateExpression = 'set updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': new Date().toISOString(),
    };

    // Build update expression dynamically based on provided fields
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        // Handle password separately (hash it)
        if (key === 'password') {
          expressionAttributeValues[`:${key}`] = bcrypt.hashSync(value as string, 10);
        } else {
          expressionAttributeValues[`:${key}`] = value;
        }
        updateExpression += `, ${key} = :${key}`;
      }
    });

    await dynamoDb
      .update({
        TableName: USERS_TABLE,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return this.getUserById(id);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    await this.getUserById(id);

    await dynamoDb
      .delete({
        TableName: USERS_TABLE,
        Key: { id },
      })
      .promise();
  }

  /**
   * Validate user credentials
   */
  async validateCredentials(email: string, password: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.getUserByEmail(email);
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new createHttpError.Unauthorized('Invalid credentials');
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new createHttpError.Unauthorized('Invalid credentials');
    }
  }
} 