import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpCors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type Handler = (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult>;

/**
 * Middleware handler for Lambda functions
 * Automatically handles parsing JSON bodies, CORS, and error handling
 */
export const middyfy = (handler: Handler) => {
  return middy(handler)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler())
    .use(
      httpCors({
        origins: ['*'],
        credentials: true,
      })
    );
}; 