import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaRocket } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#F5F5DC] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-[#4A3728] font-bold text-xl hover:text-[#3E2723] transition-colors">
              <FaRocket className="text-2xl" />
              <span>Prashikshan</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/guest/about"
              className="px-4 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/guest/rules"
              className="px-4 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors font-medium"
            >
              Rules
            </Link>
            <Link
              href="/guest/resources"
              className="px-4 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors font-medium"
            >
              Resources
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#4A3728] text-white rounded-lg hover:bg-[#3E2723] transition-colors font-medium"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#4A3728] hover:text-[#3E2723] focus:outline-none"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-[#4A3728]/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/guest/about"
              className="block px-3 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/guest/rules"
              className="block px-3 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Rules
            </Link>
            <Link
              href="/guest/resources"
              className="block px-3 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 text-[#4A3728] hover:text-[#3E2723] hover:bg-[#4A3728]/10 rounded-lg transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-3 py-2 bg-[#4A3728] text-white rounded-lg hover:bg-[#3E2723] transition-colors font-medium text-center"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
