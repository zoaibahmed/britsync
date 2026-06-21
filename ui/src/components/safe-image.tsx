"use client";

import React, { useState } from 'react';

interface SafeImageProps {
    src: string;
    alt: string;
    className?: string;
    fallbackSrc?: string;
}

export default function SafeImage({ 
    src, 
    alt, 
    className = "", 
    fallbackSrc = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
}: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
