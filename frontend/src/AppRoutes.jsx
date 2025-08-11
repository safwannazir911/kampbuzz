import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Landing/Homepage";
import { Signup } from "./pages/StudentSignup/Signup";
import Layout from "./Layout/Layout";
import Feed from "./pages/Feed/Feed"; // -H added feed page
import ErrorPage from "./pages/Error/ErrorPage";
import ExploreViewCard from "./pages/Feed/Components/ExploreViewCard";
import OTPVerificationForm from "./pages/Auth/OTPVerificationForm";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

const store = createStore({
  authName: "student_token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

import { NavigationProvider } from "./feature/NavigationContext";
import PasswordResetForm from "./pages/Auth/PasswordResetForm";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordForm";
import SinglePost from "./pages/Feed/Components/single-post/SinglePost";
import ProfileUpdate from "./pages/profile/ProfileUpdate";
import RegisterAuthor from "./pages/profile/RegisterAuthor";

const AppRoutes = () => {
  return (
    <AuthProvider store={store}>
      <NavigationProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <Signup />
              </Layout>
            }
          />
          {/* Receives id of the user as a param to verify OTP */}
          <Route path="/verify/:id" element={<OTPVerificationForm />} />
          <Route
            path="/error"
            element={
              <ErrorPage status_code={200} message={"Incorrect creadentials"} />
            }
          />

          <Route element={<AuthOutlet fallbackPath="/" />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/:id" element={<SinglePost />} />
            <Route path="/post/:id" element={<ExploreViewCard />} />
            <Route path="/student/register-as-author" element={<RegisterAuthor />} />
            <Route path="/reset-password" element={<PasswordResetForm />} />
            <Route path="/profile/update" element={<ProfileUpdate />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        </Routes>
      </NavigationProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
