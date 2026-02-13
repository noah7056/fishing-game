import React, { useEffect, useState, useRef } from 'react';
import './TutorialOverlay.css';

const TutorialOverlay = ({ step, onNext, onSkip, onDisable, onLanguageChange, language, t, stepsConfig }) => {
    const [targetRect, setTargetRect] = useState(null);
    const [visible, setVisible] = useState(false);

    const currentStep = stepsConfig[step];

    useEffect(() => {
        if (!currentStep) {
            setVisible(false);
            return;
        }

        const updatePosition = () => {
            const target = currentStep.target ? document.querySelector(currentStep.target) : null;

            if (target) {
                const rect = target.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
                setVisible(true);
            } else if (currentStep.target === 'center') {
                // Special case for center screen
                setTargetRect({
                    top: window.innerHeight / 2 - 100, // Approximate center area
                    left: window.innerWidth / 2 - 100,
                    width: 200,
                    height: 200
                });
                setVisible(true);
            } else {
                // If target not found, maybe retry or hide
                // For now, let's retry a few times or use interval
            }
        };

        updatePosition();

        // Poll for position changes (e.g. if element appears/moves)
        const interval = setInterval(updatePosition, 100);

        window.addEventListener('resize', updatePosition);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', updatePosition);
        };
    }, [step, currentStep]);

    if (!visible || !currentStep) return null;

    // Calculate popup position
    const popupStyle = {};
    const offset = 20;

    if (targetRect) {
        if (currentStep.placement === 'right') {
            popupStyle.left = targetRect.left + targetRect.width + offset;
            popupStyle.top = targetRect.top + targetRect.height / 2 - 50; // Centered roughly
        } else if (currentStep.placement === 'left') {
            popupStyle.left = targetRect.left - 260 - offset; // 260 is approx width
            popupStyle.top = targetRect.top + targetRect.height / 2 - 50;
        } else if (currentStep.placement === 'top') {
            popupStyle.top = targetRect.top - 150 - offset;
            popupStyle.left = targetRect.left + targetRect.width / 2 - 125;
        } else if (currentStep.placement === 'bottom') {
            popupStyle.top = targetRect.top + targetRect.height + offset;
            popupStyle.left = targetRect.left + targetRect.width / 2 - 125;
        } else {
            // Default center/bottom
            popupStyle.top = targetRect.top + targetRect.height + offset;
            popupStyle.left = targetRect.left;
        }
    }

    // Spotlight style
    const spotlightStyle = targetRect ? {
        top: targetRect.top - 10,
        left: targetRect.left - 10,
        width: targetRect.width + 20,
        height: targetRect.height + 20,
        borderRadius: currentStep.shape === 'rect' ? '12px' : '50%'
    } : {};

    return (
        <div className="tutorial-overlay">
            {/* Spotlight Hole */}
            <div className="tutorial-spotlight" style={spotlightStyle}></div>

            {/* Popup */}
            <div
                className={`tutorial-popup ${currentStep.placement || 'bottom'}`}
                style={popupStyle}
            >
                <div className="tutorial-content">
                    {currentStep.content}
                </div>
                <div className="tutorial-actions">
                    {currentStep.showNext && (
                        <button className="tutorial-btn" onClick={onNext}>
                            {currentStep.nextLabel || t.TUTORIAL_NEXT}
                        </button>
                    )}
                </div>
            </div>

            {/* Global Controls */}
            <div className="tutorial-controls">
                <button className="tutorial-control-btn lang-cycle-btn" onClick={onLanguageChange}>
                    🌐 {language.toUpperCase()}
                </button>
                <button className="tutorial-control-btn" onClick={onSkip}>{t.TUTORIAL_SKIP}</button>
                <button className="tutorial-control-btn" onClick={onDisable}>{t.TUTORIAL_HIDE}</button>
            </div>
        </div>
    );
};

export default TutorialOverlay;
