import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAppDispatch } from "../redux/hooks";

function AuthErrorListener() {
  const dispatch = useAppDispatch();
  const alertShownRef = useRef(false);

  useEffect(() => {
    const handleAuthError = () => {
      // Prevent multiple alerts if multiple requests fail at once
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert("Your session has expired. Please log in again.");
        dispatch(logout());

        // Reset after navigation
        setTimeout(() => {
          alertShownRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener("authError", handleAuthError);

    return () => {
      window.removeEventListener("authError", handleAuthError);
    };
  }, [dispatch]);

  return null;
}

export default AuthErrorListener;
