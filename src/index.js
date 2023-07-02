import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './pages/HomePage';
import RecipDetails from './pages/RecipeDetailsPage';
import UserList from './pages/UserManagementPage';
import MyRecipes from './pages/PersonalPage';
import MyProfile from './pages/ProfilePage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import RecipeDetails from './pages/RecipeDetailsPage';
import Menu from './pages/MenuPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />}/>
      <Route exact path="/home" element={<Home/>}/>
      <Route exact path="/users" element={<UserList/>}/>
      <Route exact path="/signup" element={<SignUp/>}/>
      <Route exact path="/recipeDetails" element={<RecipeDetails/>}/>
      <Route exact path="/myRecipes" element={<MyRecipes/>}/>
      <Route exact path="/profile" element={<MyProfile/>}/>
      <Route exact path="/menu" element={<Menu/>}/>
    </Routes>
  </BrowserRouter>
);

