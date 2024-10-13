// components/Cube.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function calculateDistance(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.abs(Math.sqrt(deltaX * deltaX + deltaY * deltaY))**1.4;
}

function interpolateColor(value) {
  // Ensure the value is between 0 and 10
  value = Math.max(0, Math.min(10, value)) * 1.3;

  // Define colors as RGB arrays
  const colors = [
      [0, 0, 255],  // Blue
      [0, 255, 0],  // Green
      [255, 255, 0], // Yellow
      [255, 0, 0]   // Red
  ];

  // Determine the position in the color array
  const index = Math.floor(value / 3.33); // There are three intervals: 0-3.33, 3.34-6.66, 6.67-10
  const nextIndex = Math.min(index + 1, colors.length - 1);
  const ratio = (value - (index * 3.33)) / 3.33; // Calculate the ratio for interpolation

  // Interpolate the RGB values
  const r = Math.round(colors[index][0] + ratio * (colors[nextIndex][0] - colors[index][0]));
  const g = Math.round(colors[index][1] + ratio * (colors[nextIndex][1] - colors[index][1]));
  const b = Math.round(colors[index][2] + ratio * (colors[nextIndex][2] - colors[index][2]));

  // Convert RGB to Hex format
  const toHex = (c) => {
      const hex = c.toString(16).padStart(2, '0'); // Convert to hex and ensure it's two digits
      return hex.toUpperCase(); // Convert to uppercase for standard hex format
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`; // Combine hex values into a single string
}

const Cube = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true; // Enable shadows
    mountRef.current.appendChild(renderer.domElement);

    // Create an ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
    scene.add(ambientLight);

    // Create a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5); // Position the light
    directionalLight.castShadow = true; // Enable shadows for the light
    scene.add(directionalLight);  

    // Create a group to hold the footprint cubes
    const footprintGroup = new THREE.Group();

    // Footprint shape: a simple representation
    const footprintPositions = [
      [0, 0, 0],[1, 0, 0],[2, 0, 0],[3, 0, 0],
      [0, 0, 1],[1, 0, 1],[2, 0, 1],[3, 0, 1],[-1, 0, 1],[4, 0, 1],
      [0, 0, 2],[1, 0, 2],[2, 0, 2],[3, 0, 2],[-1, 0, 2],[4, 0, 2],
      [0, 0, 3],[1, 0, 3],[2, 0, 3],[3, 0, 3],[-1, 0, 3],[4, 0, 3],
      [0, 0, 4],[1, 0, 4],[2, 0, 4],[3, 0, 4],[-1, 0, 4],[4, 0, 4],
      [0, 0, 5],[1, 0, 5],[2, 0, 5],[3, 0, 5],[-1, 0, 5],[4, 0, 5],
      [0, 0, 6],[1, 0, 6],[2, 0, 6],[3, 0, 6],[4, 0, 6],
      [0, 0, 7],[1, 0, 7],[2, 0, 7],[3, 0, 7],[4, 0, 7],[5, 0, 7],
      ,[1, 0, 8],[2, 0, 8],[3, 0, 8],[4, 0, 8],[5, 0, 8],
      [0, 0, 9],[1, 0, 9],[2, 0, 9],[3, 0, 9],[4, 0, 9],[5, 0, 9],
      [0, 0, 10],[1, 0, 10],[2, 0, 10],[3, 0, 10],[4, 0, 10],[5, 0, 10],[6, 0, 10],
      [0, 0, 11],[1, 0, 11],[2, 0, 11],[3, 0, 11],[4, 0, 11],[5, 0, 11],[-1, 0, 11],[6, 0, 11],
      [0, 0, 12],[1, 0, 12],[2, 0, 12],[3, 0, 12],[4, 0, 12],[5, 0, 12],[-1, 0, 12],[-2, 0, 12],[6, 0, 12],
      [0, 0, 13],[1, 0, 13],[2, 0, 13],[3, 0, 13],[4, 0, 13],[5, 0, 13],[-1, 0, 13],[-2, 0, 13],[6, 0, 13],
      [0, 0, 14],[1, 0, 14],[2, 0, 14],[3, 0, 14],[4, 0, 14],[5, 0, 14],[-1, 0, 14],[-2, 0, 14],
      [0, 0, 15],[1, 0, 15],[2, 0, 15],[3, 0, 15],[4, 0, 15],[-1, 0, 15],
      [0, 0, 16],[1, 0, 16],[2, 0, 16],[3, 0, 16],
    ];

    

    // Create cubes for each position
    footprintPositions.forEach(position => {

      const height = (Math.max(10 - calculateDistance(0, 12, position[0], position[2]), 0 ) * 0.2) + (Math.max(5 - calculateDistance(5, 11, position[0], position[2]), 0 ) * 0.4) + (Math.max(10 - calculateDistance(1,2, position[0], position[2]), 0 ) * 0.25);
      const geometry = new THREE.BoxGeometry(1, 0.1 + height, 1);
      const material = new THREE.MeshToonMaterial({ color: interpolateColor(height * 3) }); // Cyan color
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(position[0]+4, (height / 2) + 4, position[2] - 7);
      cube.castShadow = true; // Enable shadows for the cubes
      footprintGroup.add(cube);

      
      const cube2 = new THREE.Mesh(geometry, material);
      cube2.position.set(-(position[0]+4), (height / 2) + 4, position[2] - 7);
      cube2.castShadow = true; // Enable shadows for the cubes
      footprintGroup.add(cube2);
    });

    scene.add(footprintGroup);

    // Set the initial camera position
    camera.position.set(0, 10, 30);

    // Create OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true; // allow zooming
    controls.enablePan = true; // allow panning

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the camera around the footprint group
      const time = Date.now() * 0.0007; // Get current time for smooth rotation
      camera.position.x = Math.sin(time) * 20; // Circular motion on X axis
      camera.position.z = Math.cos(time) * 20; // Circular motion on Z axis
      camera.lookAt(footprintGroup.position); // Keep the camera looking at the footprint group

      controls.update(); // Update the controls in the animation loop
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      controls.dispose(); // Clean up the controls
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh', background: 'transparent' }} />;
};

export default Cube;
