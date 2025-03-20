import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import createHttpError from 'http-errors';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.model';

// Initialize DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = `${process.env.SERVICE_NAME || 'serverless-api-framework'}-${
  process.env.STAGE || 'dev'
}-products`;

export class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    const result = await dynamoDb
      .scan({
        TableName: PRODUCTS_TABLE,
      })
      .promise();

    return result.Items as Product[];
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const result = await dynamoDb
      .get({
        TableName: PRODUCTS_TABLE,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      throw new createHttpError.NotFound(`Product with ID "${id}" not found`);
    }

    return result.Item as Product;
  }

  /**
   * Create a new product
   */
  async createProduct(product: CreateProductRequest): Promise<Product> {
    const timestamp = new Date().toISOString();
    const newProduct: Product = {
      id: uuid(),
      ...product,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDb
      .put({
        TableName: PRODUCTS_TABLE,
        Item: newProduct,
      })
      .promise();

    return newProduct;
  }

  /**
   * Update product
   */
  async updateProduct(id: string, productData: Partial<UpdateProductRequest>): Promise<Product> {
    // Check if product exists
    await this.getProductById(id);

    // Remove id from update data (cannot update primary key)
    const { id: _, ...updateData } = productData;

    let updateExpression = 'set updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': new Date().toISOString(),
    };

    // Build update expression dynamically based on provided fields
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        expressionAttributeValues[`:${key}`] = value;
        updateExpression += `, ${key} = :${key}`;
      }
    });

    const result = await dynamoDb
      .update({
        TableName: PRODUCTS_TABLE,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return result.Attributes as Product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    // Check if product exists
    await this.getProductById(id);

    await dynamoDb
      .delete({
        TableName: PRODUCTS_TABLE,
        Key: { id },
      })
      .promise();
  }
} 