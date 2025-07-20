import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#C97E2A] text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#B3E0EF]">
              GameStore
            </h3>
            <p className="text-gray-100 mb-4">
              Your daily destination for quiz challenges. Learn, play, and
              compete with exciting rewards every day.
            </p>
            <p className="text-sm text-gray-200">
              © 2025 GameStore. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#B3E0EF]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-100 hover:text-[#B3E0EF] transition duration-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-100 hover:text-[#B3E0EF] transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-100 hover:text-[#B3E0EF] transition duration-300"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#8B5C1B] mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-200 mb-4 md:mb-0">
            Made with ❤️ for quiz enthusiasts worldwide
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-100 hover:text-[#B3E0EF] transition duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </button>
            <button className="text-gray-100 hover:text-[#B3E0EF] transition duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
