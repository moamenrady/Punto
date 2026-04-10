import useAuth from "./context/useAuth";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function AppRouter() {
  const { token } = useAuth();

  if (!token) {
    return <LoginPage />;
  }
  return <App />;
}
