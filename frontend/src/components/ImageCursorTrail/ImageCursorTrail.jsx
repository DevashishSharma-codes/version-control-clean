import React from 'react';
import { motion, useMotionValue, useSpring, transform } from 'framer-motion';
import './ImageCursorTrail.css';

// This is the main component with the corrected logic
const ImageCursorTrail = ({
  items,
  children,
  distance = 25,
  maxNumberOfImages = 5,
  imgClass = "",
  className = "",
}) => {
  // Create motion values to track the cursor's x and y position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // This function updates the cursor position
  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div
      className={`image-cursor-trail-wrapper ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div className="image-container">
        {items.slice(0, maxNumberOfImages).map((item, index) => (
          <Follower
            key={index}
            mouseX={mouseX}
            mouseY={mouseY}
            imageUrl={item}
            imgClass={imgClass}
            index={index}
            maxImages={maxNumberOfImages}
          />
        ))}
      </div>
      <div className="content-container">{children}</div>
    </div>
  );
};

// This is a helper component for each individual image in the trail
const Follower = ({ mouseX, mouseY, imageUrl, imgClass, index, maxImages }) => {
  // Use the useSpring hook for a smooth, lagging animation
  const x = useSpring(mouseX, { damping: 20, stiffness: 150 - index * 20 });
  const y = useSpring(mouseY, { damping: 20, stiffness: 150 - index * 20 });

  return (
    <motion.img
      src={imageUrl}
      alt="Cursor trail image"
      className={`trail-image ${imgClass}`}
      style={{
        x,
        y,
        // Adjust transform origin so images don't jump on first move
        transformOrigin: "center center",
        // Apply scaling and rotation based on index
        scale: transform(index, [0, maxImages], [1, 0.5]),
        rotate: transform(index, [0, maxImages], [0, 15 * (index % 2 === 0 ? -1 : 1)]),
      }}
    />
  );
};

export default ImageCursorTrail;