interface SearchParams {
  query?: string;
  name?: string;
  age?: number;
  zip_code?: string;
  breed?: string;
}

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface Location {
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

interface LOGIN_USER {
  id: string;
  username: string;
  email: string;
}

export const searchFetchDogs = async (params: SearchParams): Promise<Dog[]> => {
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