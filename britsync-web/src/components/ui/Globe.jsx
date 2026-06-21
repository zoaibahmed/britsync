import React, { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, Stars, Html, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

// Import textures
import earthMap from "../../assets/globe/earth_map.png";
import earthClouds from "../../assets/globe/earth_clouds.png";

const locations = [
    { city: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
    { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
    { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
    { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
    { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
    { city: "Mogadishu", country: "Somalia", lat: 2.0469, lng: 45.3182 },
    { city: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
    { city: "Islamabad", country: "Pakistan", lat: 33.6844, lng: 73.0479 },
    { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 }
];

function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
}

// Data Arc Component with subtle glow
function DataArc({ start, end, color }) {
    const curve = useMemo(() => {
        const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2.3);
        return new THREE.QuadraticBezierCurve3(start, mid, end);
    }, [start, end]);

    const points = useMemo(() => curve.getPoints(50), [curve]);

    return (
        <line>
            <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(points)} />
            <lineBasicMaterial attach="material" color={color} transparent opacity={0.4} linewidth={1} />
        </line>
    );
}

// God-Tier Location Marker
function LocationMarker({ loc, isDark, pinColor }) {
    const [hovered, setHovered] = useState(false);
    const pos = useMemo(() => latLongToVector3(loc.lat, loc.lng, 2.06), [loc]);

    return (
        <group position={pos}>
            {/* Small Refined Pin Head (Torus) - Now theme-consistent */}
            <mesh pointerEvents="none" position={[0, 0.08, 0]}>
                <torusGeometry args={[0.025, 0.012, 12, 24]} />
                <meshStandardMaterial
                    color={pinColor}
                    emissive={pinColor}
                    emissiveIntensity={hovered ? 1.5 : 0.8}
                    toneMapped={false}
                />
            </mesh>

            {/* Small Refined Pin Needle (Cone) */}
            <mesh pointerEvents="none" position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.012, 0.1, 12]} />
                <meshStandardMaterial
                    color={pinColor}
                    emissive={pinColor}
                    emissiveIntensity={hovered ? 0.8 : 0.3}
                />
            </mesh>

            {/* Pulsing Aura */}
            <mesh pointerEvents="none">
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={pinColor} transparent opacity={hovered ? 0.3 : 0.1} />
            </mesh>

            {/* Interaction Hit-Box (Invisible but large) */}
            <mesh
                onPointerEnter={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerLeave={() => {
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} visible={false} />
            </mesh>

            {/* Label Pop-up */}
            {hovered && (
                <Html center distanceFactor={10}>
                    <div style={{
                        padding: '12px 20px',
                        background: isDark ? 'rgba(5, 10, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                        color: isDark ? '#fff' : '#000',
                        borderRadius: '14px',
                        fontSize: '12px',
                        backdropFilter: 'blur(20px)',
                        transform: 'translateY(-55px) scale(1)',
                        border: `1px solid ${isDark ? 'rgba(77, 171, 255, 0.5)' : 'rgba(0,0,0,0.1)'}`,
                        boxShadow: isDark ? '0 15px 40px rgba(0,191,255,0.4)' : '0 10px 30px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none'
                    }}>
                        <style>{`
                            @keyframes popIn {
                                0% { opacity: 0; transform: translateY(-40px) scale(0.5); }
                                100% { opacity: 1; transform: translateY(-55px) scale(1); }
                            }
                        `}</style>
                        <span style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>{loc.city}</span>
                        <span style={{ opacity: 0.6, fontSize: '10px', fontWeight: '700' }}>{loc.country}</span>
                        <div style={{
                            position: 'absolute',
                            bottom: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%) rotate(45deg)',
                            width: '12px',
                            height: '12px',
                            background: isDark ? 'rgba(5, 10, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                            borderBottom: `1px solid ${isDark ? 'rgba(77, 171, 255, 0.5)' : 'rgba(0,0,0,0.1)'}`,
                            borderRight: `1px solid ${isDark ? 'rgba(77, 171, 255, 0.5)' : 'rgba(0,0,0,0.1)'}`,
                        }} />
                    </div>
                </Html>
            )}
        </group>
    );
}

function PremiumGlobe({ isDark, primaryColor, pinColor }) {
    const groupRef = useRef();
    const cloudsRef = useRef();
    const gridRef = useRef();

    const [colorMap, cloudsMap] = useLoader(THREE.TextureLoader, [earthMap, earthClouds]);

    const dots = useMemo(() => {
        const pts = [];
        const radius = 2.02;
        const count = 10000;
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            pts.push(radius * Math.cos(theta) * Math.sin(phi));
            pts.push(radius * Math.sin(theta) * Math.sin(phi));
            pts.push(radius * Math.cos(phi));
        }
        return new Float32Array(pts);
    }, []);

    const scrollPos = useRef(0);
    useEffect(() => {
        const handleScroll = () => {
            scrollPos.current = window.scrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame(({ mouse, clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) {
            const sRot = scrollPos.current * 0.0005;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.05 + sRot, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.05, 0.05);
        }
        if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.07;
        if (gridRef.current) gridRef.current.rotation.y = t * 0.02;
    });

    return (
        <group ref={groupRef}>
            {/* Premium Glassy Core - Solid and visible in light mode */}
            <Sphere args={[1.98, 64, 64]} raycast={() => null}>
                <meshPhysicalMaterial
                    color={isDark ? "#050a1a" : "#a5d4ff"}
                    roughness={isDark ? 0.9 : 0.15}
                    metalness={isDark ? 0.2 : 0.3}
                    transmission={isDark ? 0 : 0}
                    thickness={0}
                    transparent={isDark}
                    opacity={isDark ? 0.95 : 1.0}
                />
            </Sphere>

            {/* Earth Texture - High contrast in light mode using original map */}
            <Sphere args={[2.0, 64, 64]} raycast={() => null}>
                <meshStandardMaterial
                    map={colorMap}
                    transparent
                    opacity={isDark ? 0.8 : 1.0}
                    emissive={isDark ? primaryColor : "#0055ff"}
                    emissiveIntensity={isDark ? 3.0 : 1.5}
                    emissiveMap={colorMap}
                    metalness={isDark ? 0.2 : 0.2}
                    roughness={isDark ? 0.8 : 0.15}
                    color="#ffffff"
                />
            </Sphere>

            {/* Clouds */}
            <Sphere ref={cloudsRef} args={[2.05, 64, 64]} raycast={() => null}>
                <meshStandardMaterial alphaMap={cloudsMap} transparent opacity={isDark ? 0.2 : 0.4} depthWrite={false} />
            </Sphere>

            {/* Particle Surface */}
            <points pointerEvents="none" raycast={() => null}>
                <bufferGeometry>
                    <bufferAttribute attach="position" array={dots} count={dots.length / 3} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.015}
                    color={primaryColor}
                    transparent
                    opacity={isDark ? 0.4 : 0.3}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Technical Grid Overlay */}
            <Sphere ref={gridRef} args={[2.1, 32, 32]} raycast={() => null}>
                <meshBasicMaterial
                    color={primaryColor}
                    wireframe
                    transparent
                    opacity={isDark ? 0.05 : 0.15}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>

            {/* Locations & Arcs */}
            {locations.map((loc, i) => {
                const startPos = latLongToVector3(loc.lat, loc.lng, 2.06);
                return (
                    <group key={i}>
                        <LocationMarker loc={loc} isDark={isDark} pinColor={pinColor} />
                        {/* Connected Data Arcs for both modes */}
                        {i < locations.length - 1 && (
                            <DataArc
                                start={startPos}
                                end={latLongToVector3(locations[i + 1].lat, locations[i + 1].lng, 2.06)}
                                color={primaryColor}
                            />
                        )}
                    </group>
                );
            })}

            {/* Volumetric Atmosphere Glow */}
            <Sphere args={[2.15, 64, 64]} raycast={() => null}>
                <meshPhongMaterial
                    color={primaryColor}
                    transparent
                    opacity={isDark ? 0.1 : 0.25}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
        </group>
    );
}


const Globe = () => {
    const themeContext = useTheme();
    const isDark = themeContext ? themeContext.theme === 'dark' : true;
    const primaryColor = isDark ? "#00f2ff" : "#00aaff";
    const pinColor = isDark ? primaryColor : "#ff0000"; // Vibrant Red for Light Mode visibility

    return (
        <div className="globe-canvas-wrapper" style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative', background: 'transparent' }}>
            <Canvas
                camera={{ position: [0, 0, 7], fov: 38 }}
                gl={{ antialias: true, alpha: true }}
                onPointerMissed={() => (document.body.style.cursor = 'auto')}
            >
                <ambientLight intensity={isDark ? 0.8 : 2.5} />
                <pointLight position={[10, 10, 10]} intensity={isDark ? 3 : 8} color={isDark ? "#ffffff" : "#f0f9ff"} />
                <pointLight position={[-10, -10, 10]} intensity={isDark ? 1 : 5} color={primaryColor} />
                <directionalLight position={[5, 10, 5]} intensity={isDark ? 2 : 4} color="#ffffff" />

                <Suspense fallback={null}>
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
                        <PremiumGlobe isDark={isDark} primaryColor={primaryColor} pinColor={pinColor} />
                    </Float>
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.5}
                    dampingFactor={0.1}
                    enableDamping
                />
            </Canvas>
        </div>
    );
};

export default Globe;
