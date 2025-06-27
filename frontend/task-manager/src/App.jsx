import React, { useContext } from 'react';
import { Toaster } from 'react-hot-toast';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"; 

import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
      
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';

import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContex';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/tasks-details/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* Default Route */}
          <Route path='/' element={<Root />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            className: 'toast',
            style: { fontSize: '1rem' }
          }}
        />
      </Router>
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <p>Loading...</p>;
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }              

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />
};
