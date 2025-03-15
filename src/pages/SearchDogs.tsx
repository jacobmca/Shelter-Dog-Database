import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client";

import Auth from "../utils/auth";
import { FavoriteDog } from "../utils/mutations";
import { searchFetchDogs } from "../utils/API";
import { saveDogIds, getSavedDogIds } from "../utils/localStorage";

// Define interfaces for the dog data
interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

// Define interface for favorite dog data
interface FavoriteDogData {
  dogId: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const SearchDogs = () => {
  // Add type definitions to state
  const [searchedDogs, setSearchedDogs] = useState<Dog[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [favoriteDogIds, setFavoriteDogIds] = useState<string[]>(getSavedDogIds());
  
  const [favoriteDog] = useMutation<{ favoriteDog: FavoriteDogData }>(FavoriteDog);

  useEffect(() => {
    return () => saveDogIds(favoriteDogIds);
  }, [favoriteDogIds]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchFetchDogs({
        query: searchInput
      });

      const dogData = response.map((dog: Dog) => ({
        id: dog.id,
        img: dog.img,
        name: dog.name,
        age: dog.age,
        zip_code: dog.zip_code,
        breed: dog.breed
      }));

      setSearchedDogs(dogData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteDog = async (dogId: string) => {
    // Add type assertion to find method
    const dogToFavorite = searchedDogs.find((dog: Dog) => dog.id === dogId);
    
    if (!dogToFavorite) {
      return;
    }

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await favoriteDog({
        variables: { 
          dogData: {
            dogId: dogToFavorite.id,
            img: dogToFavorite.img,
            name: dogToFavorite.name,
            age: dogToFavorite.age,
            zip_code: dogToFavorite.zip_code,
            breed: dogToFavorite.breed
          }
        },
      });

      if (data) {
        setFavoriteDogIds([...favoriteDogIds, dogToFavorite.id]);
      }
    } catch (err) {
      console.error(err);
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
                      Breed: {dog.breed}<br/>
                      Age: {dog.age}<br/>
                      Location: {dog.zip_code}
                    </Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={favoriteDogIds?.some(
                          (savedId) => savedId === dog.id
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleFavoriteDog(dog.id)}
                      >
                        {favoriteDogIds?.some(
                          (savedId) => savedId === dog.id
                        )
                          ? "This dog has already been favorited!"
                          : "Favorite this dog!"}
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
