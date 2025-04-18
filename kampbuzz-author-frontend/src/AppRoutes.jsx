import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthorLogin from "./pages/AuthorLogin";
import NotFound from "./pages/NotFound";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

import SelectPostType from "./pages/Dashboard/Components/SelectPostType";
import Manage from "./pages/Dashboard/Components/manage-posts/Manage";
import ProfileUpdate from "./pages/Dashboard/Components/profile/ProfileUpdate";

const store = createStore({
  authName: "author_token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const AppRoutes = () => {
  return (
    <AuthProvider store={store}>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<AuthorLogin />} />

          <Route element={<AuthOutlet fallbackPath="/" />}>
            <Route element={<Dashboard />}>
              <Route path="home" element={<Manage />} />
              <Route path="/createPost" element={<SelectPostType />} />
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
