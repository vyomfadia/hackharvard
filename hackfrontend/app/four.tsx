import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Graph3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Set up the scene
    const scene = new THREE.Scene();

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Create axis lines to represent the graph
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Plot points (3D plantar pressure graph)
    const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Create random points to simulate plantar pressure distribution
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 10; // Random x position within the foot area
      const y = 0; // Foot pressure points lie on the ground plane
      const z = (Math.random() - 0.5) * 10; // Random z position within the foot area
      const pressure = Math.random() * 2; // Random pressure magnitude

      const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
      pointMesh.scale.set(pressure, pressure, pressure); // Scale point based on pressure magnitude
      pointMesh.position.set(x, y, z);
      scene.add(pointMesh);
    }

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Clean up the renderer on component unmount
    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
}

// Usage
// Import and use the <Graph3D /> component in a page, such as in pages/index.js
// import Graph3D from '../components/Graph3D';
// export default function HomePage() {
//   return <Graph3D />;
// }