import {
  UserSchema,
  CreateUserSchema,
  LoginSchema,
  RegisterSchema,
} from '../../src/models/user.model';

describe('User Model Schemas', () => {
  describe('UserSchema', () => {
    it('should validate a valid user', () => {
      const validUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject an invalid user', () => {
      const invalidUser = {
        id: 'not-a-uuid',
        email: 'not-an-email',
        firstName: '',
        lastName: '',
        password: 'pwd',
        role: 'unknown-role',
        createdAt: 'not-a-date',
        updatedAt: 'not-a-date',
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('CreateUserSchema', () => {
    it('should validate a valid create user request', () => {
      const validRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: 'user',
      };

      const result = CreateUserSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should not require an ID', () => {
      const validRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        role: 'user',
      };

      const result = CreateUserSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });
  });

  describe('LoginSchema', () => {
    it('should validate a valid login request', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = LoginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should reject an invalid login request', () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: '',
      };

      const result = LoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });

  describe('RegisterSchema', () => {
    it('should validate a valid registration request', () => {
      const validRegister = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = RegisterSchema.safeParse(validRegister);
      expect(result.success).toBe(true);
    });

    it('should reject an invalid registration request', () => {
      const invalidRegister = {
        email: 'not-an-email',
        password: 'pwd',
        firstName: '',
        lastName: '',
      };

      const result = RegisterSchema.safeParse(invalidRegister);
      expect(result.success).toBe(false);
    });
  });
}); 