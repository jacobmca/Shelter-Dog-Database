import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import Auth from "../utils/auth";
import type { Dog } from "../utils/API";

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
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch breeds');
        const breedList = await response.json();
        setBreeds(breedList);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        setError("Failed to fetch breeds. Please try again.");
      }
    };

    if (isLoggedIn) {
      fetchBreeds();
    }
  }, [isLoggedIn]);

  const handleSearch = async (page = 0) => {
    setLoading(true);
    setError("");
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      if (selectedBreed) {
        params.append('breeds', selectedBreed);
      }
      params.append('sort', `breed:${sortDirection}`);
      params.append('size', resultsPerPage.toString());
      if (page > 0) {
        params.append('from', (page * resultsPerPage).toString());
      }

      // First get search results (IDs)
      const searchResponse = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${params}`,
        {
          credentials: 'include'
        }
      );

      if (!searchResponse.ok) throw new Error('Search failed');
      const searchData = await searchResponse.json();
      setTotalResults(searchData.total);

      // Then get the actual dog data
      if (searchData.resultIds.length > 0) {
        const dogsResponse = await fetch(
          'https://frontend-take-home-service.fetch.com/dogs',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData.resultIds)
          }
        );

        if (!dogsResponse.ok) throw new Error('Failed to fetch dog details');
        const dogs = await dogsResponse.json();
        setSearchedDogs(dogs);
      } else {
        setSearchedDogs([]);
      }
    } catch (error) {
      console.error('Error searching dogs:', error);
      setError("Failed to search dogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBreed(event.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortDirection(event.target.value as "asc" | "desc");
    setCurrentPage(0);
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
      const currentFavorites = JSON.parse(localStorage.getItem('favoriteDogs') || '[]');
      
      // Add new favorite if it's not already there
      if (!currentFavorites.includes(dogId)) {
        const newFavorites = [...currentFavorites, dogId];
        localStorage.setItem('favoriteDogs', JSON.stringify(newFavorites));
      }

      alert('Successfully favorited dog!');

    } catch (err) {
      console.error('Error favoriting dog:', err);
      alert('Failed to favorite this dog. Please try again.');
    }
  };

  // Trigger search when filters change
  useEffect(() => {
    if (isLoggedIn) {
      handleSearch(currentPage);
    }
  }, [selectedBreed, sortDirection]);

  if (!isLoggedIn) {
    return <h2>Please log in to search dogs.</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Dogs!</h1>
          <Row className="mt-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Breed</Form.Label>
                <Form.Select
                  value={selectedBreed}
                  onChange={handleBreedChange}
                >
                  <option value="">All Breeds</option>
                  {breeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Sort Direction</Form.Label>
                <Form.Select
                  value={sortDirection}
                  onChange={handleSortChange}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
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
                  <Card border="dark">
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
                        <strong>Breed:</strong> {dog.breed}<br />
                        <strong>Age:</strong> {dog.age}<br />
                        <strong>Location:</strong> {dog.zip_code}
                      </Card.Text>
                      <Button
                        className="btn-block btn-info"
                        onClick={() => handleFavoriteDog(dog.id)}
                      >
                        Favorite this dog!
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
                  Page {currentPage + 1} of {Math.ceil(totalResults / resultsPerPage)}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalResults / resultsPerPage) - 1}
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
