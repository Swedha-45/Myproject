import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // only used in register
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload =
        method === "login"
          ? { username, password }
          : { username, email, password };

      const res = await api.post(route, payload);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error) {
      const err =
        error?.response?.data?.detail ||
        JSON.stringify(error?.response?.data) ||
        error.message;
      alert("❌ " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 350,
        mx: "auto",
        mt: 10,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        {name}
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 2 }}
      />

      {method !== "login" && (
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        required
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ py: 1.2 }}
      >
        {loading ? "Processing..." : name}
      </Button>
    </Box>
  );
}

export default Form;
