import React, { useContext, useState, useEffect } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [identifier, setIdentifier] = useState(
    () => localStorage.getItem("saved_identifier") || "",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser, user } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier) {
      setError("Email emaw Phone Number chhut lut rawh.");
      return;
    }
    if (!password) {
      setError("Khawngaihin password chhut lut rawh");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        identifier,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("saved_identifier", identifier); // ← save for next visit
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Email/Phone emaw password a dik lo.",
      );
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        <h3 className="text-5xl font-black text-slate-800 text-center mb-12">
          Login
        </h3>

        <form onSubmit={handleLogin} className="space-y-8">
          <Input
            value={identifier}
            onChange={({ target }) => setIdentifier(target.value)}
            label="Username"
            placeholder="I gmail/phone no chhu lut rawh."
            type="text"
            className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 focus:border-purple-500 px-0"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="I password chhu lut rawh."
            type="password"
            className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 focus:border-purple-500 px-0"
          />

          <div className="flex justify-end"></div>

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-50 p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-black rounded-full shadow-lg hover:opacity-90 transition-all uppercase tracking-widest mt-4"
          >
            LOGIN
          </button>

          <div className="mt-auto pt-10 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Have not account yet?
            </p>
            <Link
              className="font-bold text-slate-800 hover:text-purple-600 block mt-2 text-sm"
              to="/signup"
            >
              SIGN UP
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
