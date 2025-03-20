import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse, formatErrorResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { AuthService } from '../../services/auth.service';
import { LoginSchema } from '../../models/user.model';

/**
 * Login handler
 */
const login = async (event: APIGatewayProxyEvent) => {
  try {
    const authService = new AuthService();
    
    // Validate request body against schema
    const loginData = LoginSchema.parse(event.body);
    
    // Attempt login
    const result = await authService.login(loginData);

    return formatJSONResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

// Export the handler with middleware
export const handler = middyfy(login); 