import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "config/firebase";
import { useNavigate } from "react-router-dom";

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';

// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { emailSchema, passwordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';

// ==============================|| AUTH LOGIN FORM ||============================== //

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

      console.log("Auth object:", auth);
      console.log("Email:", data.email);
      console.log("Password length:", data.password.length);

      await signInWithEmailAndPassword(auth, data.email, data.password);

      toast.success("✅ Login Successful!");
      reset();
      navigate("/");

    } catch (error) {
      console.error("Full Error Object:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);

      if (error.code === "auth/user-not-found") {
        setError("email", { type: "manual", message: "No account found" });
        toast.error("❌ No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        setError("password", { type: "manual", message: "Incorrect password" });
        toast.error("❌ Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        setError("email", { type: "manual", message: "Invalid email" });
        toast.error("❌ Invalid email format");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("❌ Too many failed attempts");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("❌ Network error. Check connection.");
      } else if (error.code === "auth/configuration-not-found") {
        toast.error("❌ Firebase configuration error. Please check your config.");
      } else if (error.code === "auth/api-key-not-valid") {
        toast.error("❌ Invalid Firebase API key. Please check your config.");
      } else if (error.code === "auth/argument-error") {
        toast.error("❌ Invalid email format. Please check your email.");
      } else {
        toast.error(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("✅ Password reset email sent! Check your inbox.");
      setShowForgotModal(false);
      setResetEmail("");
    } catch (error) {
      console.error("Reset error:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("❌ No account found with this email");
      } else {
        toast.error(`❌ ${error.message}`);
      }
    } finally {
      setResetLoading(false);
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

          {/* EMAIL FIELD */}
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
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {/* PASSWORD FIELD */}
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
              <Button onClick={togglePasswordVisibility} variant="outline-secondary">
                {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
              </Button>
            </InputGroup>
            {errors.password && (
              <div className="text-danger small mt-1">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.password?.message}
              </div>
            )}
          </Form.Group>

          <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
            <Form.Group controlId="customCheckc1">
              <Form.Check
                type="checkbox"
                label="Remember me?"
                defaultChecked
                className={`input-primary ${className ? className : 'text-muted'} `}
              />
            </Form.Group>
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => setShowForgotModal(true)}
            >
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
            <Link to={link} className="link-primary">
              Create Account
            </Link>
          </Stack>
        </Form>
      </MainCard>

      {/* FORGOT PASSWORD MODAL */}
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