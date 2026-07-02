import React from "react";
import { FaPlay, FaLock, FaRedo } from "react-icons/fa";

const ActionButton = ({ status, accent, light, remainingAttempts, onStart, onResume, onAttemptAgain, size = "md" }) => {

    const padding = size === "sm"
        ? "px-4 h-9 text-xs"
        : "px-5 h-11 text-sm";

    if (status === "Not Attempted") {
        return (
            <button
                onClick={onStart}
                className={`flex items-center gap-2 rounded-xl text-white font-bold hover:opacity-90 transition ${padding}`}
                style={{ background: accent }}
            >
                <FaPlay className="text-[10px]" />
                Start Quiz
            </button>
        );
    }

    if (status === "In Progress") {
        return (
            <button
                onClick={onResume}
                className={`flex items-center gap-2 rounded-xl text-white font-bold hover:opacity-90 transition ${padding}`}
                style={{ background: accent }}
            >
                <FaPlay className="text-[10px]" />
                Resume Quiz
            </button>
        );
    }

    if (status === "Completed") {
        if (remainingAttempts === 0) {
            return (
                <button
                    disabled
                    className={`flex items-center gap-2 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed ${padding}`}
                >
                    <FaLock className="text-[10px]" />
                    Max Attempts Reached
                </button>
            );
        }

        return (
            <button
                onClick={onAttemptAgain}
                className={`flex items-center gap-2 rounded-xl font-bold border-2 hover:opacity-80 transition ${padding}`}
                style={{
                    borderColor: accent,
                    color: accent,
                    background: light
                }}
            >
                <FaRedo className="text-[10px]" />
                Attempt Again
            </button>
        );
    }

    return (
        <button
            disabled
            className={`flex items-center gap-2 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed ${padding}`}
        >
            <FaLock className="text-[10px]" />
            Locked
        </button>
    );
};

export default ActionButton;