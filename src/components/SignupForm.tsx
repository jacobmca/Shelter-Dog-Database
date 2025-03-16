// SignupForm.tsx
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Auth from '../utils/auth';

// Rename interface to avoid conflict with built-in FormData
interface SignupFormData {
  username: string;
  email: string;
}

interface SignupFormProps {
  handleModalClose: () => void;
}

const SignupForm = ({ handleModalClose }: SignupFormProps) => {
  
  const [userFormData, setUserFormData] = useState<SignupFormData>({
    username: "",
    email: "",
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate Form
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
  
    try {
      const success = await Auth.login(userFormData.username, userFormData.email);
      
      if (success) {
        // Clear form
        setUserFormData({
          username: "",
          email: "",
        });
        setValidated(false);
  
        // Close modal
        handleModalClose();
        
        // Refresh page to update UI
        window.location.reload();
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error("Error:", err);
      setShowAlert(true);
      setErrorMessage(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          {errorMessage || 'Something went wrong with your signup!'}
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(userFormData.username && userFormData.email)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
