import "./App.css";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route
        path="/reset-password"
        element={<ResetPasswordForm />}
        exact
      ></Route>
    </Routes>
  );
}

export default App;
