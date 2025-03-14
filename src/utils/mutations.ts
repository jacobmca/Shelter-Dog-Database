import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
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


export const ADD_USER = gql`
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

export const FAVORITE_DOG = gql`
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

export const REMOVE_DOG = gql`
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