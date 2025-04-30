import { cn } from "../utils/cn";
import React from "react";
import { Spotlight } from "./ui/spotlight-new";

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}) => {
    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900",
                className
            )}
            {...props}
        >
            <Spotlight
                gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
                gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
                gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
                translateY={-350}
                width={560}
                height={1380}
                smallWidth={240}
                duration={7}
                xOffset={100}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}; 