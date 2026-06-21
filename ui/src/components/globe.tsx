"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

const locations = [
    { name: "New York", lat: 40.7128, lng: -74.006, description: "Main HQ" },
    { name: "London", lat: 51.5074, lng: -0.1278, description: "European Hub" },
    { name: "Dubai", lat: 25.2048, lng: 55.2708, description: "Innovation Center" },
];

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
}

function GlobeContent() {
    const globeRef = useRef<THREE.Mesh>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Earth textures (standard placeholder or basic coloring)
    const earthColor = isDark ? "#1a365d" : "#cbd5e1";
    const pinColor = isDark ? "#fbbf24" : "#b91c1c";

    useFrame(({ mouse }) => {
        if (globeRef.current) {
            // Smooth rotation based on mouse movement
            globeRef.current.rotation.y += 0.002; // Constant slow rotation
            globeRef.current.rotation.x = THREE.MathUtils.lerp(
                globeRef.current.rotation.x,
                mouse.y * 0.5,
                0.1
            );
            // Optional: respond to mouse.x as well for secondary rotation
            // globeRef.current.rotation.y = THREE.MathUtils.lerp(globeRef.current.rotation.y, mouse.x * Math.PI, 0.1);
        }
    });

    return (
        <group ref={globeRef}>
            <Sphere args={[2, 64, 64]}>
                <meshPhongMaterial
                    color={earthColor}
                    specular={new THREE.Color(isDark ? "#2d3748" : "#ffffff")}
                    shininess={10}
                    wireframe={true}
                    transparent
                    opacity={0.6}
                />
            </Sphere>

            {/* Adding an inner solid sphere for better depth */}
            <Sphere args={[1.98, 64, 64]}>
                <meshPhongMaterial
                    color={isDark ? "#0f172a" : "#f1f5f9"}
                    transparent
                    opacity={0.8}
                />
            </Sphere>

            {locations.map((loc, i) => {
                const pos = latLongToVector3(loc.lat, loc.lng, 2);
                return (
                    <group key={i} position={pos}>
                        <mesh>
                            <sphereGeometry args={[0.04, 16, 16]} />
                            <meshBasicMaterial color={pinColor} />
                        </mesh>
                        <Html distanceFactor={10}>
                            <div className={`px-2 py-1 rounded-sm border backdrop-blur-md text-[8px] font-bold uppercase tracking-widest pointer-events-none whitespace-nowrap
                                ${isDark ? "bg-black/50 border-white/20 text-white" : "bg-white/50 border-black/20 text-black"}`}>
                                {loc.name}
                            </div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

export function Globe() {
    return (
        <div className="w-full h-[500px] relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <GlobeContent />
            </Canvas>
            <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.3em] font-sans opacity-50">Interact to explore our presence</p>
            </div>
        </div>
    );
}
