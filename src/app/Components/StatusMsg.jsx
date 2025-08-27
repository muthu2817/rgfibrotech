"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StatusMessage({ message, type = "success", onClose }) {
  const msgRef = useRef(null);

  useEffect(() => {
    // Slide in
    gsap.fromTo(
      msgRef.current,
      { x: 200, opacity: 0 }, // start off-screen right
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );

    // Slide out after 3s
    const timer = setTimeout(() => {
      gsap.to(msgRef.current, {
        x: 200,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: onClose,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={msgRef}
      className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
}
