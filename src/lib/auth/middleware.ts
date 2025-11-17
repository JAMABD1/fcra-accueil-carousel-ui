import { generateToken, verifyToken, extractTokenFromHeader, isTokenExpired } from './jwt';

export interface AuthUser {
  userId: string;
  email: string;
}

/**
 * Verify authentication from localStorage token
 */
export const verifyAuth = async (): Promise<AuthUser | null> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    if (isTokenExpired(token)) {
      // Token is expired, remove it
      localStorage.removeItem('auth_token');
      return null;
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
};

/**
 * Verify authentication from Authorization header (for API routes)
 */
export const verifyAuthFromHeader = async (authHeader: string | undefined): Promise<AuthUser | null> => {
  try {
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return null;
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    console.error('Auth verification from header error:', error);
    return null;
  }
};

/**
 * Require authentication (throw error if not authenticated)
 */
export const requireAuth = async (): Promise<AuthUser> => {
  const user = await verifyAuth();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Clear authentication token from localStorage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Re-export generateToken for convenience
export { generateToken };
