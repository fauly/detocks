import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SphereData {
    [key: string]: any;
}
  
interface ChatWorldProps {
    data: SphereData[];
}   

const ChatWorld: React.FC<ChatWorldProps> = ({ data }) => {
    const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current.appendChild(renderer.domElement);

    data.forEach(item => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.set(item['3dVector'].x, item['3dVector'].y, item['3dVector'].z);
      scene.add(sphere);
    });

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, [data]);

  return <div ref={ref} />;
};

export default ChatWorld;
