import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AdminPanel from './views/Admin.jsx';
import Author from './views/Author.jsx';
import Blog from './views/Blog.jsx';
import BlogManager from './views/BlogManager.jsx';
import BlogPost from './views/BlogPost.jsx';
import Categories from './views/Categories.jsx';
import Category from './views/Category.jsx';
import CreateBlog from './components/CreateBlog.jsx';
import CreateBlogPost from './components/CreateBlogPost.jsx';
import EditBlog from './components/EditBlog.jsx';
import EditBlogPost from './components/EditBlogPost.jsx';
import Home from './views/Home.jsx';
import Preferences from './views/Preferences.jsx';
import ReaderRoot from './views/Root.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import UpdatePersonalInformation from './components/UpdatePersonalInformation.jsx';
import UpdateSettings from './components/UpdateSettings.jsx';
import ViewReport from './components/ViewReport.jsx';
import ViewReports from './components/ViewReports.jsx';
import ViewUsers from './components/ViewUsers.jsx';
import ViewUsersBlogs from './components/ViewUsersBlogs.jsx';
import ViewUsersBlogPosts from './components/ViewUsersBlogPosts.jsx';

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
            path: 'blogposts',
            element: <ViewUsersBlogPosts />,
          },
          {
            path: 'blogposts/:blogPostId/edit-blogpost',
            element: <EditBlogPost />,
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
        path: 'admin',
        element: <AdminPanel />,
        children: [
          {
            path: 'reports',
            element: <ViewReports />,
            children: [
              {
                path: ':reportId',
                element: <ViewReport />
              },
            ],
          },
          {
            path: 'users',
            element: <ViewUsers />,
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
