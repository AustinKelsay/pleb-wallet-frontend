import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import "./Header.css";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Header = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("in here");
      axiosWithAuth()
        .get("/users/user")
        .then((res) => {
          console.log("user", res);
          setIsLoggedIn(true);
          setUsername(res.data.username);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .post(`${backendUrl}/users/login`, formData)
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        setModalIsOpen(false);
        setFormData({
          username: "",
          password: "",
        });
        setIsLoggedIn(true);
        setUsername(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <header className="header-container">
      <div></div> {/* Empty div for flex alignment */}
      <h1>pleb wallet</h1>
      <div className="auth-container">
        {isLoggedIn ? <p className="user">Welcome, {username}!</p> : null}

        {isLoggedIn ? (
          <button className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="auth-button" onClick={() => setModalIsOpen(true)}>
            Login
          </button>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Login Modal"
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </Modal>
    </header>
  );
};

export default Header;
