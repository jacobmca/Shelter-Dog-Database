import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';

interface LoginFormData {
  name: string;
  email: string;
}

interface LoginFormProps {
  handleModalClose: () => void;
}

const LoginForm = ({ handleModalClose }: LoginFormProps) => {
  const [userFormData, setUserFormData] = useState<LoginFormData>({ 
    name: '', 
    email: '' 
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
  
    try {
      await Auth.login(userFormData.name, userFormData.email);
      
      setUserFormData({
        name: '',
        email: '',
      });
      setValidated(false);
      handleModalClose();
      
      // Force a reload to update the auth state
      window.location.reload();
    } catch (err) {
      console.error('Login failed:', err);
      setShowAlert(true);
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong with your login!'
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
          variant='danger'
        >
          {errorMessage || 'Something went wrong with your login credentials!'}
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='name'>Name</Form.Label>
          <Form.Control
            type='text' // Changed to email type for better validation
            placeholder='Your name'
            name='name'
            onChange={handleInputChange}
            value={userFormData.name}
            required
          />
          <Form.Control.Feedback type='invalid'>
            Name is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>E-Mail</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>
            E-Mail is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.email)}
          type='submit'
          variant='success'
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;