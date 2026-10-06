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
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s ease-out',
          opacity: isReady ? 0 : 1,
          visibility: fadeComplete ? 'hidden' : 'visible'
        }}
      >
        {/* Animated Background Orbs */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: '#3b82f6', filter: 'blur(100px)', borderRadius: '50%', opacity: 0.2, top: '20%', left: '20%', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: '#8b5cf6', filter: 'blur(120px)', borderRadius: '50%', opacity: 0.15, bottom: '10%', right: '15%', animation: 'float 8s ease-in-out infinite reverse' }} />

        {/* Glassmorphism Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '50px 40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Card subtle shine */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
          
          <div style={{ marginBottom: 35, textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EduTrack
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem', letterSpacing: '0.2px', fontWeight: 400 }}>
              Waking up cloud servers<span className="dot-anim">...</span>
            </p>
          </div>

          <div style={{ width: '280px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '20px', height: '6px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div 
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '20px'
              }}
            />
          </div>
          
          <div style={{ marginTop: 24, fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>
            {progress}<span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>%</span>
          </div>
        </div>
      </div>
      
      {/* Pre-render children underneath so they are fully loaded and ready when the loader fades out */}
      <div style={{ visibility: isReady ? 'visible' : 'hidden', height: '100%', width: '100%', position: 'absolute', inset: 0 }}>
        {children}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-20px) }
          100% { transform: translateY(0px) }
        }
        .dot-anim { animation: ellipsis 1.5s infinite; }
        @keyframes ellipsis {
          0% { opacity: 0 }
          50% { opacity: 1 }
          100% { opacity: 0 }
        }
      `}</style>
    </>
  );
}
