import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shaders
const vertexShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    uniform float u_maxExtrusion;

    void main() {

      vec3 newPosition = position;
      if(u_maxExtrusion > 1.0) newPosition.xyz = newPosition.xyz * u_maxExtrusion + sin(u_time);
      else newPosition.xyz = newPosition.xyz * u_maxExtrusion;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    }
  `;

const fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    uniform float u_twinkleSpeed;  // New uniform for twinkle speed

    vec3 colorA = vec3(0.196, 0.631, 0.886);
    vec3 colorB = vec3(0.192, 0.384, 0.498);

    void main() {
      // Apply unique twinkle speed to each dot
      float twinkleFactor = abs(sin(u_time * u_twinkleSpeed)) * 0.5 + 0.5;

      // Mix colors based on the twinkle factor
      vec3 color = mix(colorA, colorB, twinkleFactor);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

const DotShaderComponent = () => {
    // Randomize twinkle speed per dot
  const twinkleSpeed = Math.random() * 5 + 1; // Random speed factor between 1 and 6

  // Uniforms to store u_time and u_maxExtrusion
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Use the useFrame hook to update the time uniform
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value += delta; // Animates u_time based on frame delta
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.1, 6, 6]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[
          {
            side: THREE.DoubleSide,
            uniforms: {
              u_time: { value: 1.0 },
              u_maxExtrusion: { value: 1.0 },
              u_twinkleSpeed: { value: twinkleSpeed },  // Pass the unique twinkle speed to the shader

            },
            vertexShader,
            fragmentShader,
          },
        ]}
      />
    </mesh>
  );
};

export { DotShaderComponent };
