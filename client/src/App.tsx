import React, { useEffect } from "react";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoutesUsers from "./guard/privateRoutes/privateUsers";
import { Footer } from "./molecules/footer/Footer";
import { ImageForm } from "./molecules/imageForm/ImageForm";
import Sidebar from "./molecules/sidebar/Sidebar";
import CreatePage from "./organisms/createPage/CreatePostPage";
import EditProfilePage from "./organisms/editProfilePage/EditProfilePage";
import ExplorePage from "./organisms/explorePage/ExplorePage";
import HomePage from "./organisms/homePage/HomePage";
import { LoginPage } from "./organisms/loginPage/LoginPage";
import MessagesPage from "./organisms/messagesPage/MessagesPage";
import OtherProfilePage from "./organisms/otherProfilePage/OtherProfilePage";
import ProfilePage from "./organisms/profilePage/ProfilePage";
import { RegisterPage } from "./organisms/registerPage/RegisterPage";
import { ResetPage } from "./organisms/resetPage/ResetPage";
import { setUser } from "./redux/slices/authSlice";
import { getFollowingMe, getFollowMe } from "./redux/slices/followSlice";
import dark from "./assets/dark_mode.svg";
import light from "./assets/light_mode.svg";
import { AppDispatch, RootState } from "./redux/store";
import { useTheme } from "./services/ThemeContext";

import "./index.css";

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div className="sidebar">
          <Sidebar />
        </div>
        <main>{children}</main>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setUser({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getFollowMe(user._id));
      dispatch(getFollowingMe(user._id));
    }
  }, [dispatch, user]);

  return (
    <div className="globalContainer">
      <button
        style={{
          width: "25px",
          border: "none",
          backgroundColor: "transparent",
          position: "static",
          marginTop: "10px",
          left: "200px",
        }}
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <img src={dark} alt="dark-mode" />
        ) : (
          <img src={light} alt="light-mode" />
        )}
      </button>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/upload" element={<ImageForm />} />
          <Route element={<PrivateRoutesUsers />}>
            <Route
              path="/home"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/explore"
              element={
                <Layout>
                  <ExplorePage />
                </Layout>
              }
            />
            <Route
              path="/messages"
              element={
                <Layout>
                  <MessagesPage />
                </Layout>
              }
            />
            <Route
              path="/create"
              element={
                <Layout>
                  <CreatePage />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <Layout>
                  <EditProfilePage />
                </Layout>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <Layout>
                  <OtherProfilePage />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
