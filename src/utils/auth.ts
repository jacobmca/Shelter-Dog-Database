// use this to decode a token and get the user's information
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp: number;
    data?: {
        email: string;
        name: string;
    }
}

// create a new class to instantiate for a user
class AuthService {
  // get user data from token
  getProfile() {
    const token = this.getToken();
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken: string): void {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout(): void {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();