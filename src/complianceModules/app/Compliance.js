import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { AlertsPage } from '../app/modules/apps/qradar/qradar-pages/alerts/AlertsPage';
import { IncidentsPage } from '../app/modules/apps/qradar/qradar-pages/incidents/IncidentsPage';
import { IncidentsPageDemo } from '../app/modules/apps/qradar/qradar-pages/incidents/IncidentsPageDemo';
import { IncidentsPagev1 } from '../app/modules/apps/qradar/qradar-pages/incidents/IncidentsPagev1';
import QuickStart from '../QuickStart';
import Tasks from './Tasks';
import ComplianceCompliance from './ComplianceCompliance';
import Controle from './Controle';
import Frameworks from './Frameworks';


const Compliance = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='quickstart'
          element={ <QuickStart />}
        />
        <Route
          path='tasks'
          element={<Tasks />}
        />
         <Route
          path='compliance'
          element={<ComplianceCompliance />}
        />
         <Route
          path='controle'
          element={<Controle />}
        />
         <Route
          path='frameworks'
          element={<Frameworks />}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
         <Route
          path=''
          element={}
        />
        <Route
          path='incidentsDemo'
          element={
            <>
              {/* <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle> */}
              <IncidentsPageDemo />
            </>
          }
        />
        <Route
          path='incidentsv1'
          element={
            <>
              {/* <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle> */}
              <IncidentsPagev1 />
            </>
          }
        />
       
      </Route>
      <Route index element={<Navigate to='/apps/qradar/users' />} />
    </Routes>
  )
}

export default Compliance;
