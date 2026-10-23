# Chạy giao diện Tinh Hoa Việt

Mở terminal tại thư mục `src/frontend`, sau đó chạy:

```sh
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal (thường là `http://localhost:5173`).
Đường dẫn được quản lý tại `src/router/paths.js`:

- Trang chủ: `/`
- Đăng nhập: `/login`
- Đăng ký: `/register`
- Ghi danh nghệ nhân: `/artisan-register`

Để kiểm tra bản build production, chạy `npm run build` tại thư mục này.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
