import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UserService } from './user.service';
import { RegisterRequest, LoginRequest } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Login user
   */
  async login(loginData: LoginRequest): Promise<{ token: string; user: any }> {
    const user = await this.userService.validateCredentials(loginData.email, loginData.password);
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user,
    };
  }

  /**
   * Register user
   */
  async register(userData: RegisterRequest): Promise<{ token: string; user: any }> {
    const user = await this.userService.createUser(userData);
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      user,
    };
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      {
        sub: userId,
        email,
        role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string; role: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        sub: string;
        email: string;
        role: string;
      };

      return {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      throw new createHttpError.Unauthorized('Invalid token');
    }
  }
} 