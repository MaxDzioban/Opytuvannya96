// import React from "react";
// export const WelcomeWindow = () => {
//     return (
//         <>
//         <div className="welcome window">
//             <div className="window-header">
//                 <h4 className="window-header-text">Home</h4>
//                 <div className="window-header-buttons">
//                     <button className="minimize-button window-control-button"><img src="/min_window.png"/></button>
//                     <button className="maximize-button window-control-button"><img src="/max_window.png"/></button>
//                     <button className="close-button window-control-button"><img src="/close_window.png"/></button>
//                 </div>
//             </div>
//             <div className="welcome-main">
//                 <div className="welcome-main-side">
//                     <h1 id="welcome-title">Welcome to Opytuvannia<span className="highlighted-text">95</span></h1>
//                         <div className="welcome-inner-text">
//                             <h4 className="small-title"><img src="/info.png" />Did you know...</h4>
//                             <p className="generic-text">You can prepare for any test with Opytuvannya95
//                                 and get a real assessment of your knowledge!
//                             </p>
//                         </div>
//                     </div>
//                     <div className="welcome-image">
//                         <img id="large-dog" src="/dog_reading.png" />
//                         <img id="lightbulb" src="/lightbulb.png" />
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

import React from "react";

export const WelcomeWindow = ({ onClose }) => {
  return (
    <div className="welcome window">
      <div className="window-header">
        <h4 className="window-header-text">Home</h4>
        <div className="window-header-buttons">
          {/* <button className="minimize-button window-control-button">
            <img src="/min_window.png"/>
          </button>
          <button className="maximize-button window-control-button">
            <img src="/max_window.png" />
          </button> */}
          <button
            className="close-button window-control-button"
            onClick={onClose}
          >
            <img src="/close_window.png" />
          </button>
        </div>
      </div>
      <div className="welcome-main">
        <div className="welcome-main-side">
          <h1 id="welcome-title">
            Welcome to Opytuvannia
            <span className="highlighted-text">95</span>
          </h1>
          <div className="welcome-inner-text">
            <h4 className="small-title">
              <img src="/info.png" alt="Information" />
              Did you know...
            </h4>
            <p className="generic-text">
              You can prepare for any test with Opytuvannya95 and get a real
              assessment of your knowledge!
            </p>
          </div>
        </div>
        <div className="welcome-image">
          <img id="large-dog" src="/dog_reading.png" alt="Dog reading image" />
          <img id="lightbulb" src="/lightbulb.png" alt="lightbulble image" />
        </div>
      </div>
    </div>
  );
};
