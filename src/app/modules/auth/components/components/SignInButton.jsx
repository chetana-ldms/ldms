import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Navigate, useNavigate } from "react-router-dom";

export const SignInButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance
        .loginPopup(loginRequest)
        .then(() => {
          navigate('/auth');
        })
        .catch((error) => {
          console.log(error);
        });
    } 
    else if (loginType === "redirect") {
      instance
        .loginRedirect(loginRequest)
        .then(() => {
          navigate('/auth');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <DropdownButton
      variant="secondary"
      className="ml-auto"
      drop="start"
      title="Sign In"
    >
      <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>
        Sign in using Popup
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>
        Sign in using Redirect
      </Dropdown.Item>
    </DropdownButton>
    
  );
};
