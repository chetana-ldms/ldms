import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import QuickStart from './QuickStart'



// const usersBreadcrumbs: Array<PageLink> = [
//   {
//     title: 'Qradar',
//     path: '/apps/qradar/alerts',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Qradar',
//     path: '/apps/qradar/incidents',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Qradar',
//     path: '/apps/qradar/incidentsPageDemo',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Qradar',
//     path: '/apps/qradar/incidentsv1',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Qradar',
//     path: '/apps/qradar/incidentscollaboration',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Demo',
//     path: '/apps/qradar/demo',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Playbooks',
//     path: '/apps/qradar/playbooks',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Add Playbooks',
//     path: '/apps/qradar/addplaybooks',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Update Playbooks',
//     path: '/apps/qradar/updateplaybooks/:id',
//     isSeparator: true,
//     isActive: false,
//   },
//   {
//     title: 'LdpTools',
//     path: '/qradar/ldptools',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Add LdpTools',
//     path: '/apps/qradar/ldptools',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Update LdpTools',
//     path: '/qradar/ldptools/update/:id',
//     isSeparator: true,
//     isActive: false,
//   },
//   {
//     title: 'Organizations',
//     path: '/apps/qradar/organizations',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'OrganizationTools',
//     path: '/apps/qradar/organizationtools',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'MasterData',
//     path: '/apps/qradar/masterdata',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'UserData',
//     path: '/apps/qradar/userdata',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Role Data',
//     path: '/apps/qradar/roles-data',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: 'Add Role Data',
//     path: '/apps/qradar/roles-data/add',
//     isSeparator: false,
//     isActive: false,
//   },
//   {
//     title: '',
//     path: '',
//     isSeparator: true,
//     isActive: false,
//   },
// ]

const Compliance = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='quickstart'
          element={
              <QuickStart />
          }
        /> 
      </Route>
    </Routes>
  )
}

export default Compliance;
