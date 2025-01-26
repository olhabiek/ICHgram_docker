import React from "react";
import HomePagePosts from "../../molecules/homePagePosts/HomePagePosts";
import s from "./HomePage.module.css";
import allUpdates from "../../assets/allUdate.png";

const HomePage: React.FC = () => {
  return (
    <div className={s.homepagepost}>
      <HomePagePosts />
      <div className={s.allUpdates}></div>
    </div>
  );
};

export default HomePage;
