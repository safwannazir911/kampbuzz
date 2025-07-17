import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import Root from "./pages/Root";
import NotFound from "./pages/NotFound";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit/AuthProvider";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import AddCoins from "./pages/Dashboard/Components/AddCoins";
import TransferCoins from "./pages/Dashboard/Components/TransferCoins";
import Create from "./pages/Dashboard/Components/Create";
import { Stats } from "./pages/Dashboard/Components/Stats";
import ProfileUpdate from "./pages/Dashboard/profile/ProfileUpdate";
import AuthorRequests from "./pages/Dashboard/Components/AuthorRequests";

const store = createStore({
  authName: "institution_token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const AppRoutes = () => {
  return (
    <AuthProvider store={store}>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Root />} />

          <Route element={<AuthOutlet fallbackPath="/" />}>
            <Route element={<Dashboard />}>
              <Route path="/home" element={<Stats />} />
              <Route path="/create" element={<Create />} />
              <Route path="/profile/update" element={<ProfileUpdate />} />
              <Route path="/add-coins" element={<AddCoins />} />
              <Route path="/trasfer-coins" element={<TransferCoins />} />
              <Route path="/payment-history" element={<h1>Payment History</h1>} />
              <Route path="/author-requests" element={<AuthorRequests />} />
              <Route path="/settings" element={<h1>Settings</h1>} />
            </Route>
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
