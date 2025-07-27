import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress,
    AppBar,
    Toolbar,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Home() {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setImage(null);

        try {
            const res = await api.post("/api/generate-image/", { text });
            setImage(`data:image/png;base64,${res.data.image_data}`);
        } catch (err) {
            console.error(err);
            setError("Failed to generate image");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        navigate("/login");
    };

    return (
        <>
            {/* Top Bar */}
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Text to Image App</Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Form */}
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Hugging Face Image Generator
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                    <TextField
                        label="Enter prompt"
                        variant="outlined"
                        fullWidth
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Generate Image"}
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {image && (
                    <Box mt={4} display="flex" justifyContent="center">
                        <img
                            src={image}
                            alt="Generated"
                            style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                    </Box>
                )}
            </Container>
        </>
    );
}

export default Home;
