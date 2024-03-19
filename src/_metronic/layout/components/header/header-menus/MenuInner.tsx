import {useIntl} from 'react-intl'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import { Handle } from 'reactflow'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function MenuInner() {
  const intl = useIntl()
  const navigate = useNavigate()
  const [activeButton, setActiveButton] = useState('Dashboard');

  const handleDashboard = () => {
    sessionStorage.removeItem('compliance');
    navigate('/dashboard');
    setActiveButton('Dashboard');
  };

  const handleCompliance = () => {
    sessionStorage.setItem('compliance', 'true');
    navigate('/dashboardCompliance');
    setActiveButton('Compliance');
  };
  return (
    <div className='upper-tab'>
     <button className={`btn btn-small btn-border m-4 ${activeButton === 'Dashboard' ? 'active btn-new' : ''}`} onClick={handleDashboard}>Dashboard</button>
      {/* <button className={`btn btn-small btn-border m-4 ${activeButton === 'Compliance' ? 'active btn-new' : ''}`} onClick={handleCompliance}>Compliance Dashboard</button> */}
    {/* <MenuItem /> */}
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title="Compliance" to='/dashboardCompliance' /> */}
    </div>
  )
}
