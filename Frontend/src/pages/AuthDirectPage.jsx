import React, { useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'
import { Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AuthDirectPage = () => {
  const authRedirect = useAuthStore((state) => state.authRedirect);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      authRedirect(token)
        .then(() => {
          navigate("/"); // Redirect to homepage on success
        })
        .catch(() => {
          navigate("/login"); // Redirect to login if token is invalid
        });
    } else {
      navigate("/login"); // Redirect if no token found
    }
  }, [authRedirect, navigate]);

    return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
}

export default AuthDirectPage
