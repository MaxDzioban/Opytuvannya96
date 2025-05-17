import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./App.css";
import { WelcomeWindow } from "./WelcomeWindow.jsx";
import {
  LogInSignUpWindow,
  CreateAccountWindow,
  PopUpWindow,
} from "./PopUps.jsx";
import { SelectTestWindow, TestWindow } from "./Test.jsx";
import { NotepadWindow } from "./Notepad.jsx";
import { UserIcon } from "./UserStuff.jsx";

// import questionsData from "../db.json";

const App = () => {
  // const groupedTopics = {};
  const [groupedTopics, setGroupedTopics] = useState({});

  const handleSignUpClick = () => {
    setIsLoginMode(false);
    setLogInWindow(true);
  };

  const handleLogInClick = () => {
    setIsLoginMode(true);
    setLogInWindow(true);
  };

  // for (const q of questionsData.questions) {
  //   if (!groupedTopics[q.topic]) groupedTopics[q.topic] = [];
  //   groupedTopics[q.topic].push(q.text);
  // }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions"); // ⚠️ без localhost
        const data = await res.json();
        const grouped = {};
        for (const q of data) {
          if (!grouped[q.topic]) grouped[q.topic] = [];
          grouped[q.topic].push(q.text);
        }
        setGroupedTopics(grouped);
      } catch (err) {
        console.error("Помилка завантаження питань:", err);
      }
    };
  
    fetchQuestions();
  }, []);
  
  const [showWelcome, setShowWelcome] = useState(true);
  // useEffect(() => {
  //   const show = localStorage.getItem("showWelcome");
  //   if (show === "false") {
  //     setShowWelcome(false);
  //   }
  // }, []);

  // const [showWelcome, setShowWelcome] = useState(() => {
  //   return localStorage.getItem("showWelcome") !== "false";
  // });

  const [anecdoteIsOpen, setAnecdoteIsOpen] = useState("hide");
  const [showLogInSignUpScreen, setShowLogInSignUpScreen] = useState(true);

  const [loggedin, setLoggedin] = useState(false);
  const [username, setUsername] = useState("");
  const [LogInWindowIsOpen, setLogInWindow] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const isLoggedIn = localStorage.getItem("loggedin") === "true";

    if (storedUser && isLoggedIn) {
      setUsername(storedUser);
      setLoggedin(true);
    }
  }, []);

  const [bloodOverlayActive, setBloodOverlayActive] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [points, setPoints] = useState(null);

  const [topicsPopUpIsOpen, setTopicsPopUpIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const anecdotes = [
    "There are only 10 kinds of people in this world: those who know binary and those who don't.",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
    "To understand recursion, you must first understand recursion.",
    "Hardware: The part of a computer you can kick. Software: The part you can only swear at.",
  ];
  const [currentAnecdote, setCurrentAnecdote] = useState("");

  return (
    <BrowserRouter>
      {bloodOverlayActive && <div className="blood-overlay"></div>}
      <header className="main-page-header">
        <div id="logo">
          <img className="logo-icon" src="/logoicon.png" alt="Logo" />
          OPYTUVANNYA95
        </div>
        <div className="navigation-links">
          <Link
            className="navigation-link"
            to="/"
            onClick={() => {
              setShowWelcome(true);
              localStorage.setItem("showWelcome", "true");
            }}
          >
            Home
          </Link>

          <Link className="navigation-link" to="/about">
            About Us
          </Link>
          <Link className="navigation-link" to="/contacts">
            Contacts
          </Link>

          {loggedin ? (
            <>
              <UserIcon username={username} />
              <button
                className="navigation-sign-in pretty-button"
                onClick={() => {
                  localStorage.removeItem("username");
                  localStorage.removeItem("loggedin");
                  setUsername("");
                  setLoggedin(false);
                  setLogInWindow(false);
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              className="navigation-sign-in pretty-button"
              onClick={() => {
                setShowLogInSignUpScreen(true);
                setLogInWindow(false);
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      <main>
        <aside className="main-page-side-bar">
          {/* <button
            className="main-page-side-bar-button"
            onClick={() => {
              setBloodOverlayActive(true);
              setTimeout(() => setBloodOverlayActive(false), 4000);
            }}
          >
            <img
              className="side-bar-icon"
              src="/anothercomputer.png"
              alt="Icon"
            />
            Settings
          </button> */}

          <button
            className="main-page-side-bar-button"
            onClick={async () => {
              try {
                // const res = await fetch(
                //   `http://localhost:3000/api/user/${username}`
                // );
                const res = await fetch(`/api/user/${username}`);
                const data = await res.json();
                if (res.ok) {
                  setPoints(data.points);
                  setShowStats(true);
                } else {
                  alert(data.error || "Failed to get user points");
                }
              } catch (err) {
                console.error("Fetch error:", err);
                alert("Error! Log-in/Sign-up please");
              }
            }}
          >
            <img className="side-bar-icon" src="/computer.png" alt="Icon" />
            Statistics
          </button>

          <button
            className="main-page-side-bar-button"
            onClick={() =>
              window.open(
                "https://docs.google.com/spreadsheets/d/1NgPsPB_8UHGtAehO79v54FXThUOMtFgLlBrqkL71riA/edit?gid=15096606#gid=15096606",
                "_blank"
              )
            }
          >
            <img className="side-bar-icon" src="/recyclebin.png" alt="Icon" />
            Penalty Log
          </button>

          <button
            className="main-page-side-bar-button"
            onClick={() => setTopicsPopUpIsOpen(true)}
          >
            <img className="side-bar-icon" src="/folder.png" alt="Icon" />
            Topics
          </button>


          <button
            className="main-page-side-bar-button"
            onClick={() => {
              const random =
                anecdotes[Math.floor(Math.random() * anecdotes.length)];
              setCurrentAnecdote(random);
              setAnecdoteIsOpen("show");
            }}
          >
            <img className="side-bar-icon" src="/anecdote.png" alt="Icon" />
            Anecdote of the Day
          </button>
        </aside>

        <div className="content">
          {!loggedin && !LogInWindowIsOpen && showLogInSignUpScreen && (
            <LogInSignUpWindow
              onSignUpClick={handleSignUpClick}
              onLogInClick={handleLogInClick}
              onClose={() => setShowLogInSignUpScreen(false)}
            />
          )}

          {showStats && (
            <PopUpWindow
              isOpen={true}
              title="Your Statistics"
              text={`You have ${points} points!`}
              clickHandler={() => setShowStats(false)}
              onClose={() => setShowStats(false)}
            />
          )}

          {LogInWindowIsOpen && (
            <CreateAccountWindow
              isLoginMode={isLoginMode}
              loginHandler={async () => {
                const name = document.getElementById("form-username").value;
                const password = document.getElementById("form-password").value;

                try {
                  if (!name || !password) {
                    alert("Please enter both username and password.");
                    return;
                  }

                  const endpoint = isLoginMode ? "login" : "register";
                  const baseUrl = import.meta.env.PROD
  ? "" // <- автоматично підставиться Heroku origin
  : "http://localhost:3000";
                  
                  const response = await fetch(
                    // `http://localhost:3000/api/${endpoint}`,
                    `${baseUrl}/api/${endpoint}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username: name, password }),
                    }
                  );

                  const data = await response.json();

                  if (data.success) {
                    setUsername(name);
                    setLoggedin(true);
                    setLogInWindow(false);

                    localStorage.setItem("username", name);
                    localStorage.setItem("loggedin", "true");
                  } else if (data.error === "User already exists") {
                    alert("User already exists. Try logging in.");
                  } else if (data.success === false) {
                    alert("Incorrect username or password.");
                  } else {
                    alert(data.error || "An unknown error occurred.");
                  }
                } catch (err) {
                  console.error("Registration error:", err);
                  alert("An error occurred during registration.");
                }
              }}
              onClose={() => setLogInWindow(false)}
            />
          )}

          {anecdoteIsOpen === "show" && (
            <PopUpWindow
              isOpen={anecdoteIsOpen}
              title="Anecdote of the Day"
              text={currentAnecdote}
              clickHandler={() => setAnecdoteIsOpen("hide")}
              onClose={() => setAnecdoteIsOpen("hide")}
            />
          )}
          {topicsPopUpIsOpen && !selectedTopic && (
            <PopUpWindow
              isOpen={true}
              title="Topics"
              text={
                <div className="topics-list">
                  {Object.keys(groupedTopics).map((topic) => (
                    <div key={topic}>
                      <button
                        className="pretty-button topic-button"
                        onClick={() => setSelectedTopic(topic)}
                        onClose={() => setTopicsPopUpIsOpen(false)}
                      >
                        {topic}
                      </button>
                    </div>
                  ))}
                </div>
              }
              clickHandler={() => setTopicsPopUpIsOpen(false)}
              onClose={() => setTopicsPopUpIsOpen(false)}
            />
          )}

          {selectedTopic && (
            <PopUpWindow
              isOpen={true}
              title={selectedTopic}
              text={
                <div className="scrollable-topic-content">
                  <ul>
                    {groupedTopics[selectedTopic].map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              }
              clickHandler={() => setSelectedTopic(null)}
              onClose={() => setSelectedTopic(null)}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                showWelcome && (
                  <WelcomeWindow
                    onClose={() => {
                      setShowWelcome(false);
                      localStorage.setItem("showWelcome", "false");
                    }}
                  />
                )
              }
            />
            <Route
              path="/about"
              element={
                <NotepadWindow
                  title="About Us"
                  content="      ------------------------------------------------      
                                                     ABOUT US
      ------------------------------------------------   
   Hello! We are aspiring web developers from UCU :+)

   This tool was designed to make your test preparations easy and fun.
   
   Important: This tool uses AI for evaluating your answers, and we are
   not responsible for any errors or inappropriate behaviour.
   This is a demo version of the tool, may contain bugs.

   Have fun!
   




   
   ▒▒▄▀▀▀▀▀▄▒▒▒▒▒▄▄▄▄▄▒▒▒
   ▒▐░▄░░░▄░▌▒▒▄█▄█▄█▄█▄▒
   ▒▐░▀▀░▀▀░▌▒▒▒▒▒░░░▒▒▒▒
   ▒▒▀▄░═░▄▀▒▒▒▒▒▒░░░▒▒▒▒
   ▒▒▐░▀▄▀░▌▒▒▒▒▒▒░░░▒▒▒▒
"
                />
              }
            />

            <Route
              path="/contacts"
              element={
                <NotepadWindow
                  title="Contacts"
                  content="      -------------------------------------------      
                                           HOW TO CONTACT US
      -------------------------------------------   
   Please don't"
                />
              }
            />

            <Route
              path="/test"
              element={
                <SelectTestWindow
                  username={username}
                  clickHandler={(title) => console.log(title)}
                />
              }
            />
          </Routes>
        </div>
      </main>

      
      <footer className="main-page-footer">
        <Link to="/test">
          <button
            className="main-page-footer-start pretty-button"
            onClick={(e) => {
              if (!username) {
                e.preventDefault();
                alert("❌ You must be logged in to start the test.");
              }
            }}
          >
            <img className="start-icon" src="/bomba.png" alt="bomb"/>
            Start Test
          </button>
        </Link>
      </footer>
    </BrowserRouter>
  );
};

export default App;

