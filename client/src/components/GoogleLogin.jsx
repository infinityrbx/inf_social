// GoogleLoginButton.jsx
import React, { useState } from "react";
import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const responseGoogle = async (authResult) => {
    try {
      setIsLoading(true);

      if (authResult.code) {
        const response = await fetch(
          `http://localhost:3005/auth/google?code=${authResult.code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          window.opener.postMessage({ type: "googleAuthSuccess", data }, "*"); // Send message to opener window
          window.close(); // Close the popup
        } else {
          throw new Error(data.error || "Google login failed");
        }
      } else {
        throw new Error("Authentication failed: " + JSON.stringify(authResult));
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <Button
      fullWidth
      onClick={googleLogin}
      disabled={isLoading}
      sx={{
        m: "1rem 0",
        p: "1rem",
        backgroundColor: "#4285F4",
        color: "white",
        "&:hover": { backgroundColor: "#3367d6" },
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="Google logo"
        style={{ width: "20px", marginRight: "8px" }}
      />
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
