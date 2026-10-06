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
          background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), visibility 1s ease-out',
          opacity: isReady ? 0 : 1,
          visibility: fadeComplete ? 'hidden' : 'visible',
          perspective: '1000px'
        }}
      >
        {/* Animated Background Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Glassmorphism Card */}
        <div className="glass-card">
          <div className="glass-shine" />
          
          <div style={{ marginBottom: 35, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Logo */}
            <div className="logo-container">
              <img src="/logo.png" alt="EduTrack Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }} />
            </div>

            <h1 className="brand-title">
              EduTrack
            </h1>
            <p className="subtitle">
              Waking up cloud servers<span className="dot-anim">...</span>
            </p>
          </div>

          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="progress-text">
            {progress}<span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>%</span>
          </div>
          
          {progress > 80 && (
            <p className="optimizing-text">Optimizing database connections...</p>
          )}
        </div>
      </div>
      
      {/* Pre-render children underneath */}
      <div style={{ visibility: isReady ? 'visible' : 'hidden', height: '100%', width: '100%', position: 'absolute', inset: 0 }}>
        {children}
      </div>

      <style>{`
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: floatOrb 10s ease-in-out infinite;
        }
        .orb-1 { width: 350px; height: 350px; background: #3b82f6; top: 15%; left: 15%; animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: 10%; right: 15%; animation-delay: -3s; animation-direction: reverse; }
        .orb-3 { width: 250px; height: 250px; background: #ec4899; top: 40%; left: 50%; animation-delay: -6s; opacity: 0.15; }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 50px 50px;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          animation: cardEntrance 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(40px) scale(0.95) rotateX(10deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
        }

        .glass-shine {
          position: absolute;
          top: 0; left: -100%; right: 0; height: 100%; width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: skewX(-20deg);
          animation: shine 4s infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        .logo-container {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 20px;
          animation: pulseLogo 3s ease-in-out infinite;
        }

        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
        }

        .brand-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #94a3b8;
          margin: 0;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
        }

        .progress-track {
          width: 320px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 20px;
          height: 8px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          background-size: 200% 100%;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 20px;
          animation: gradientShift 2s linear infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        .progress-text {
          margin-top: 24px;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .optimizing-text {
          color: #3b82f6;
          font-size: 0.9rem;
          margin-top: 15px;
          opacity: 0;
          animation: fadeInOut 2s infinite;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
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
