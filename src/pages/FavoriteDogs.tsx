import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { Dog } from "../utils/API";
import { GET_ME } from "utils/queries";
import { RemoveDog } from "../utils/mutations";
import Auth from "../utils/auth";
import { removeDogId } from "../utils/localStorage";

interface UserData {
  me: {
    _id: string;
    username: string;
    email: string;
    savedDogs: Dog[];
  };
}

const FavoriteDogs = () => {
  const { loading, data } = useQuery<UserData>(GET_ME);
  // Add type guard to ensure savedDogs exists
  const savedDogs = data?.me?.savedDogs || [];

  const [removeDog] = useMutation(RemoveDog, {
    update(cache) {
      cache.modify({
        fields: {
          me(existingData) {
            return existingData;
          },
        },
      });
    },
  });

  const handleDeleteDog = async (dogId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeDog({
        variables: { dogId },
      });
      removeDogId(dogId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing favorite dogs!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {savedDogs.length
            ? `Viewing ${savedDogs.length} saved ${
                savedDogs.length === 1 ? "dog" : "dogs"
              }:`
            : "You have no favorited dogs! </3"}
        </h2>
        <Row>
          {savedDogs.map((dog: Dog) => (
            <Col key={dog.id} md="4">
              <Card border="dark">
                {dog.img ? (
                  <Card.Img src={dog.img} alt={`${dog.name}`} variant="top" />
                ) : null}
                <Card.Body>
                  <Card.Title>{dog.name}</Card.Title>
                  <br />
                  <Card.Text>
                    Breed: {dog.breed}
                    <br />
                    Age: {dog.age}
                    <br />
                    Location: {dog.zip_code}
                  </Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteDog(dog.id)}
                  >
                    Remove this dog
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default FavoriteDogs;
