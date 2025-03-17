import { useState, useEffect, useCallback } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import Auth from "../utils/auth";
import type { Dog, Location, LocationSearchResponse } from "../utils/API";

const SearchDogs = () => {
  const [searchedDogs, setSearchedDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string>("");
  const [favoriteButtonStates, setFavoriteButtonStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [locationInput, setLocationInput] = useState<string>("");
  const [filteredZipCodes, setFilteredZipCodes] = useState<string[]>([]);
  const resultsPerPage = 25;

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await Auth.loggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
  }, []);

  // Fetch available breeds
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch breeds");
        const breedList = await response.json();
        setBreeds(breedList);
      } catch (error) {
        console.error("Error fetching breeds:", error);
        setError("Failed to fetch breeds. Please try again.");
      }
    };
  
    if (isLoggedIn) {
      fetchBreeds();
    }
  }, [isLoggedIn]);

  const handleSearch = useCallback(
    async (page: number = 0) => {
      if (!isLoggedIn) return;
  
      setLoading(true);
      setError("");
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("size", resultsPerPage.toString());
  
        if (selectedBreed) {
          searchParams.append("breeds", selectedBreed);
        }
  
        searchParams.append("sort", `breed:${sortDirection}`);
  
        if (page > 0) {
          searchParams.append("from", (page * resultsPerPage).toString());
        }
  
        if (filteredZipCodes.length > 0) {
          const limitedZipCodes = filteredZipCodes.slice(0, 100);
          limitedZipCodes.forEach((zip) => {
            searchParams.append("zipCodes", zip);
          });
          console.log(`Searching with ${limitedZipCodes.length} zip codes`);
        } else if (locationInput.trim()) {
          console.log("Location input present but no zip codes found");
          setSearchedDogs([]);
          setLoading(false);
          return;
        }
  
        const searchResponse = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search?${searchParams.toString()}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );
  
        if (!searchResponse.ok) {
          const errorText = await searchResponse.text();
          console.error("Search response error:", errorText);
          throw new Error(`Search failed: ${searchResponse.status} ${errorText}`);
        }
  
        const searchData = await searchResponse.json();
        setTotalResults(searchData.total);
  
        if (searchData.resultIds && searchData.resultIds.length > 0) {
          const dogsResponse = await fetch(
            "https://frontend-take-home-service.fetch.com/dogs",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(searchData.resultIds),
            }
          );
  
          if (!dogsResponse.ok) throw new Error("Failed to fetch dog details");
          const dogs = await dogsResponse.json();
          setSearchedDogs(dogs);
        } else {
          setSearchedDogs([]);
        }
      } catch (error) {
        console.error("Error searching dogs:", error);
        setError("Failed to search dogs. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      isLoggedIn,
      selectedBreed,
      sortDirection,
      filteredZipCodes,
      resultsPerPage,
      locationInput,
    ]
  );

  const handleLocationSearch = async (locationQuery: string) => {
    if (!locationQuery.trim()) {
      setFilteredZipCodes([]);
      return;
    }

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/locations/search",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: locationQuery,
            size: 10000, // Consider reducing this size
          }),
        }
      );

      if (!response.ok) throw new Error("Location search failed");
      const data = (await response.json()) as LocationSearchResponse;

      console.log(
        `Found ${data.results.length} locations for ${locationQuery}`
      );

      const zipCodes = data.results.map(
        (location: Location) => location.zip_code
      );

      if (zipCodes.length === 0) {
        console.log(`No zip codes found for ${locationQuery}`);
        setFilteredZipCodes([]);
      } else {
        setFilteredZipCodes(zipCodes);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setError("Failed to search locations. Please try again.");
      setFilteredZipCodes([]);
    }
  };

  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortDirection(event.target.value as "asc" | "desc");
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocationInput(value);
    handleLocationSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    handleSearch(newPage);
  };

  const handleFavoriteDog = async (dogId: string) => {
    if (!isLoggedIn) {
      return false;
    }

    try {
      // Get current favorites from localStorage
      const currentFavorites = JSON.parse(
        localStorage.getItem("favoriteDogs") || "[]"
      );

      // Toggle favorite status
      if (!currentFavorites.includes(dogId)) {
        // Add to favorites
        const newFavorites = [...currentFavorites, dogId];
        localStorage.setItem("favoriteDogs", JSON.stringify(newFavorites));
        setFavoriteButtonStates((prev) => ({
          ...prev,
          [dogId]: true,
        }));
      } else {
        // Remove from favorites
        const newFavorites = currentFavorites.filter(
          (id: string) => id !== dogId
        );
        localStorage.setItem("favoriteDogs", JSON.stringify(newFavorites));
        setFavoriteButtonStates((prev) => ({
          ...prev,
          [dogId]: false,
        }));
      }
    } catch (err) {
      console.error("Error favoriting dog:", err);
      alert("Failed to favorite this dog. Please try again.");
    }
  };

  // Initialize favorite button states
  useEffect(() => {
    if (isLoggedIn) {
      const currentFavorites = JSON.parse(
        localStorage.getItem("favoriteDogs") || "[]"
      );
      const initialButtonStates = currentFavorites.reduce(
        (acc: { [key: string]: boolean }, dogId: string) => {
          acc[dogId] = true;
          return acc;
        },
        {}
      );
      setFavoriteButtonStates(initialButtonStates);

      // Initial search
      handleSearch(0);
    }
  }, [isLoggedIn, handleSearch]); // Add handleSearch to dependency array

  if (!isLoggedIn) {
    return <h2>Please login to search dogs.</h2>;
  }

  return (
    <>
      <div className="text-light bg-primary p-5">
        <Container>
          <h1>Search for Dogs!</h1>
          <Row className="mt-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Breed</Form.Label>
                <Form.Select value={selectedBreed} onChange={handleBreedChange}>
                  <option value="">All Breeds</option>
                  {breeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Breed Sort Direction</Form.Label>
                <Form.Select value={sortDirection} onChange={handleSortChange}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city name"
                  value={locationInput}
                  onChange={handleLocationChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <h2>
              {searchedDogs.length
                ? `Viewing ${searchedDogs.length} of ${totalResults} results`
                : "No dogs found"}
            </h2>

            <Row>
              {searchedDogs.map((dog: Dog) => (
                <Col md="4" className="mb-4" key={dog.id}>
                  <Card border="info">
                    {dog.img && (
                      <Card.Img
                        src={dog.img}
                        alt={`Dog named ${dog.name}`}
                        variant="top"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{dog.name}</Card.Title>
                      <Card.Text>
                        <strong>Breed:</strong> {dog.breed}
                        <br />
                        <strong>Age:</strong> {dog.age}
                        <br />
                        <strong>Location:</strong> {dog.zip_code}
                      </Card.Text>
                      <Button
                        className={`btn-block ${
                          favoriteButtonStates[dog.id]
                            ? "btn-success"
                            : "btn-info"
                        }`}
                        onClick={() => handleFavoriteDog(dog.id)}
                      >
                        {favoriteButtonStates[dog.id]
                          ? "Favorited!"
                          : "Favorite This Dog"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {searchedDogs.length > 0 && (
              <div className="d-flex justify-content-center mt-4 mb-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="me-2"
                >
                  Previous
                </Button>
                <span className="mx-3 align-self-center">
                  Page {currentPage + 1} of{" "}
                  {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage >= Math.ceil(totalResults / resultsPerPage) - 1
                  }
                  className="ms-2"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default SearchDogs;
