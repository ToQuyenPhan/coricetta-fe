import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './pages/HomePage';
import RecipDetails from './pages/RecipeDetailsPage';
import UserList from './pages/UserManagementPage';
import MyRecipes from './pages/PersonalPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />}/>
      <Route exact path="/home" element={<Home/>}/>
      <Route exact path="/users" element={<UserList/>}/>
      <Route exact path="/signup" element={<SignUp/>}/>
      <Route exact path="/recipeDetails" element={<RecipDetails/>}/>
      <Route exact path="/myRecipes" element={<MyRecipes/>}/>
    </Routes>
  </BrowserRouter>
);

