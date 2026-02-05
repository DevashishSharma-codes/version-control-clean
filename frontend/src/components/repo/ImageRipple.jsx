// // src/components/ImageRipple/ImageRipple.jsx

// import React, { useRef } from 'react'
// import { Canvas, useFrame, useLoader } from '@react-three/fiber'
// import { TextureLoader, Vector2 } from 'three'
// import { shaderMaterial } from '@react-three/drei'
// import { extend } from '@react-three/fiber'

// // --- NEW SHADER ---
// // This shader creates a single, contained "water drop" distortion
// const fragmentShader = `
//   precision highp float;

//   varying vec2 vUv;
//   uniform sampler2D uTexture;
//   uniform vec2 uMouse;
//   uniform float uVelocity; // We now control the effect with mouse velocity

//   void main() {
//     vec2 uv = vUv;
    
//     // Calculate the distance from the current pixel to the mouse
//     float distanceToMouse = distance(uv, uMouse);

//     // Create a circular mask for our effect. 
//     // smoothstep creates a soft edge. The radius of the effect is 0.15.
//     float effectStrength = 1.0 - smoothstep(0.0, 0.15, distanceToMouse);
    
//     // The direction to displace the pixels is away from the mouse center
//     vec2 displacementDirection = normalize(uv - uMouse);
    
//     // Calculate the final displacement. 
//     // It's strongest at the center and fades out.
//     // CRUCIAL: It's multiplied by uVelocity, so it's 0 when the mouse is still.
//     vec2 displacement = displacementDirection * effectStrength * uVelocity * 0.2; // 0.2 is max strength
    
//     // Apply the displacement to the texture coordinates
//     vec2 distortedUv = uv + displacement;
    
//     vec4 color = texture2D(uTexture, distortedUv);
//     gl_FragColor = color;
//   }
// `

// const vertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `

// const RippleMaterial = shaderMaterial(
//   {
//     uTime: 0,
//     uMouse: new Vector2(0, 0),
//     uTexture: null,
//     uVelocity: 0.0, // The new uniform for mouse speed
//   },
//   vertexShader,
//   fragmentShader
// )

// extend({ RippleMaterial })

// function RippleScene() {
//   const materialRef = useRef();
//   const lastMousePos = useRef(new Vector2(0, 0));
//   const currentVelocity = useRef(0);

//   const texture = useLoader(TextureLoader, '/bg5.jpg'); // Ensure your image is in /public

//   useFrame(() => {
//     // Calculate the distance the mouse has moved since the last frame
//     const currentMousePos = materialRef.current.uniforms.uMouse.value;
//     const speed = currentMousePos.distanceTo(lastMousePos.current);

//     // Use the calculated speed to set the velocity, but smoothly
//     // This creates a nice "wake" effect that fades out
//     currentVelocity.current = Math.min(1.0, currentVelocity.current * 0.98 + speed * 1.5);
    
//     materialRef.current.uniforms.uVelocity.value = currentVelocity.current;
    
//     // Update the last mouse position for the next frame
//     lastMousePos.current.copy(currentMousePos);
//   });
  
//   return (
//     <mesh 
//       onPointerMove={(e) => {
//         if(e.uv) {
//           // Update the mouse uniform directly
//           materialRef.current.uniforms.uMouse.value.set(e.uv.x, 1.0 - e.uv.y);
//         }
//       }}
//     >
//       <planeGeometry args={[10, 6]} /> 
//       <rippleMaterial ref={materialRef} uTexture={texture} />
//     </mesh>
//   )
// }

// export default function ImageRipple() {
//   return (
//     <div className="image-ripple-canvas">
//       <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
//         <RippleScene />
//       </Canvas>
//     </div>
//   )
// }