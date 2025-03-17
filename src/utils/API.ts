export interface SignupFormData {
  username: string;
  email: string;
}

export interface SignupFormProps {
  handleModalClose: () => void;
}

export interface LoginUser {
  id: string;
  username: string;
  email: string;
}

export interface LoginCredentials {
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
  user?: LoginUser;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  token: string;
  user?: LoginUser;
  message?: string;
}

export interface SearchParams {
  query?: string;
  name?: string;
  age?: number;
  zip_code?: string;
  breed?: string;
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface LoginFormData {
  name: string;
  email: string;
}

export interface LoginFormProps {
  handleModalClose: () => void;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

interface Coordinates {
  lat: number;
  lon: number;
}

// Login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Logout
export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch(
      'https://frontend-take-home-service.fetch.com/auth/logout',
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// Sign Up
export const signupUser = async (credentials: SignupCredentials): Promise<SignupResponse> => {
  try {
    const response = await fetch('https://frontend-take-home-service.fetch.com/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Search
export const searchFetchDogs = async (params: SearchParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const searchResponse = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      throw new Error('Search failed');
    }

    const searchData = await searchResponse.json();
    const dogIds = searchData.resultIds;

    const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dogIds)
    });

    if (!dogsResponse.ok) {
      throw new Error('Failed to fetch dog details');
    }

    const dogsData = await dogsResponse.json();
    return dogsData;
  } catch (error) {
    console.error('Error in searchFetchDogs:', error);
    throw error;
  }
};

export const searchFetchLocations = async (params: Location): Promise<Dog[]> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Dog[];
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
};

export const searchFetchCoordinates = async (params: Coordinates): Promise<Dog[]> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Dog[];
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
};