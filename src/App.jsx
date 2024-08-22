import React, { useState, useEffect, useRef } from 'react';
import Footer from './components/Footer'; // Import the Footer component
import './App.css'; // Import the main styles including dark/light mode styles

const App = () => {
    const radioPlayerRef = useRef(null);
    const [volume, setVolume] = useState(0.5); // Default volume is 50%
    const [loading, setLoading] = useState(false); // Track if the audio is loading
    const [darkMode, setDarkMode] = useState(() => {
        // Load the saved theme or default to light mode
        return localStorage.getItem('theme') === 'dark';
    });

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

        // Apply the saved theme
        document.body.classList.toggle('dark-mode', darkMode);

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
    }, [darkMode]);

    useEffect(() => {
        // Save the volume level whenever it changes
        console.log('Saving volume to localStorage:', volume);
        localStorage.setItem('radioPlayerVolume', volume);
        if (radioPlayerRef.current) {
            radioPlayerRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        // Save the theme preference to localStorage
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

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

    const toggleTheme = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <div className="player-container" onWheel={handleWheel}>
            <div className="theme-toggle" onClick={toggleTheme}>
                {darkMode ? '🌙' : '☀️'}
            </div>
            <h1>Online Radio</h1>
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
            <Footer /> {/* Add the Footer component */}
        </div>
    );
};

export default App;
