import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "config/firebase";
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import MainCard from 'components/MainCard';
import { emailSchema, passwordSchema } from 'utils/validationSchema';
import DarkLogo from 'assets/images/logo-dark.svg';

export default function AuthLoginForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    clearErrors();
    try {
      setLoading(true);
      const email = data.email.trim();
      const password = data.password.trim();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Login Successful!");
      reset();
      navigate("/");
    } catch (error) {
      console.log("Firebase Error Code:", error.code);
      console.log("Firebase Error Message:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    alert("1");
    if (!resetEmail) {
      alert("2");
      return;
    }
    alert("3");
    try {
      alert("4");
      await sendPasswordResetEmail(auth, resetEmail);
      alert("5");
      toast.success("Password reset email sent!");
    } catch (error) {
      alert(error.code);
    }
  };
  return (
    <>
      <MainCard className="mb-0">
        <div className="text-center">
          <a>
            <Image src={DarkLogo} alt="img" />
          </a>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Login</h4>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Email Address"
              {...register("email", emailSchema)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", passwordSchema)}
                isInvalid={!!errors.password}
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="ti ti-eye" />
                ) : (
                  <i className="ti ti-eye-off" />
                )}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
            <Form.Group controlId="customCheckc1">
              <Form.Check type="checkbox" label="Remember me?" defaultChecked />
            </Form.Group>
            <Button variant="link" className="p-0 text-decoration-none" onClick={() => setShowForgotModal(true)}>
              Forgot Password?
            </Button>
          </Stack>
          <div className="text-center mt-4">
            <Button type="submit" className="shadow px-sm-4" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
            <h6 className={`f-w-500 mb-0 ${className}`}>Don't have an Account?</h6>
            <Link to={link} className="link-primary">Create Account</Link>
          </Stack>
        </Form>
      </MainCard>
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">Enter your email address and we'll send you a password reset link.</p>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="py-2"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleForgotPassword} disabled={resetLoading}>
            {resetLoading ? "Sending..." : "Send Reset Email"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
AuthLoginForm.propTypes = { className: PropTypes.string, link: PropTypes.string };