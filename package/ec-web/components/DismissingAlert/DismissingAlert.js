import React, { useEffect } from "react";

export default function DismissingAlert({ children, type, showTimeMs }) {
    const id = Math.floor(Math.random() * 100 + 1);

    useEffect(() => {
        if(showTimeMs)
            setTimeout(() => {
                const notification = document.getElementById(id);
                if (notification) fadeOut(notification, 400);
            }, showTimeMs); 
    });

    useEffect(() => {
        const notification = document.getElementById(id);
        fadeIn(notification, 200);
    });

    const hideNofitication = (e) => {
        e.preventDefault();
        const notification = document.getElementById(id);
        fadeOut(notification, 400);
    };

    const fadeOut = (element, duration) => {
        (function decrement() {
            (element.style.opacity -= 0.1) < 0
                ? element.classList.add("d-none")
                : setTimeout(() => {
                      decrement();
                  }, duration / 10);
        })();
    };

    const fadeIn = (element, duration) => {
        element.classList.remove("d-none");

        (function increment(value = 0) {
            element.style.opacity = String(value);
            if (element.style.opacity !== "1") {
                setTimeout(() => {
                    increment(value + 0.1);
                }, duration / 10);
            }
        })();
    };

    return (
        <div
            className={`alert alert-${type} alert-dismissible fade show container`}
            id={id}
        >
            {children}
            <button type="button" className="close" onClick={hideNofitication}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
}
