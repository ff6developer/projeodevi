import { Routes, Route } from "react-router-dom";
import Genel from "./components/genel";
import Login from "./pages/login";
import Menu from "./pages/menu";
import Signin from "./pages/signin";

function Home() {
  return <h2>Ana Sayfa</h2>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Genel />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<Signin />} />
      </Route>
    </Routes>
  );
}

export default App;