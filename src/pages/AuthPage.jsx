import React from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

/**
 * Backward compatibility wrapper for AuthPage.
 * Directs to the separate SignIn or SignUp page based on initialMode.
 */
export default function AuthPage({ initialMode = "login", onSelectTopic, onBack }) {
  if (initialMode === "signup" || initialMode === "register") {
    return (
      <SignUp
        onNavigate={(page) => {
          if (typeof window !== "undefined") {
            window.location.hash = page === "signin" ? "#/signin" : page === "signup" ? "#/signup" : `"#/${page}"`;
          }
        }}
        onBack={onBack}
      />
    );
  }

  return (
    <SignIn
      onNavigate={(page) => {
        if (typeof window !== "undefined") {
          window.location.hash = page === "signin" ? "#/signin" : page === "signup" ? "#/signup" : `"#/${page}"`;
        }
      }}
      onBack={onBack}
    />
  );
}
