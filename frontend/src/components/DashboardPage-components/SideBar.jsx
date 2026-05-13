import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    label: 'Scan',
    path: '/dashboard/scan/disease',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M11 8v3l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    subItems: [
      { label: 'Disease Scan', path: '/dashboard/scan/disease' },
      { label: 'Pest Scan', path: '/dashboard/scan/pest' }
    ]
  },
  {
    label: 'Weather',
    path: '/dashboard/weather',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M18 10a6 6 0 10-11.8 1.5A4 4 0 106 18h12a4 4 0 000-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'History',
    path: '/dashboard/history',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  // {
  //   label: 'Notifications',
  //   path: '/dashboard/notifications',
  //   icon: (
  //     <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
  //       <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.6 1.4L4 17h5m6 0H9m6 0a3 3 0 11-6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  //     </svg>
  //   ),
  // },
  {
    label: 'Profile',
    path: '/dashboard/profile',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const SideBar = () => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState(null);
  const [isAnalysisMenuOpen, setIsAnalysisMenuOpen] = useState(false);

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '200px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e4eedd',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        zIndex: 50,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '36px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4a9456, #2d6b3e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 3C8 3 4 7 4 12c0 3 1.5 5.5 4 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 3c4 0 8 4 8 9 0 3-1.5 5.5-4 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 3v18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#2d6b3e', letterSpacing: '-0.3px' }}>
            AgriVita AI
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#8faa8b', paddingLeft: '36px', letterSpacing: '0.2px' }}>
          Modern Agriculture
        </span>
      </div>

      {/* Nav Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActive = hasSubItems
            ? item.subItems.some((subItem) => location.pathname === subItem.path)
            : location.pathname === item.path;
          const isExpanded = expandedItem === item.label;

          return (
            <div key={item.label}>
              {hasSubItems ? (
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isExpanded || isActive ? '#e8f5e2' : 'transparent',
                    color: isExpanded || isActive ? '#2d6b3e' : '#6b7c6b',
                    fontWeight: isExpanded || isActive ? 600 : 400,
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    fontFamily: "'DM Sans', sans-serif",
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    setExpandedItem(item.label)
                    if (!isExpanded && !isActive) e.currentTarget.style.backgroundColor = '#f4f8f1'
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded && !isActive) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span style={{ opacity: isExpanded || isActive ? 1 : 0.65 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ 
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isActive && !hasSubItems ? '#e8f5e2' : 'transparent',
                    color: isActive && !hasSubItems ? '#2d6b3e' : '#6b7c6b',
                    fontWeight: isActive && !hasSubItems ? 600 : 400,
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    fontFamily: "'DM Sans', sans-serif",
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f4f8f1'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.65 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )}

              {/* Submenu */}
              {hasSubItems && isExpanded && (
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    paddingLeft: '28px',
                    marginTop: '4px',
                    paddingBottom: '4px'
                  }}
                  onMouseLeave={() => setExpandedItem(null)}
                >
                  {item.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.label}
                        to={subItem.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: isSubActive ? '#d4e8cc' : 'transparent',
                          color: isSubActive ? '#2d6b3e' : '#6b7c6b',
                          fontWeight: isSubActive ? 600 : 400,
                          fontSize: '13px',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                          fontFamily: "'DM Sans', sans-serif",
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubActive) e.currentTarget.style.backgroundColor = '#eff5eb'
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubActive) e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* New Analysis Button */}
      <div
        style={{ position: 'relative', marginTop: 'auto', paddingTop: '10px' }}
        onMouseEnter={() => setIsAnalysisMenuOpen(true)}
        onMouseLeave={() => setIsAnalysisMenuOpen(false)}
      >
        <button
          onClick={() => setIsAnalysisMenuOpen((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            background: 'linear-gradient(135deg, #4a9456, #2d6b3e)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 4px 12px rgba(45,107,62,0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          New Analysis
        </button>

        {isAnalysisMenuOpen && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '52px',
              backgroundColor: '#ffffff',
              border: '1px solid #dce8d5',
              borderRadius: '10px',
              boxShadow: '0 10px 24px rgba(45,107,62,0.14)',
              padding: '6px',
              zIndex: 60,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <Link
              to="/dashboard/profit"
              onClick={() => setIsAnalysisMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '8px 10px',
                borderRadius: '7px',
                color: location.pathname === '/dashboard/profit' ? '#2d6b3e' : '#5f7461',
                backgroundColor: location.pathname === '/dashboard/profit' ? '#e8f5e2' : 'transparent',
                fontWeight: location.pathname === '/dashboard/profit' ? 600 : 500,
                fontSize: '13px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              AgriProfit
            </Link>
            <Link
              to="/dashboard/fertilizer"
              onClick={() => setIsAnalysisMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '8px 10px',
                borderRadius: '7px',
                color: location.pathname === '/dashboard/fertilizer' ? '#2d6b3e' : '#5f7461',
                backgroundColor: location.pathname === '/dashboard/fertilizer' ? '#e8f5e2' : 'transparent',
                fontWeight: location.pathname === '/dashboard/fertilizer' ? 600 : 500,
                fontSize: '13px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Fertilizer Expert
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideBar
