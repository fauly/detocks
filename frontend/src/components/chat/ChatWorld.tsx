import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import io from 'socket.io-client';

interface SphereData {
    [key: string]: any;
}
  
interface ChatWorldProps {
    data: SphereData[];
}   

const reactServer = process.env.REACT_SERVER || 'https://localhost:5000';


const ChatWorld: React.FC<ChatWorldProps> = ({ data }) => {
  const [spheres, setSpheres] = useState<SphereData[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to the server
    const socket = io(reactServer);

    // Fetch the initial data
    fetch('/api/spheres')
      .then(response => response.json())
      .then(data => setSpheres(data));

    // Listen for new messages
    socket.on('chat message', (msg) => {
      // Update the state
      setSpheres(spheres => [...spheres, msg]);
    });

    // Other code...

  }, [data]);

  return <div ref={ref} />;
};

export default ChatWorld;
