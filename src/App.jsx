// import React, { useState, useEffect, useRef } from 'react';

// const RadioPlayer = () => {
//     const radioPlayerRef = useRef(null);
//     const [volume, setVolume] = useState(0.5); // Default volume is 50%

//     useEffect(() => {
//         // Load the saved volume level or set it to 50% if no volume is saved
//         const savedVolume = localStorage.getItem('radioPlayerVolume');
//         const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
//         setVolume(initialVolume);
//         if (radioPlayerRef.current) {
//             radioPlayerRef.current.volume = initialVolume;
//         }
//     }, []);

//     useEffect(() => {
//         // Save the volume level whenever it changes
//         if (radioPlayerRef.current) {
//             localStorage.setItem('radioPlayerVolume', volume);
//         }
//     }, [volume]);

//     const handleVolumeChange = (event) => {
//         const newVolume = event.target.value / 100;
//         setVolume(newVolume);
//         if (radioPlayerRef.current) {
//             radioPlayerRef.current.volume = newVolume;
//         }
//     };

//     const handleWheel = (event) => {
//         event.preventDefault(); // Prevent the page from scrolling

//         // Determine the direction of the scroll (up or down)
//         const delta = Math.sign(event.deltaY);

//         // Adjust the volume based on the scroll direction
//         let newVolume = volume - delta * 0.05;
//         newVolume = Math.min(Math.max(newVolume, 0), 1); // Clamp the value between 0 and 1

//         setVolume(newVolume);
//         if (radioPlayerRef.current) {
//             radioPlayerRef.current.volume = newVolume;
//         }
//     };

//     const handlePlay = () => {
//         if (radioPlayerRef.current) {
//             radioPlayerRef.current.play();
//         }
//     };

//     const handlePause = () => {
//         if (radioPlayerRef.current) {
//             radioPlayerRef.current.pause();
//         }
//     };

//     return (
//         <div className="player-container" onWheel={handleWheel}>
//             <h1>Bollywood Now Radio</h1>
//             <audio ref={radioPlayerRef} controls>
//                 <source src="https://drive.uber.radio/uber/bollywoodnow/icecast.audio" type="audio/mpeg" />
//                 Your browser does not support the audio element.
//             </audio>
//             <div className="controls">
//                 <button onClick={handlePlay}>Play</button>
//                 <button onClick={handlePause}>Pause</button>
//             </div>
//             <div className="volume-control">
//                 <label htmlFor="volumeSlider">Volume: <span id="volumeLabel">{Math.round(volume * 100)}</span>%</label>
//                 <input
//                     type="range"
//                     id="volumeSlider"
//                     min="0"
//                     max="100"
//                     value={Math.round(volume * 100)}
//                     onChange={handleVolumeChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default RadioPlayer;


// ********************** Added Loader *******************************


import React, { useState, useEffect, useRef } from 'react';

const RadioPlayer = () => {
    const radioPlayerRef = useRef(null);
    const [volume, setVolume] = useState(0.5); // Default volume is 50%
    const [loading, setLoading] = useState(false); // Track if the audio is loading

    useEffect(() => {
        // Load the saved volume level or set it to 50% if no volume is saved
        const savedVolume = localStorage.getItem('radioPlayerVolume');
        console.log('Loaded volume from localStorage:', savedVolume);

        const initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
        setVolume(initialVolume);

        if (radioPlayerRef.current) {
            radioPlayerRef.current.volume = initialVolume;
            console.log('Set initial volume to:', initialVolume);
        }

        // Event listeners for audio loading and playing
        const audioElement = radioPlayerRef.current;

        const handleWaiting = () => setLoading(true);
        const handleCanPlay = () => setLoading(false);
        const handlePlaying = () => setLoading(false);

        audioElement.addEventListener('waiting', handleWaiting);
        audioElement.addEventListener('canplay', handleCanPlay);
        audioElement.addEventListener('playing', handlePlaying);

        // Clean up event listeners on component unmount
        return () => {
            audioElement.removeEventListener('waiting', handleWaiting);
            audioElement.removeEventListener('canplay', handleCanPlay);
            audioElement.removeEventListener('playing', handlePlaying);
        };
    }, []);

    useEffect(() => {
        // Save the volume level whenever it changes
        console.log('Saving volume to localStorage:', volume);
        localStorage.setItem('radioPlayerVolume', volume);
        if (radioPlayerRef.current) {
            radioPlayerRef.current.volume = volume;
        }
    }, [volume]);

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value / 100;
        setVolume(newVolume);
    };

    const handleWheel = (event) => {
        event.preventDefault(); // Prevent the page from scrolling

        // Determine the direction of the scroll (up or down)
        const delta = Math.sign(event.deltaY);

        // Adjust the volume based on the scroll direction
        let newVolume = volume - delta * 0.05;
        newVolume = Math.min(Math.max(newVolume, 0), 1); // Clamp the value between 0 and 1

        setVolume(newVolume);
    };

    const handlePlay = () => {
        if (radioPlayerRef.current) {
            radioPlayerRef.current.play();
        }
    };

    const handlePause = () => {
        if (radioPlayerRef.current) {
            radioPlayerRef.current.pause();
        }
    };

    return (
        <div className="player-container" onWheel={handleWheel}>
            <h1>Online radio</h1>
            <audio ref={radioPlayerRef} controls>
                <source src="https://drive.uber.radio/uber/bollywoodnow/icecast.audio" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <div className="controls">
                <button onClick={handlePlay} disabled={loading}>Play</button>
                <button onClick={handlePause}>Pause</button>
            </div>
            {loading && <div className="loader"></div>}
            <div className="volume-control">
                <label htmlFor="volumeSlider">Volume: <span id="volumeLabel">{Math.round(volume * 100)}</span>%</label>
                <input
                    type="range"
                    id="volumeSlider"
                    min="0"
                    max="100"
                    value={Math.round(volume * 100)}
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
};

export default RadioPlayer;
