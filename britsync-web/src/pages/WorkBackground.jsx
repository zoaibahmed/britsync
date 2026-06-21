import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const NeuralCore = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.2;
        meshRef.current.rotation.x = t * 0.1;
        const s = 1 + Math.sin(t * 0.5) * 0.1;
        meshRef.current.scale.set(s, s, s);
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[6, 1]} /> {/* Larger radius (6), fewer segments (1) */}
            <meshBasicMaterial
                color="#00bfff"
                wireframe
                transparent
                opacity={0.3}
            />
        </mesh>
    );
};

const DataRings = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        groupRef.current.rotation.z = t * 0.1;
    });

    return (
        <group ref={groupRef}>
            {[1, 1.2, 1.4].map((scale, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={[scale, scale, scale]}>
                    <torusGeometry args={[12, 0.02, 8, 48]} /> {/* Larger (12), fewer segments */}
                    <meshBasicMaterial color="#00bfff" transparent opacity={0.1} />
                </mesh>
            ))}
        </group>
    );
};

const ParticleField = ({ count = 1200 }) => { /* Reduced from 2000 */
    const points = useRef();

    const [particles] = useMemo(() => {
        const tempParticles = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            tempParticles[i3] = (Math.random() - 0.5) * 60;
            tempParticles[i3 + 1] = (Math.random() - 0.5) * 60;
            tempParticles[i3 + 2] = (Math.random() - 0.5) * 60;
        }
        return [tempParticles];
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (points.current) {
            points.current.rotation.y = time * 0.03;
        }
    });

    return (
        <group>
            <NeuralCore />
            <DataRings />
            <points ref={points}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.length / 3}
                        array={particles}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15} /* Larger points for better fill with fewer count */
                    color="#00bfff"
                    transparent
                    opacity={0.3}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

const GridWaves = ({ isLight }) => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = -10 + Math.sin(t * 0.5) * 0.5;
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
            <planeGeometry args={[100, 100, 20, 20]} /> {/* Reduced segments from 40,40 to 20,20 */}
            <meshBasicMaterial
                color={isLight ? "#00bfff" : "#00bfff"}
                wireframe
                transparent
                opacity={isLight ? 0.25 : 0.08}
            />
        </mesh>
    );
};

const WorkBackground = () => {
    const [isLight, setIsLight] = React.useState(document.documentElement.classList.contains('light'));

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsLight(document.documentElement.classList.contains('light'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const themeColors = {
        fog: isLight ? '#f8fafc' : '#01040a',
        bg: isLight ? 'radial-gradient(circle at center, transparent 0%, rgba(248, 250, 252, 0.45) 100%)' : 'radial-gradient(circle at center, transparent 0%, rgba(1, 4, 10, 0.4) 100%)'
    };

    return (
        <div className="work-3d-bg" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none',
            background: isLight ? '#f8fafc' : '#01040a'
        }}>
            <Canvas
                camera={{ position: [0, 0, 20], fov: 75 }}
                dpr={[1, 2]} /* Optimize for high-DPI without over-rendering */
                gl={{ antialias: false }} /* Disable antialias for significant boost */
            >
                <fog attach="fog" args={[themeColors.fog, 10, 50]} />
                <ambientLight intensity={isLight ? 0.8 : 0.5} />
                <pointLight position={[10, 10, 10]} intensity={isLight ? 1.5 : 1} color="#00bfff" />
                <GridWaves isLight={isLight} />
                <ParticleField isLight={isLight} />
            </Canvas>
            <div className="bg-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: themeColors.bg,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default WorkBackground;
