"use client";

import { useEffect } from "react";

export default function ScrollLockHandler() {
  useEffect(() => {
    const dropdownMenus = document.querySelectorAll(".has-dropdown");

    const lockScroll = () => {
      document.body.classList.add("scroll-lock");
    };

    const unlockScroll = () => {
      document.body.classList.remove("scroll-lock");
    };

    dropdownMenus.forEach((menu) => {
      menu.addEventListener("mouseenter", lockScroll);
      menu.addEventListener("mouseleave", unlockScroll);
    });

    return () => {
      dropdownMenus.forEach((menu) => {
        menu.removeEventListener("mouseenter", lockScroll);
        menu.removeEventListener("mouseleave", unlockScroll);
      });
    };
  }, []);

  return null;
}