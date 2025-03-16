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


export const searchFetchDogs = async (params: SearchParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add each parameter to the query string if it exists
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    // First get the dog IDs from search
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

    // Then get the actual dog data using the IDs
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
    return dogsData; // This will be an array of dog objects
  } catch (error) {
    console.error('Error in searchFetchDogs:', error);
    throw error;
  }
};

export const searchFetchLocations = async (params: Location): Promise<Dog[]> => {
  try {
    // Convert params object to URL search parameters
    const queryParams = new URLSearchParams();

    // Add each parameter to the query string if it exists
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
    // Convert params object to URL search parameters
    const queryParams = new URLSearchParams();

    // Add each parameter to the query string if it exists
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