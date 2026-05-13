import { useState } from 'react'
import SideBar from '../components/DashboardPage-components/SideBar'
import { Outlet } from 'react-router-dom'
import EthioFarmersChat from '../components/EthioFarmersChat'

const SIDEBAR_WIDTH = '200px'

const Dashboard = () => {

  const [openChat, setOpenChat] = useState(false)

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f2f6ed',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <SideBar />

      {/* MAIN CONTENT */}
      <main style={{
        marginLeft: SIDEBAR_WIDTH,
        width: `calc(100% - ${SIDEBAR_WIDTH})`,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}>
        <Outlet />
      </main>

      {/* ═════════════════════════════════════
          AI CHAT BUBBLE (FLOATING)
      ═════════════════════════════════════ */}
      
      {/* Bubble Button */}
      {!openChat && (
        <div
          onClick={() => setOpenChat(true)}
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#2d6b3e,#4a9456)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
          }}
        >
          🤖
        </div>
      )}

      {/* Expanded Chat Window */}
      {openChat && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '360px',
            height: '520px',
            borderRadius: '18px',
            background: '#fff',
            boxShadow: '0 10px 35px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#2d6b3e,#4a9456)',
            color: '#fff',
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 700,
          }}>
            <div>🌿 AI Agribot</div>

            <button
              onClick={() => setOpenChat(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Chat Component */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <EthioFarmersChat />
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard