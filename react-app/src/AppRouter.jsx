import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Post from "../pages/Post";
import Profile from "./pages/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/users/:id" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
