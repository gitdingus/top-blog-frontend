import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Author from './views/Author.jsx';
import Blog from './views/Blog.jsx';
import BlogManager from './views/BlogManager.jsx';
import BlogPost from './views/BlogPost.jsx';
import Categories from './views/Categories.jsx';
import Category from './views/Category.jsx';
import CreateBlog from './components/CreateBlog.jsx';
import CreateBlogPost from './components/CreateBlogPost.jsx';
import EditBlog from './components/EditBlog.jsx';
import Home from './views/Home.jsx';
import Preferences from './views/Preferences.jsx';
import ReaderRoot from './views/Root.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import UpdatePersonalInformation from './components/UpdatePersonalInformation.jsx';
import UpdateSettings from './components/UpdateSettings.jsx';
import ViewUsersBlogs from './components/ViewUsersBlogs.jsx';

const rootDiv = document.querySelector('#root');
const root = createRoot(rootDiv);

const router = createBrowserRouter([
  {
    path: '/',
    element: <ReaderRoot />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'categories/:categoryId',
        element: <Category />,
      }, 
      {
        path: 'authors/:username',
        element: <Author />,
      },
      {
        path: 'preferences',
        element: <Preferences />,
        children: [
          {
            path: 'change-password',
            element: <ChangePassword />,
          },
          {
            path: 'personal-info',
            element: <UpdatePersonalInformation />,
          },
          {
            path: 'settings',
            element: <UpdateSettings />,
          },
        ],
      },
      {
        path: 'manage-blogs',
        element: <BlogManager />,
        children: [
          {
            path: 'create-blog',
            element: <CreateBlog />,
          },
          {
            path: 'blogs',
            element: <ViewUsersBlogs />
          },
          {
            path: 'blogs/:blogId/edit-blog',
            element: <EditBlog />,
          },
          {
            path: 'blogs/:blogId/create-post',
            element: <CreateBlogPost />,
          },
        ],
      },
      {
        path: ':blogName/',
        element: <Blog />,
      },
      {
        path: ':blogName/:postId',
        element: <BlogPost />,
      },
    ]
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
