// components/Cube.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

    // Create a plane to receive shadows
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Shadow material for the plane
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to make it flat
    plane.position.y = -0.5; // Position it below the cubes
    plane.receiveShadow = true; // Enable plane to receive shadows
    scene.add(plane);

    // Create a group to hold the footprint cubes
    const footprintGroup = new THREE.Group();

    // Footprint shape: a simple representation
    const footprintPositions = [
      [-1, 0, 0], [-0.5, 0, 0], [0, 0, 0], // Base of the foot
      [1, 0, 0], [1.5, 0, 0], // Side of the foot
      [-0.5, 0, -1], [0, 0, -1], [0.5, 0, -1], // Toes
    ];

    // Create cubes for each position
    footprintPositions.forEach(position => {
      const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Cyan color
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(...position);
      cube.castShadow = true; // Enable shadows for the cubes
      footprintGroup.add(cube);
    });

    scene.add(footprintGroup);

    // Set the initial camera position
    camera.position.set(0, 5, 10);

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
      // const time = Date.now() * 0.001; // Get current time for smooth rotation
      // camera.position.x = Math.sin(time) * 10; // Circular motion on X axis
      // camera.position.z = Math.cos(time) * 10; // Circular motion on Z axis
      // camera.lookAt(footprintGroup.position); // Keep the camera looking at the footprint group

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
