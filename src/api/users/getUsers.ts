import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { UserService } from '../../services/user.service';

/**
 * Get all users handler
 */
const getUsers = async (event: APIGatewayProxyEvent) => {
  try {
    const userService = new UserService();
    const users = await userService.getAllUsers();

    return formatJSONResponse({
      success: true,
      data: users,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

// Export the handler with middleware
export const handler = middyfy(getUsers); 