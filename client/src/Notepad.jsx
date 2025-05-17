import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SplitText = ({ text }) => (
  <div>
    {text.split("\\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))}
  </div>
);

export const NotepadWindow = ({ title, content, clickHandler }) => {
  const [openMenuWindow, setOpenMenuWindow] = useState(null);

  const MenuWindow = ({ title, text, onClose }) => (
    <div className="menu-window window">
      <div className="window-header">
        <h4 className="window-header-text">{title}</h4>
        <div className="window-header-buttons">
          <button className="close-button window-control-button" onClick={onClose}>
            <img src="/close_window.png" alt="Close" />
          </button>
        </div>
      </div>
      <div className="window-text">
        <p>{text}</p>
      </div>
    </div>
  );

  return (
    <>
      <div className={`notepad window`}>
        <div className="window-header">
          <h4 className="window-header-text">{title}</h4>
          <div className="window-header-buttons">
            <Link to="/">
              <button className="close-button window-control-button">
                <img src="/close_window.png" />
              </button>
            </Link>
          </div>
        </div>

        <div className="notepad-header">
          <p onClick={() => setOpenMenuWindow("File")}><span className="underline">F</span>ile</p>
          <p onClick={() => setOpenMenuWindow("Edit")}><span className="underline">E</span>dit</p>
          <p onClick={() => setOpenMenuWindow("Search")}><span className="underline">S</span>earch</p>
          <p onClick={() => setOpenMenuWindow("Help")}><span className="underline">H</span>elp</p>
        </div>

        <div className="notepad-inner">
          <div id="notepad-text">
            <SplitText text={content} />
          </div>
        </div>
      </div>

      {openMenuWindow && (
  <MenuWindow
    title={openMenuWindow}
    text={
      {
        File: `🗂 Welcome to the File Menu!\n\nHere you could open, save, or even lose your precious work (just like in the 90s). But for now... it's just vibes.`,
        Edit: `✏️ Edit Menu Loaded!\n\nImagine cutting, copying, and pasting. Now imagine none of that actually works here.`,
        Search: `🔍 Search Activated!\n\nLooking for answers? So are we. Unfortunately, this search only finds existential dread.`,
        Help: `💡 Need Help?\n\nTry turning it off and on again.\nStill broken? We’re not responsible.\nGood luck! 🍀`,
      }[openMenuWindow] || "Unknown menu..."
    }
    onClose={() => setOpenMenuWindow(null)}
  />
)}

    </>
  );
};
