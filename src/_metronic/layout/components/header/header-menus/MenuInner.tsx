import {useIntl} from 'react-intl'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import { Handle } from 'reactflow'
import { useNavigate } from 'react-router-dom'

export function MenuInner() {
  const intl = useIntl()
  const navigate = useNavigate()
  const handleDashboard = () => {
    sessionStorage.removeItem('compliance');
    navigate('/dashboard');
  };
  const handleCompliance = () => {
    sessionStorage.setItem('compliance', 'true'); 
    navigate('/dashboardCompliance');
  };
  return (
    <>
    <button className='btn btn-small btn-primary m-4 active' onClick={handleDashboard}>Dashboard</button>
    <button className='btn btn-small btn-primary m-4 active ' onClick={handleCompliance}>Compliance</button>
    {/* <MenuItem /> */}
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title="Compliance" to='/dashboardCompliance' /> */}
    </>
  )
}
