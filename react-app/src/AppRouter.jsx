import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route element={<App />}>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<Post />} />
                <Route path="/users/:id" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
        </Routes>
    </BrowserRouter>
}
