import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/all';
import './emoji.css';

// Register the plugins
gsap.registerPlugin(Draggable);

const EmojiSlider = ({ onChange, emojis = ['😔', '😐', '😊', '😄', '🤩'] }) => {
    const [currentEmoji, setCurrentEmoji] = useState(emojis[2]); // Start with middle emoji
    const sliderRef = useRef(null);
    const dragRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!sliderRef.current || !dragRef.current || !containerRef.current) return;

        const drag = dragRef.current;
        const slider = sliderRef.current;
        const container = containerRef.current;
        const sliderWidth = slider.offsetWidth;

        const updateEmoji = (progress) => {
            // Convert progress (0-100) to emoji index (0-4)
            const index = Math.min(Math.max(Math.round((progress / 100) * 4), 0), 4);
            const emoji = emojis[index];
            setCurrentEmoji(emoji);
            onChange?.(emoji, progress);
        };

        Draggable.create(drag, {
            type: 'x',
            bounds: slider,
            inertia: true,
            onDrag: function() {
                const progress = ((this.x + sliderWidth / 2) / sliderWidth) * 100;
                updateEmoji(progress);
            },
            onDragEnd: function() {
                const progress = ((this.x + sliderWidth / 2) / sliderWidth) * 100;
                updateEmoji(progress);
                
                // Snap to closest position
                const snapProgress = Math.round(progress / 25) * 25;
                gsap.to(drag, {
                    x: (snapProgress / 100) * sliderWidth - sliderWidth / 2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        // Create emoji markers
        emojis.forEach((emoji, index) => {
            const marker = document.createElement('div');
            marker.className = 'emoji-marker';
            marker.textContent = emoji;
            marker.style.left = `${(index / 4) * 100}%`;
            container.querySelector('.emoji-track').appendChild(marker);
        });

        return () => {
            // Cleanup draggable instance
            const instance = Draggable.get(drag);
            if (instance) {
                instance.kill();
            }
        };
    }, [emojis, onChange]);

    return (
        <div className="emoji-slider-container" ref={containerRef}>
            <div className="emoji-track"></div>
            <div className="slider" ref={sliderRef}>
                <div className="drag" ref={dragRef}>
                    <div className="current-emoji">{currentEmoji}</div>
                </div>
            </div>
        </div>
    );
};

export default EmojiSlider;