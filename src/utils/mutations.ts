import { gql } from '@apollo/client';

export const LoginUser = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;


export const AddUser = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const FavoriteDog = gql`
  mutation favoriteDog($dogData: DogInput!) {
    favoriteDog(dogData: $dogData) {
      _id
      username
      email
      favoriteDog {
        id
        img
        name
        age
        zip_code
        breed
      }
    }
  }
`;

export const RemoveDog = gql`
  mutation removeDog($dogId: ID!) {
    removeDog(dogId: $dogId) {
      _id
      username
      email
      favoriteDog {
        id
        img
        name
        age
        zip_code
        breed
      }
    }
  }
`;