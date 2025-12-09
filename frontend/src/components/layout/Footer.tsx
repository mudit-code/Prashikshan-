import Link from 'next/link';
import { FaRocket, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaRocket className="text-2xl text-primary-400" />
              <span className="text-xl font-bold text-white">Prashikshan</span>
            </div>
            <p className="text-sm mb-4">
              Empowering students with the best internship opportunities and career guidance.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <FaMapMarkerAlt className="text-primary-400" />
              <span>India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/guest/about" className="hover:text-primary-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/guest/rules" className="hover:text-primary-400 transition-colors">
                  Rules & Guidelines
                </Link>
              </li>
              <li>
                <Link href="/guest/resources" className="hover:text-primary-400 transition-colors">
                  Learning Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-primary-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary-400 transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary-400 transition-colors">
                  Employer Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-primary-400" />
                <a href="mailto:support@prashikshan.com" className="hover:text-primary-400 transition-colors">
                  support@prashikshan.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-primary-400" />
                <a href="tel:+911234567890" className="hover:text-primary-400 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="#" className="text-sm hover:text-primary-400 transition-colors">
                Helpdesk →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Prashikshan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
