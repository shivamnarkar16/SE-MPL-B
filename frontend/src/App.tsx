import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "@/components/Dashboard";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "@/components/Home";
import Register from "./components/Register";
import Logout from "./components/Logout";
import { UserProvider } from "@/context/User";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RestaurantMenu from "./components/RestaurantMenu";
import Orders from "./components/Orders";
import Success from "./components/Success";
import AdminPanel from "./components/AdminPanel";
import Chatbot from "./components/Chatbot";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <Navbar />
        <Chatbot />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
