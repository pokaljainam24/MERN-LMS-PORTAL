import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContex";
import uploadImage from "../../utils/uploadimage";

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    /** front‑end validation ________________________________________ */
    if (!fullName) return setError("Please enter your full name");
    if (!validateEmail(email)) return setError("Invalid email address");
    if (!password) return setError("Password is required");
    setError("");
    setLoading(true);

    try {
      /* 1️⃣  upload image (optional) */
      let profileImageUrl = "";
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes?.data?.imageUrl ?? "";
      }

      /* 2️⃣  hit /register */
      const payload = {
        name: fullName,
        email,
        password,
        profileImageUrl,
      };
      if (adminInviteToken.trim()) payload.adminInviteToken = adminInviteToken.trim();

      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);

      /* 3️⃣  success flow */
      if (data.token) {
        localStorage.setItem("token", data.token);
        updateUser(data); // be sure updateUser can handle this shape
        navigate(data.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message;
      setError(serverMsg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full mt-10 flex flex-col justify-center">
        <h1 className="text-xl font-bold">Create an Account</h1>
        <p className="text-xs mb-4">Join us today by entering your details below.</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="xyz@example.com"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 Characters"
              label="Password"
              type="password"
            />
            <Input
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              placeholder="6‑digit code (optional)"
              label="Admin Invite Token"
            />
          </div>

          {error && <p className="text-red-500 text-xs pt-2">{error}</p>}

          <button
            type="submit"
            className="btn-primary disabled:opacity-50 mt-4"
            disabled={loading}
          >
            {loading ? "Please wait..." : "SIGN-UP"}
          </button>

          <p className="text-[13px] mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;


