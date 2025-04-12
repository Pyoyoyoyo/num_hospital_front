'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Icons = {
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  Hospital: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.625" /></svg>,
  Person: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
  Admin: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.004.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 1.255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.293-.24.438-.613.43-.992a6.759 6.759 0 0 1 0-1.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>,
};

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false); 
    setIsDrawerOpen(false); 
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
    setIsDrawerOpen(false);
    setIsUserMenuOpen(false);
  };

  const navigationItems = [
    { text: 'Нүүр', icon: <Icons.Dashboard />, href: '/auth/dashboard', roles: ['ROLE_USER', 'ROLE_ADMIN'] },
    { text: 'Эрхүүд', icon: <Icons.Person />, href: '/auth/users', roles: ['ROLE_ADMIN'] },
    // { text: 'Тохиргоо', icon: <Icons.Admin />, href: '/auth/settings', roles: ['ROLE_ADMIN'] }, // Example for Admin role
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
              <Link href="/auth/dashboard" className="flex-shrink-0 flex items-center text-white no-underline">
                 <span className="text-2xl"><Icons.Hospital /></span>
                 <span className="hidden md:block ml-2 font-bold text-xl">NUM HOSPITAL</span>
              </Link>

             {/* Desktop Navigation Links */}
             <div className="hidden md:block md:ml-6">
                <div className="flex space-x-4">
                  {filteredNavItems.map((item) => (
                      <button
                          key={item.text}
                          onClick={() => navigate(item.href)}
                          className="flex items-center text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                          <span className="mr-2">{item.icon}</span>
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
                      onClick={() => navigate('/auth/profile')}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                    >
                      <span className="mr-2"><Icons.Person /></span>
                      Профайл
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                    >
                       <span className="mr-2"><Icons.Logout /></span>
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