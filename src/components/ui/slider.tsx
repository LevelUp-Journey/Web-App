"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SliderValue = number[];

interface SliderProps
    extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue"> {
    value?: SliderValue;
    defaultValue?: SliderValue;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (value: SliderValue) => void;
}

const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
    (
        {
            className,
            value,
            defaultValue = [0],
            min = 0,
            max = 100,
            step = 1,
            disabled = false,
            onValueChange,
            ...props
        },
        ref,
    ) => {
        const isControlled = Array.isArray(value);
        const controlledValue = React.useMemo(
            () => (isControlled ? (value as number[]) : undefined),
            [isControlled, value],
        );
        const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
            clamp(defaultValue[0] ?? min, min, max),
        );

        const currentValue = clamp(
            controlledValue ? (controlledValue[0] ?? min) : uncontrolledValue,
            min,
            max,
        );

        React.useEffect(() => {
            if (isControlled) {
                setUncontrolledValue(
                    clamp(controlledValue?.[0] ?? min, min, max),
                );
            }
        }, [controlledValue, isControlled, min, max]);

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = clamp(Number(event.target.value), min, max);
            if (!isControlled) {
                setUncontrolledValue(next);
            }
            onValueChange?.([next]);
        };

        const percentage =
            max === min ? 0 : ((currentValue - min) / (max - min)) * 100;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex w-full touch-none select-none items-center",
                    disabled && "cursor-not-allowed opacity-60",
                    className,
                )}
                {...props}
            >
                <div className="relative h-2 w-full rounded-full bg-muted">
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div
                    className={cn(
                        "pointer-events-none absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow ring-offset-background transition",
                        disabled && "border-muted",
                    )}
                    style={{ left: `${percentage}%` }}
                />

                <input
                    type="range"
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                    min={min}
                    max={max}
                    step={step}
                    value={currentValue}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={currentValue}
                />
            </div>
        );
    },
);

Slider.displayName = "Slider";
