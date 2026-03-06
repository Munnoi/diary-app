import { Navigate, Route, Routes } from "react-router-dom";
import AddEntry from "./pages/AddEntry.tsx";
import Home from "./pages/Home.tsx";
import EntryDetail from "./pages/EntryDetail.tsx";
import { useEffect, useState, type JSX } from "react";
import { EntryContext, EntryProvider } from "./context/EntryContext.tsx";
import type { DiaryEntry } from "./constants/types.ts";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import { apiFetch } from "./services/api.ts";

type Props = { children: JSX.Element };

function PrivateRoute({ children }: Props) {
  const access = localStorage.getItem("access");
  return access ? children : <Navigate to="/login" replace />;
}

const App = () => {
  return (
    <EntryProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-entry/"
          element={
            <PrivateRoute>
              <AddEntry />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <AddEntry />
            </PrivateRoute>
          }
        />
        <Route
          path="/entry-detail/:id"
          element={
            <PrivateRoute>
              <EntryDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </EntryProvider>
  );
};

export default App;
