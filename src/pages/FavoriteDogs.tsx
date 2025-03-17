import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Dog } from "../utils/API";
import Auth from "../utils/auth";

const FavoriteDogs = () => {
  const [loading, setLoading] = useState(true);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await Auth.loggedIn();
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
  }, []);

  const generateMatch = async () => {
    try {
      setLoading(true);
      setError("");

      // Get favorited dog IDs from localStorage
      const favoriteIds = JSON.parse(
        localStorage.getItem("favoriteDogs") || "[]"
      );

      if (!favoriteIds || favoriteIds.length === 0) {
        setError("You haven't favorited any dogs yet!");
        setLoading(false);
        return;
      }

      // Generate a match from favorites
      const matchResponse = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(favoriteIds),
        }
      );

      if (!matchResponse.ok) {
        throw new Error("Failed to generate match");
      }

      const matchResult: { match: string } = await matchResponse.json();

      // Get the matched dog's details
      const dogResponse = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([matchResult.match]),
        }
      );

      if (!dogResponse.ok) {
        throw new Error("Failed to fetch matched dog details");
      }

      const [matchedDogData] = await dogResponse.json();
      setMatchedDog(matchedDogData);
    } catch (error) {
      console.error("Error generating match:", error);
      setError("Failed to generate match. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      generateMatch();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <h2>Please login to view your match.</h2>;
  }

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-primary p-5">
        <Container>
          <h1>Your Perfect Match!</h1>
        </Container>
      </div>
      <Container>
        {error && <div className="alert alert-danger">{error}</div>}

        {matchedDog ? (
          <div className="text-center">
            <h2 className="pt-5">Meet your perfect match!</h2>
            <Row className="justify-content-center">
              <Col md="6">
                <Card border="dark">
                  {matchedDog.img && (
                    <Card.Img
                      src={matchedDog.img}
                      alt={`${matchedDog.name}`}
                      variant="top"
                    />
                  )}
                  <Card.Body>
                    <Card.Title>
                      <h3>{matchedDog.name}</h3>
                    </Card.Title>
                    <Card.Text>
                      <span className="d-block mb-2">
                        <strong>Breed:</strong> {matchedDog.breed}
                      </span>
                      <span className="d-block mb-2">
                        <strong>Age:</strong> {matchedDog.age}
                      </span>
                      <span className="d-block">
                        <strong>Location:</strong> {matchedDog.zip_code}
                      </span>
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={generateMatch}
                      className="mt-3"
                    >
                      Generate New Match
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="text-center pt-5">
            <h2>No match generated yet!</h2>
            <p>Make sure you've favorited some dogs first.</p>
            <Button variant="primary" onClick={generateMatch} className="mt-3">
              Generate Match
            </Button>
          </div>
        )}
      </Container>
    </>
  );
};

export default FavoriteDogs;
