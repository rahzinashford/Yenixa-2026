import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Router } from "wouter";

// Local hash-location factory for wouter.Router hook prop
// Returns a hook function that provides [location, navigate]
function useHashLocation() {
  return function useLocationHook() {
    const [loc, setLoc] = React.useState(() => {
      const hash = window.location.hash;
      return hash ? hash.slice(1) : "/";
    });

    React.useEffect(() => {
      const onHashChange = () =>
        setLoc(window.location.hash ? window.location.hash.slice(1) : "/");
      window.addEventListener("hashchange", onHashChange);
      return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const navigate = (to) => {
      if (to !== loc) {
        window.location.hash = to;
        setLoc(to);
      }
    };

    return [loc, navigate];
  };
}

function AppWrapper() {
  const hook = useHashLocation();
  return (
    <Router hook={hook}>
      <App />
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
