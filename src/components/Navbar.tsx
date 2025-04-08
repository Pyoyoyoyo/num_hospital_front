'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Placeholder Icons (Replace with actual SVGs later if needed)
const Icons = {
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  Hospital: () => <span className="text-xl">🏥</span>,
  Dashboard: () => <span className="text-xl">📊</span>,
  Person: () => <span className="text-xl">👤</span>,
  Admin: () => <span className="text-xl">⚙️</span>,
  Logout: () => <span className="text-xl">🚪</span>,
};

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false); // Close user menu on logout
    setIsDrawerOpen(false); // Close drawer on logout
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  }

  const navigate = (href: string) => {
    router.push(href);
    setIsDrawerOpen(false); // Close drawer on navigation
    setIsUserMenuOpen(false); // Close user menu on navigation
  };

  const navigationItems = [
    { text: 'Нүүр', icon: <Icons.Dashboard />, href: '/dashboard', roles: ['ROLE_USER', 'ROLE_ADMIN'] },
    { text: 'Хэрэглэгчид', icon: <Icons.Person />, href: '/users', roles: ['ROLE_ADMIN'] },
    { text: 'Зөвшөөрлүүд', icon: <Icons.Admin />, href: '/permissions', roles: ['ROLE_ADMIN'] },
  ];

  const filteredNavItems = navigationItems.filter(item =>
    item.roles.some(role => hasRole(role)) || !item.roles.length
  );

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo and Mobile Menu Button */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <div className="md:hidden mr-2">
                <button
                  onClick={toggleDrawer}
                  className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isDrawerOpen}
                >
                  <span className="sr-only">Үндсэн цэс нээх</span>
                  <Icons.Menu />
                </button>
              </div>

              {/* Logo (Visible on all sizes) */}
              <Link href="/dashboard" className="flex-shrink-0 flex items-center text-white no-underline">
                 <Icons.Hospital />
                 <span className="hidden md:block ml-2 font-bold text-xl">NUM HOSPITAL</span>
              </Link>

             {/* Desktop Navigation Links */}
             <div className="hidden md:block md:ml-6">
                <div className="flex space-x-4">
                  {filteredNavItems.map((item) => (
                      <button
                          key={item.text}
                          onClick={() => navigate(item.href)}
                          className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                          {item.text}
                      </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section: User Menu */}
            <div className="relative ml-3">
                <div>
                  <button
                    onClick={toggleUserMenu}
                    className="max-w-xs bg-blue-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                    id="user-menu-button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Хэрэглэгчийн цэс нээх</span>
                    <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
                      {user?.sisiId ? user.sisiId.substring(0, 1).toUpperCase() : 'U'}
                    </div>
                  </button>
                </div>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                    onMouseLeave={closeUserMenu} // Close on mouse leave for better UX
                  >
                    <button
                      onClick={() => navigate('/profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                    >
                      Профайл
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                    >
                      Гарах
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {/* Overlay */}
      {isDrawerOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleDrawer}
            aria-hidden="true"
        ></div>
      )}
      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-30 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
         <div className="p-4 flex justify-between items-center border-b">
             <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-800">Цэс</h2>
             <button onClick={toggleDrawer} className="text-gray-500 hover:text-gray-700">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
             </button>
         </div>
         <nav className="mt-4 px-2">
            {filteredNavItems.map((item) => (
                <button
                    key={item.text}
                    onClick={() => navigate(item.href)}
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 mb-1"
                >
                    <span className="mr-3">{item.icon}</span>
                    {item.text}
                </button>
            ))}
            <hr className="my-4" />
            <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
                <span className="mr-3"><Icons.Logout /></span>
                Гарах
            </button>
         </nav>
      </div>
    </>
  );
};

export default Navbar; 