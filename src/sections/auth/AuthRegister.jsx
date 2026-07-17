import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { confirmPasswordSchema, emailSchema, firstNameSchema, lastNameSchema, passwordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';

// ==============================|| AUTH REGISTER FORM ||============================== //

export default function AuthRegisterForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm();

  const password = watch("password");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    // ✅ Check if passwords match
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match!"
      });
      return;
    }

    clearErrors("confirmPassword");

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date().toISOString()
      });

      toast.success("Registration Successful! Please login.");
      reset();
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email already in use"
        });
        toast.error("Email already in use");
      } else if (error.code === "auth/weak-password") {
        setError("password", {
          type: "manual",
          message: "Password is too weak"
        });
        toast.error("Password is too weak");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard className="mb-0">
      <div className="text-center">
        <a>
          <Image src={DarkLogo} alt="img" />
        </a>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Sign up</h4>
        
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                {...register('firstName', firstNameSchema)}
                isInvalid={!!errors.firstName}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                style={{
                  borderColor: errors.firstName ? '#dc3545' : '',
                  boxShadow: errors.firstName ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : ''
                }}
              />
              <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                {...register('lastName', lastNameSchema)}
                isInvalid={!!errors.lastName}
                className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                style={{
                  borderColor: errors.lastName ? '#dc3545' : '',
                  boxShadow: errors.lastName ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : ''
                }}
              />
              <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            style={{
              borderColor: errors.email ? '#dc3545' : '',
              boxShadow: errors.email ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : ''
            }}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', passwordSchema)}
              isInvalid={!!errors.password}
              className={className && 'bg-transparent border-white text-white border-opacity-25 '}
              style={{
                borderColor: errors.password ? '#dc3545' : '',
                boxShadow: errors.password ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : ''
              }}
            />
            <Button onClick={togglePasswordVisibility}>
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              ...confirmPasswordSchema,
              validate: value => value === password || "Passwords do not match"
            })}
            isInvalid={!!errors.confirmPassword}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
            style={{
              borderColor: errors.confirmPassword ? '#dc3545' : '',
              boxShadow: errors.confirmPassword ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : ''
            }}
          />
          <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" className="mt-1 justify-content-between">
          <Form.Group controlId="customCheckc1">
            <Form.Check
              type="checkbox"
              label="I agree to all the Terms & Condition"
              defaultChecked
              className={`input-primary ${className ? className : 'text-muted'} `}
            />
          </Form.Group>
        </Stack>

        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </div>

        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Already have an Account?</h6>
          <Link to={link} className="link-primary">
            Login
          </Link>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthRegisterForm.propTypes = { className: PropTypes.string, link: PropTypes.string };