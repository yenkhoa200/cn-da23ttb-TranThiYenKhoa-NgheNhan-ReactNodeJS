// App chỉ gắn router; tách trang chủ riêng để tránh khai báo hai default export.
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return <AppRoutes />;
}

export default App;
