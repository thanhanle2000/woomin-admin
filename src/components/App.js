import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';
import { getObUser } from '../core/db/local';
import LoginPage from '../page/auth/login';
import BlogPage from '../page/blog/blog';
import EditBlogPage from '../page/blog/widget/edit-blog';
import UploadBlog from '../page/blog/widget/upload-blog';
import CatePage from '../page/cate/cate';
import CategoryScreen from '../page/cate/widget/drag-item-cate';
import EditCatePage from '../page/cate/widget/edit-cate';
import UploadCate from '../page/cate/widget/upload-cate';
import HomePage from '../page/home/home';
import { ImagePage } from '../page/image/image';
import ProductPage from '../page/product/product';
import UploadProduct from '../page/product/widget/upload-product';
import CustomHeader from './custom-header';

function App() {
  // check login
  const isCheck = getObUser();

  return (
    <Router>
      <div className="App">
        <CustomHeader />
        <Routes>
          <Route path="/" element={isCheck ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/upload-blog" element={<UploadBlog />} />
          <Route path="/edit-blog" element={<EditBlogPage />} />
          <Route path="/cate" element={<CatePage />} />
          <Route path="/upload-cate" element={<UploadCate />} />
          <Route path="/edit-cate" element={<EditCatePage />} />
          <Route path="/drag-item-cate" element={<CategoryScreen />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/upload-product" element={<UploadProduct />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
