import React from "react";
import {
  HomeIcon,
  BriefcaseIcon,
  PhotoIcon,
  BookOpenIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid"; // Contoh ikon
import { useNavigate } from "react-router-dom";
import type { ActiveSection } from "../App"; // Impor tipe ActiveSection dari App.tsx

interface NavbarProps {
  activeSection: ActiveSection; // Pastikan ini juga ActiveSection
  // Tipe yang benar untuk fungsi setter dari useState
  setActiveSection: React.Dispatch<React.SetStateAction<ActiveSection>>;
}

const API_BASE_URL = "https://dasewasia.my.id/api/";

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: "home", name: "Home", icon: HomeIcon, path: "/home" },
    {
      id: "portfolio",
      name: "Portfolio",
      icon: BriefcaseIcon,
      path: "/portfolio",
    },
    { id: "gallery", name: "Gallery", icon: PhotoIcon, path: "/gallery" }, // Item baru
    { id: "writings", name: "Writings", icon: BookOpenIcon, path: "/writings" },
    {
      id: "connect",
      name: "Connect",
      icon: PaperAirplaneIcon,
      path: "/connect",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="w-full md:w-64 flex md:flex-col justify-around md:justify-start items-center bg-white dark:bg-gray-800 shadow-lg md:shadow-xl p-4 md:p-6 md:h-screen md:sticky md:top-0 z-20">
      {/* Untuk Desktop: Avatar/Nama di Nav Kiri */}
      <div className="hidden md:block mb-8 text-center">
        <img
          src={`${API_BASE_URL}/img/profilepic/p1`} // Ganti dengan URL avatar Anda
          alt="Avatar"
          className="rounded-full w-24 h-24 object-cover mx-auto mb-3 border-4 border-blue-500"
        />
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          Dasewasia
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">[Freelancer]</p>
      </div>

      <ul className="flex flex-row md:flex-col gap-1 md:gap-4 w-full md:mt-8 justify-around md:justify-start">
        {navItems.map((item) => (
          <li key={item.id} className="w-full">
            <button
              onClick={() => {
                setActiveSection(item.id as ActiveSection),
                  handleNavigation(item.path);
              }}
              className={`flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-4 w-full py-2 px-2 md:px-4 rounded-lg transition-all duration-300
                ${
                  activeSection === item.id
                    ? "bg-blue-500 text-white shadow-md transform scale-105 ring-2 ring-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500"
                }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-sm md:text-base font-medium">
                {item.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
