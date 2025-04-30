"use client";
import React from "react";
import { motion } from "framer-motion";

export const Spotlight = ({
    gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
    gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
    gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
    translateY = 0,
    width = 800,
    height = 800,
    smallWidth = 400,
    duration = 7,
    xOffset = 100
} = {}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 1.5,
            }}
            className="pointer-events-none absolute inset-0 h-full w-full flex items-center justify-center">
            <motion.div
                animate={{
                    x: [0, xOffset, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute w-screen h-screen z-40 pointer-events-none flex items-center justify-center">
                <div
                    style={{
                        transform: `translateY(${translateY}px) rotate(-45deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute`} />

                <div
                    style={{
                        transform: "rotate(-45deg) translate(5%, -5%)",
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute`} />

                <div
                    style={{
                        transform: "rotate(-45deg) translate(-5%, 5%)",
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute`} />
            </motion.div>
            <motion.div
                animate={{
                    x: [0, -xOffset, 0],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                }}
                className="absolute w-screen h-screen z-40 pointer-events-none flex items-center justify-center">
                <div
                    style={{
                        transform: `translateY(${translateY}px) rotate(45deg)`,
                        background: gradientFirst,
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute`} />

                <div
                    style={{
                        transform: "rotate(45deg) translate(-5%, -5%)",
                        background: gradientSecond,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute`} />

                <div
                    style={{
                        transform: "rotate(45deg) translate(5%, 5%)",
                        background: gradientThird,
                        width: `${smallWidth}px`,
                        height: `${height}px`,
                    }}
                    className={`absolute`} />
            </motion.div>
        </motion.div>
    );
}; 