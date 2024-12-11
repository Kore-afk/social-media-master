import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { useAuth } from "./hooks/use-auth";
import Home from "./pages/home/Home";
import Messenger from "./pages/messenger/Messenger";
import Profile from "./pages/profile/Profile";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Marketplace from "./pages/marketplace/Marketplace";
import Talleres from "./pages/talleres/Talleres";
import { checkAuthUser } from "./utils/checkAuthUser";
import PrivateRoutes from "./utils/PrivateRoutes";

const App: React.FC = () => {
  const { isAuth } = useAuth();

  React.useEffect(() => {
    checkAuthUser();
  }, [isAuth]);

  console.log('Rendering App component');

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/talleres" element={<Talleres />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
      </Route>
    </Routes>
  );
};

export default App;
