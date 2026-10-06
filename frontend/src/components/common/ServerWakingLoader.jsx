import React, { useState, useEffect } from 'react';
import API from '../../services/api';

export default function ServerWakingLoader({ children }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [fadeComplete, setFadeComplete] = useState(false);

  useEffect(() => {
    let intervalId;
    let currentProgress = 0;
    let isComponentMounted = true;

    // Smart Asymptotic Progress Bar Logic
    const incrementProgress = () => {
      if (!isComponentMounted || isReady) return;

      if (currentProgress < 40) {
        currentProgress += Math.random() * 8 + 4; // Fast: 0 -> 40%
      } else if (currentProgress < 70) {
        currentProgress += Math.random() * 3 + 1; // Medium: 40% -> 70%
      } else if (currentProgress < 95) {
        currentProgress += Math.random() * 0.5 + 0.1; // Slow crawl: 70% -> 95%
      }
      
      if (currentProgress >= 95) currentProgress = 95; // Cap at 95% until server responds
      
      setProgress(Math.floor(currentProgress));
    };

    intervalId = setInterval(incrementProgress, 250);

    // Immediate Ping to Backend
    const pingServer = async () => {
      try {
        // Hit a lightweight endpoint to wake the server
        await API.get('/dashboard/ping');
        
        if (!isComponentMounted) return;

        // When backend responds
        clearInterval(intervalId);
        setProgress(100);
        
        // Wait 0.5s for user to register 100%
        setTimeout(() => {
          if (isComponentMounted) {
            setIsReady(true);
            // Wait for fade out animation
            setTimeout(() => {
              if (isComponentMounted) setFadeComplete(true);
            }, 600);
          }
        }, 500);
      } catch (err) {
        // If it's a network error (server still down/waking), keep trying
        // If it's a 4xx/5xx error (CORS, Unauthorized), the server is still awake!
        if (err.response) {
            clearInterval(intervalId);
            setProgress(100);
            setTimeout(() => {
              if (isComponentMounted) {
                setIsReady(true);
                setTimeout(() => {
                  if (isComponentMounted) setFadeComplete(true);
                }, 600);
              }
            }, 500);
        } else {
            if (isComponentMounted) {
                setTimeout(pingServer, 2000);
            }
        }
      }
    };

    // Give it a tiny delay so the UI can paint the 0% state first
    setTimeout(pingServer, 100);

    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
    };
  }, [isReady]);

  if (fadeComplete) return <>{children}</>;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#0f172a',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          transition: 'opacity 0.6s ease-out, visibility 0.6s ease-out',
          opacity: isReady ? 0 : 1,
          visibility: fadeComplete ? 'hidden' : 'visible'
        }}
      >
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '1px', background: 'linear-gradient(90deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EduTrack
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem', letterSpacing: '0.5px' }}>
            Waking up cloud servers...
          </p>
        </div>

        <div style={{ width: '320px', background: '#1e293b', borderRadius: '16px', height: '8px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}>
          <div 
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.8), 0 0 24px rgba(59, 130, 246, 0.5)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '16px'
            }}
          />
        </div>
        
        <div style={{ marginTop: 24, fontSize: '1.75rem', fontWeight: 700, color: '#60a5fa', textShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
          {progress}%
        </div>
      </div>
      
      {/* Pre-render children underneath so they are fully loaded and ready when the loader fades out */}
      <div style={{ visibility: isReady ? 'visible' : 'hidden', height: '100%', width: '100%', position: 'absolute', inset: 0 }}>
        {children}
      </div>
    </>
  );
}
