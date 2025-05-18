// import React from 'react';
// import {useState, useEffect} from 'react';

// export const Timer = ({ timeInMins, onComplete }) => {
//     const [hours, setHours] = useState(Math.floor(timeInMins/60));
//     const [minutes, setMinutes] = useState(timeInMins);
//     const [seconds, setSeconds] = useState(0);

//     const deadline = Date.now() + 1000*60*timeInMins;

//     const getTime = () => {
//         const time = deadline - Date.now();
//         setHours(Math.floor((time/(1000*60*60))%24));
//         setMinutes(Math.floor((time/1000/60)%60));
//         setSeconds(Math.floor((time/1000)%60));

//         if (time <= 0) {
//             onComplete();
//             return;
//         }
//     }

//     useEffect(() => {
//         const interval = setInterval(() => getTime(deadline),1000);

//         return () => clearInterval(interval)
//     }, []);

//     return (
//         <div className='timer'>
//             <div className="window-header">
//                 <h4 className="window-header-text">Time Left:</h4>
//             </div>
//             <h2 className="timer-text">
//             <span className="timer-hours">{hours}</span>:
//             <span className="timer-minutes">{minutes}</span>:
//             <span className="timer-seconds">{seconds}</span>
//             </h2>

//         </div>
//     );
// };

import React from 'react';
import {useState, useEffect, useRef} from 'react';

export const Timer = ({ timeInMins, onComplete }) => {
    const [hours, setHours] = useState(Math.floor(timeInMins/60));
    const [minutes, setMinutes] = useState(timeInMins);
    const [seconds, setSeconds] = useState(0);

    const deadline = Date.now() + 1000*60*timeInMins;
    const warning = useRef(new Audio("/30sec.mp3"));

    const getTime = () => {
        const time = deadline - Date.now();
        setHours(Math.floor((time/(1000*60*60))%24));
        setMinutes(Math.floor((time/1000/60)%60));
        setSeconds(Math.floor((time/1000)%60));

        if (time <= 0) {
            onComplete();
            return;
        }
    }

    useEffect(() => {
        const interval = setInterval(() => getTime(deadline),1000);

        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        if (seconds === 30) {
            warning.current.play().catch(() => {
                console.log("Error while auto-playing");
            })
        }
    }, [seconds]);

    return (
        <div className='timer'>
            <div className="window-header">
                <h4 class="window-header-text">Time Left:</h4>
            </div>
            <h2 className="timer-text">
            <span className="timer-hours">{hours}</span>:
            <span className="timer-minutes">{minutes}</span>:
            <span className="timer-seconds">{seconds}</span>
            </h2>

        </div>
    );
};

