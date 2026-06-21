import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera, MeshWobbleMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';

const SyncRing = ({ radius, speed, color, opacity = 0.2 }) => {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ref.current.rotation.x = t * speed;
        ref.current.rotation.y = t * speed * 0.5;
    });

    return (
        <Torus ref={ref} args={[radius, 0.015, 6, 24]}> {/* Lower segments (6,24 instead of 8,48) */}
            <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} />
        </Torus>
    );
};

const FloatingIcosahedron = ({ position, color, size, speed }) => {
    const ref = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed;
        ref.current.rotation.x = Math.cos(t / 4) / 4;
        ref.current.rotation.y = Math.sin(t / 4) / 4;
        ref.current.position.y = position[2] + Math.sin(t / 1.5) / 5;
    });

    return (
        <mesh position={position} ref={ref}>
            <icosahedronGeometry args={[size, 1]} /> {/* 0 or 1 detail for high speed */}
            <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
        </mesh>
    );
};

const CentralCore = () => {
    const coreRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        coreRef.current.rotation.y = t * 0.3;
        coreRef.current.rotation.z = t * 0.2;
    });

    return (
        <group ref={coreRef}>
            {/* Outer Shell */}
            <mesh>
                <icosahedronGeometry args={[2, 0]} /> {/* Reduced segments from 1 to 0 */}
                <meshBasicMaterial color="#00bfff" wireframe transparent opacity={0.1} />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh>
                <icosahedronGeometry args={[1.2, 0]} />
                <MeshDistortMaterial
                    color="#4f46e5"
                    speed={2}
                    distort={0.2} /* Reduced distortion for performance */
                    radius={1}
                />
            </mesh>

            {/* Core Particles */}
            <Points count={50} />
        </group>
    );
};

const Points = ({ count = 50 }) => {
    const ref = useRef();
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 3 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ref.current.rotation.y = t * 0.1;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial color="#00bfff" size={0.05} transparent opacity={0.6} sizeAttenuation />
        </points>
    );
};

const ThreeDBackground = () => {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.05 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="three-d-bg-container" style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'hidden',
            background: 'transparent'
        }}>
            {isVisible && (
                <Canvas
                    dpr={[1, 2]} /* Optimize for high-DPI */
                    gl={{ antialias: false, powerPreference: "high-performance" }} /* Force performance */
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00bfff" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />

                    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                        <CentralCore />
                        <SyncRing radius={3.5} speed={0.2} color="#00bfff" />
                        <SyncRing radius={4.2} speed={-0.15} color="#4f46e5" opacity={0.15} />
                        <SyncRing radius={4.8} speed={0.1} color="#00bfff" opacity={0.1} />
                    </Float>

                    <fog attach="fog" args={['#030712', 4, 15]} />
                </Canvas>
            )}
        </div>
    );
};

export default React.memo(ThreeDBackground);
