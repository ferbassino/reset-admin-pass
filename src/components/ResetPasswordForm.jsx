import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importar íconos de ojo
import "./ResetPasswordForm.css"; // Importar el archivo CSS

const baseUrl = "https://kinapp-api.vercel.app/";
// const baseUrl = "http://192.168.0.89:3001/";

const FormComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [invalidUser, setInvalidUser] = useState("");
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación
  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}api/admin/verify-token?token=${token}&id=${id}`
      );
      if (!data.success) setInvalidUser(data.error);
      setBusy(false);
      console.log(data);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setInvalidUser(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError("Password must be between 8 and 20 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }

    try {
      setBusy(true);
      const { data } = await axios.post(
        `${baseUrl}api/admins/reset-password?token=${token}&id=${id}`,
        { password, id }
      );

      setBusy(false);
      if (data.success) {
        navigate("/reset-password");
        setSuccess(true);
      }
    } catch (error) {
      setBusy(false);
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) setError(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  if (success)
    return (
      <div className="container">
        <h1 className="header">Orkino</h1>
        <h1>Password reset successfully!</h1>
      </div>
    );

  if (invalidUser)
    return (
      <div className="container">
        <h1 className="header">Orkino</h1>
        <h1>{invalidUser}</h1>
      </div>
    );

  if (busy)
    return (
      <div className="container">
        <h1 className="header">Orkino</h1>
        <h1>Please wait, verifying reset token...</h1>
      </div>
    );

  return (
    <div className="container">
      <h1 className="header">Orkino</h1>
      <div className="content">
        <h3>Reset Password</h3>
        {error && <h3 className="error-message">{error}</h3>}
        <Form>
          <Form.Group className="form-group">
            <Form.Control
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="form-control"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={handleChange}
              className="form-control"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </Form.Group>
          <Button onClick={handleSubmit} className="reset-button">
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FormComponent;
