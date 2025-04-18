import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import PublisherLogin from "./pages/PublisherLogin";
// import PostsOverview from "./pages/Dashboard/Components/PostsOverview";
import Team from "./pages/Dashboard/Components/Team";
import Manage from "./pages/Dashboard/Components/Manage";
import ProfileUpdate from "./pages/Dashboard/Components/profile/ProfileUpdate";

const store = createStore({
  authName: "publisher_token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const AppRoutes = () => {
  return (
    <AuthProvider store={store}>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<PublisherLogin />} />

          <Route element={<AuthOutlet fallbackPath="/" />}>
            <Route element={<Dashboard />}>
              <Route path="/home" element={<Manage />} />
              <Route path="/team" element={<Team />} />
              <Route path="/account" element={<h1>Account Settings</h1>} />
              <Route path="/analitics" element={<h1>Analitics</h1>} />
              <Route path="/settings" element={<h1>Settings</h1>} />
              <Route path="/profile/update" element={<ProfileUpdate />} />
            </Route>
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
