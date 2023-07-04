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
import SearchPage from './pages/SearchPage';
import MenuDetails from './pages/MenuDetailsPage';
import Reports from './pages/ReportManagementPage';
import RecipeCreate from './pages/CreateRecipePage';
import RecipeReport from './pages/RecipeReportPage';
import Edit from './pages/EditRecipePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />}/>
      <Route exact path="/home" element={<Home/>}/>
      <Route exact path="/users" element={<UserList/>}/>
      <Route exact path="/signup" element={<SignUp/>}/>
      <Route exact path="/recipeDetails" element={<RecipeDetails/>}/>
      <Route exact path="/my-recipes" element={<MyRecipes/>}/>
      <Route exact path="/profile" element={<MyProfile/>}/>
      <Route exact path="/my-menus" element={<Menu/>}/>
      <Route exact path="/search" element={<SearchPage/>}/>
      <Route exact path="/menu-details" element={<MenuDetails/>}/>
      <Route exact path="/reports" element={<Reports/>}/>
      <Route exact path="/create" element={<RecipeCreate/>}/>
      <Route exact path="/report" element={<RecipeReport/>}/>
      <Route exact path="/edit" element={<Edit/>}/>
    </Routes>
  </BrowserRouter>
);

