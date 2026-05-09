import SideBar from '../components/DashboardPage-components/SideBar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f2f6ed' }}>
      <SideBar />
      <div style={{ flex: 1, marginLeft: '232px', width: 'calc(100% - 232px)', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
