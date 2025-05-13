import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { UserProvider } from "./components/Employee/Usercontext";

import './App.css'
import LoginPage from "./components/Employee/LoginPage";
import Home from "./components/Employee/Home";
import Employee from "./components/Employee/Employee";
import manager from "./components/Manager/Manager";
import Current from "./components/Employee/Current";
import Details from "./components/Employee/Details";
import Pending from "./components/Manager/Pending";
import AcceptRequest from "./components/Manager/AcceptRequest";
import AcceptedTask from "./components/Manager/AcceptedTask";
import Budget from "./components/Manager/Budget";
import NewRequest from "./components/Employee/NewRequest";
import CreateBudget from "./components/Manager/CreateBudget";

function App() {
  let router = createBrowserRouter([
    {
      path: "/",
      Component: Home,
      
    },
    {
      path: "/login",
      Component: LoginPage,
      
    },
    {
      path:"/employee",
      Component:Employee,
    },
    {
      path:"/manager",
      Component:manager,
    },
    {
      path:"/currentrequest",
      Component:Current,
    },
    {
      path:"/details",
      Component:Details,
    },
    {
      path:"/pendingreq",
      Component:Pending,
    },
    {
      path:"/acceptrejectrequest",
      Component:AcceptRequest,
    },
    {
      path:"/acceptedTask",
      Component:AcceptedTask,
    },
    {
      path:"/budget",
      Component:Budget,
    },
    {
      path:"/newrequest",
      Component:NewRequest,
    },
    {
      path:"/createBudget",
      Component:CreateBudget,
    },
    
  ]);

  return (
    <>

<UserProvider>
      <RouterProvider router={router} />
    </UserProvider>

    </>
  )
}

export default App
