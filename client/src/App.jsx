import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Single from "./pages/Single";
import Write from "./pages/Write";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Blog from "./pages/Blog";
import { useContext } from "react";
import Admin from "./layout/Admin";
import { AuthContext } from "./context/authContext";
import Posts from "./pages/Admin/Posts";
import Accounts from "./pages/Admin/Accounts";
import Protect from "./components/Protect";
import Categories from "./pages/Admin/Categories";
import EditProfile from "./pages/profile/EditProfile";
import EditSocial from "./pages/profile/EditSocial";
import Profile from "./pages/profile/Profile";
import Draft from "./pages/MyPosts/Draft";
import Published from "./pages/MyPosts/Published";
import MyPosts from "./pages/MyPosts/MyPosts";
import Author from "./pages/Author";
import Featured from "./pages/Featured";
import CryptoTV from "./pages/CryptoTV";

const Layout = () => {
  const { openProfile, setOpenProfile } = useContext(AuthContext);

  return (
    <div className="relative" name="top">
      <NavBar openProfile={openProfile} setOpenProfile={setOpenProfile} />
      <div className="container min-h-screen px-5 pt-24 mx-auto md:px-10 lg:px-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/:id",
        element: <Single />,
      },
      {
        path: "/blog/:id",
        element: <Blog />,
      },
      {
        path: "/author/:id",
        element: <Author />,
      },
      {
        path: "/write",
        element: (
          <Protect allowedRoles={["admin"]}>
            <Write />
          </Protect>
        ),
      },
      {
        path: "/my-posts",
        element: (
          <Protect allowedRoles={["admin"]}>
            <MyPosts />
          </Protect>
        ),
        children: [
          {
            path: "draft",
            element: <Draft />,
          },
          {
            path: "published",
            element: <Published />,
          },
        ],
      },
      {
        path: "/account",
        element: (
          <Protect>
            <Profile />
          </Protect>
        ),
        children: [
          {
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "social-profiles",
            element: <EditSocial />,
          },
        ],
      },
      {
        'path': 'featured',
        'element': <Featured />
      },
      {
        'path': 'tv',
        'element': <CryptoTV />
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <Protect allowedRoles={["admin"]}>
        <Admin />
      </Protect>
    ),
    children: [
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "accounts",
        element: <Accounts />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

]);

const App = () => {
  const { openProfile, setOpenProfile } = useContext(AuthContext);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />

      <div className="">
        <RouterProvider router={router} />
      </div>
      {openProfile && <Profile setOpenProfile={setOpenProfile} />}
    </>
  );
};

export default App;
