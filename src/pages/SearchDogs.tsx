import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import Auth from "../utils/auth";
import { searchFetchDogs } from "../utils/API";
import type { Dog } from "../utils/API";

const SearchDogs = () => {
  const [searchedDogs, setSearchedDogs] = useState<Dog[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await Auth.loggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const dogData = await searchFetchDogs({
        query: searchInput
      });
      setSearchedDogs(dogData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteDog = async (dogId: string) => {
    if (!isLoggedIn) {
      return false;
    }
  
    try {
      const matchResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify([dogId]) // API expects an array of dog IDs
      });
  
      if (!matchResponse.ok) {
        throw new Error(`Failed to match with dog: ${matchResponse.status}`);
      }
  
      const result = await matchResponse.json();
      if (result.match) {
        console.log('Favorited this dog!');
        alert('Favorited this dog!');
      }
  
    } catch (err) {
      console.error('Error matching with dog:', err);
      alert('Failed to match with this dog. Please try again.');
    }
  };
  
  
  
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Dogs!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a dog"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedDogs.length
            ? `Viewing ${searchedDogs.length} results:`
            : "Search for a dog to begin"}
        </h2>
        <Row>
          {searchedDogs.map((dog: Dog) => {
            return (
              <Col md="4" key={dog.id}>
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
                      Breed: {dog.breed}
                      <br />
                      Age: {dog.age}
                      <br />
                      Location: {dog.zip_code}
                    </Card.Text>
                    {isLoggedIn && (
                      <Button
                        className="btn-block btn-info"
                        onClick={() => handleFavoriteDog(dog.id)}
                      >
                        Favorite this dog!
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchDogs;