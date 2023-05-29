import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

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
    // Fetch the initial data
    fetch('/api/spheres')
      .then(response => response.json())
      .then(data => setSpheres(data));

    // Other code...

  }, [data]);

  return <div ref={ref} />;
};

export default ChatWorld;
