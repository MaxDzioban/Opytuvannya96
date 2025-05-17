import React from "react";
import { useState } from "react";
import { Transition } from "react-transition-group";

export const LogInSignUpWindow = ({ onSignUpClick, onLogInClick, onClose }) => {
  return (
    
    <div className="loginsignup window">
      <div className="window-header">
        <h4 className="window-header-text">Hello</h4>
        <div className="window-header-buttons">
          {/* <button className="minimize-button window-control-button">
            <img src="/min_window.png" />
          </button>*/}

          {/* <button className="maximize-button window-control-button">
            <img src="/max_window.png" />
          </button> */}

          {/* <button className="close-button window-control-button">
            <img src="/close_window.png" />
          </button> */}
          <button
                  className="close-button window-control-button"
                  onClick={onClose}
                >
                  <img src="/close_window.png" />
                </button>
        </div>
      </div>
      <div className="window-text">
        <p>
          It looks like you are new here...
          <br />
          Please create an account or log into an existing one to save your
          progress.
        </p>
      </div>
      <div className="window-buttons">
        <button className="sign-up pretty-button" onClick={onSignUpClick}>
          Sign up
        </button>
        <button className="log-in pretty-button" onClick={onLogInClick}>
          Log In
        </button>
      </div>
    </div>
  );
};

export const CreateAccountWindow = ({ loginHandler, isLoginMode, onClose }) => {
  return (
    <div className="create-account window">
      <div className="window-header">
        <h4 className="window-header-text">
          {isLoginMode ? "Log In" : "Sign Up"}
        </h4>
        <div className="window-header-buttons">
          {/* <button className="minimize-button window-control-button">
            <img src="/min_window.png" />
          </button>
          <button className="maximize-button window-control-button">
            <img src="/max_window.png" />
          </button> */}
          {/* <button className="close-button window-control-button">
            <img src="/close_window.png" />
          </button> */}
          <button
          className="close-button window-control-button"
          onClick={onClose}
        >
          <img src="/close_window.png" />
        </button>
        </div>
      </div>
      <div className="window-text">
        <p className="window-text">
          {isLoginMode
            ? "Type a username and password to log in."
            : "Choose a username and password to create an account."}
        </p>
        <p className="window-text">Username:</p>
        <input id="form-username" type="text" />
        <p className="window-text">Password:</p>
        <input id="form-password" type="password" placeholder="Password" />
      </div>
      <div className="window-buttons">
        <button className="confirmAccount pretty-button" onClick={loginHandler}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export const PopUpWindow = ({ isOpen = true, title, text, clickHandler , onClose}) => {
  // fix this transition please...
  return (
    <Transition in={isOpen} timeout={500} unmountOnExit={true}>
      {(state) => (
        <div className={`window--${state}`}>
          <div className={`pop-up window`}>
            <div className="window-header">
              <h4 className="window-header-text">{title}</h4>
              <div className="window-header-buttons">
                {/* <button className="minimize-button window-control-button">
                  <img src="/min_window.png" />
                </button>
                <button className="maximize-button window-control-button">
                  <img src="/max_window.png" />
                </button> */}

                {/* <button className="close-button window-control-button">
                  <img src="/close_window.png" />
                </button> */}

                <button
                  className="close-button window-control-button"
                  onClick={onClose}
                >
                  <img src="/close_window.png" />
                </button>

              </div>
            </div>
            <div className="window-text">{text}</div>
            <div className="window-buttons">
              <button
                className="ok_button pretty-button"
                onClick={clickHandler}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};
