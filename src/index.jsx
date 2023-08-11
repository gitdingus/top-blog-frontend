import React from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from './views/Home.jsx';
import Category from './views/Category.jsx';

const rootDiv = document.querySelector('#root');
const root = createRoot(rootDiv);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/categories/:categoryId',
    element: <Category />,
  }, 
  {
    path: '/authors/:username',
    element: <div>Author!</div>,
  },
  {
    path: '/:blogName/',
    element: <div>Blog!</div>,
  },
  {
    path: '/:blogName/:postId',
    element: <div>Blog Post!</div>,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
