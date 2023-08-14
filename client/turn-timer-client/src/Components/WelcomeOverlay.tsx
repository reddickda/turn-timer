import { useState, useEffect } from 'react';

import './WelcomeOverlay.css'

export function WelcomeOverlay() {
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowOverlay(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{display: showOverlay ? 'flex' : 'none'}} className={`welcome-overlay ${showOverlay ? 'show' : ''}`}>
            <div className="welcome-message">
                <h1>Loading Turn Timer...</h1>
            </div>
            <div className="growing-react-icon"></div>
        </div>
    );
}