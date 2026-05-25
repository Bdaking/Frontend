import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser, user } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Khawngaihin i hming ziak lut rawh.");
      return;
    }
    if (!contact) {
      setError("Email emaw Phone number chhut lut rawh.");
      return;
    }
    if (!password) {
      setError("Khawngaihin password chhut lut rawh.");
      return;
    }
    setError("");

    const isEmail = validateEmail(contact);
    const payload = {
      fullName,
      password,
      email: isEmail ? contact : null,
      phoneNumber: !isEmail ? contact : null,
    };

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        payload,
      );
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("saved_identifier", contact); // ← save for login pre-fill
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Engemaw a dik lo.");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        <h3 className="text-5xl font-black text-slate-800 text-center mb-12">
          Sign Up
        </h3>

        <form onSubmit={handleSignUp} className="space-y-8">
          <div className="space-y-8">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="I hming chhu lut rawh."
              type="text"
              className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 focus:border-purple-500 px-0 bg-transparent"
            />
            <Input
              value={contact}
              onChange={({ target }) => setContact(target.value)}
              label="Email / Phone"
              placeholder="I phone no./email chhu lut rawh."
              type="text"
              className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 focus:border-purple-500 px-0 bg-transparent"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="I password chhu lut rawh."
              type="password"
              className="rounded-none border-t-0 border-x-0 border-b-2 border-slate-200 focus:border-purple-500 px-0 bg-transparent"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-50 p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-black rounded-full shadow-lg hover:opacity-90 transition-all uppercase tracking-widest mt-4"
          >
            SIGN UP
          </button>

          <div className="mt-auto pt-10 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Already have an account?
            </p>
            <Link
              className="font-bold text-slate-800 hover:text-purple-600 block mt-2 text-sm"
              to="/login"
            >
              LOGIN
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
