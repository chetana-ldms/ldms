import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {DemoPage} from './qradar-pages/demo/DemoPage'
import {IncidentsPagev1} from './qradar-pages/incidents/IncidentsPagev1'
import {IncidentsPage} from './qradar-pages/incidents/IncidentsPage'
import {AlertsPage} from './qradar-pages/alerts/AlertsPage'
import {ChannelsPage} from './qradar-pages/channels/ChannelsPage'
import {Reports} from './qradar-pages/reports/Reports'
import {DemoAlert} from './qradar-pages/demo/DemoAlert'
import {DemoAlertv1} from './qradar-pages/demo/DemoAlertv1'
import {DemoPlaybooks} from './qradar-pages/demo/DemoPlaybooks'
import {LdpTools} from './qradar-pages/configuration/LdpTools'
import {AddLdpTools} from './qradar-pages/configuration/AddLdpTools'
import {UpdateLdpTools} from './qradar-pages/configuration/UpdateLdpTools'

import {Playbooks} from './qradar-pages/playbooks/Playbooks'
import {AddPlaybooks} from './qradar-pages/playbooks/AddPlaybooks'
import {UpdatePlaybooks} from './qradar-pages/playbooks/UpdatePlaybooks'

import {RulesEngine} from './qradar-pages/configuration/RulesEngine'
import {AddRule} from './qradar-pages/configuration/AddRule'
import {UpdateRule} from './qradar-pages/configuration/UpdateRule'

import {ToolTypeActions} from './qradar-pages/configuration/ToolTypeActions'
import {AddToolTypeAction} from './qradar-pages/configuration/AddToolTypeAction'
import {UpdateToolTypeAction} from './qradar-pages/configuration/UpdateToolTypeAction'

import {ToolActions} from './qradar-pages/configuration/ToolActions'
import {AddToolAction} from './qradar-pages/configuration/AddToolAction'
import {UpdateToolAction} from './qradar-pages/configuration/UpdateToolAction'

import {RulesActions} from './qradar-pages/configuration/RulesActions'
import {AddRuleAction} from './qradar-pages/configuration/AddRuleAction'
import {UpdateRuleAction} from './qradar-pages/configuration/UpdateRuleAction'

import {Organizations} from './qradar-pages/configuration/Organizations'
import {OrganizationTools} from './qradar-pages/configuration/OrganizationTools'
import {MasterData} from './qradar-pages/configuration/MasterData'
import {UserData} from './qradar-pages/configuration/UserData'
import {RoleData} from './qradar-pages/configuration/RoleData'
import {AddOrganizations} from './qradar-pages/configuration/AddOrganizations'
import {UpdateOrganizations} from './qradar-pages/configuration/Updateorganizations'
import {AddMasterData} from './qradar-pages/configuration/AddMasterData'
import {UpdateMasterData} from './qradar-pages/configuration/UpdateMasterData'
import {AddUserData} from './qradar-pages/configuration/AddUserData'
import {UpdateUserData} from './qradar-pages/configuration/UpdateUserData'
import {AddRoleData} from './qradar-pages/configuration/AddRoleData'
import {UpdateRoleData} from './qradar-pages/configuration/UpdateRoleData'
import {AddOrganizationTools} from './qradar-pages/configuration/AddOrganizationTools'
import {UpdateOrganizationTools} from './qradar-pages/configuration/UpdateorganizationTools'
import {IncidentsPageCollaboration} from './qradar-pages/incidents/IncidentsPageCollaboration'
import UsersProfile from './qradar-pages/profile/UsersProfile'


const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Qradar',
    path: '/apps/qradar/alerts',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Qradar',
    path: '/apps/qradar/incidents',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Qradar',
    path: '/apps/qradar/incidentsv1',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Qradar',
    path: '/apps/qradar/incidentscollaboration',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Demo',
    path: '/apps/qradar/demo',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Playbooks',
    path: '/apps/qradar/playbooks',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Add Playbooks',
    path: '/apps/qradar/addplaybooks',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Update Playbooks',
    path: '/apps/qradar/updateplaybooks/:id',
    isSeparator: true,
    isActive: false,
  },
  {
    title: 'LdpTools',
    path: '/qradar/ldptools',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Add LdpTools',
    path: '/apps/qradar/ldptools',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Update LdpTools',
    path: '/qradar/ldptools/update/:id',
    isSeparator: true,
    isActive: false,
  },
  {
    title: 'Organizations',
    path: '/apps/qradar/organizations',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'OrganizationTools',
    path: '/apps/qradar/organizationtools',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'MasterData',
    path: '/apps/qradar/masterdata',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'UserData',
    path: '/apps/qradar/userdata',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const QradarPages = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='alerts'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>New Alerts</PageTitle>
              <AlertsPage />
            </>
          }
        />
        <Route
          path='incidents'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle>
              <IncidentsPage />
            </>
          }
        />
        <Route
          path='incidentsv1'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle>
              <IncidentsPagev1 />
            </>
          }
        />
        <Route
          path='incidentscollaboration'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle>
              <IncidentsPageCollaboration />
            </>
          }
        />
        <Route
          path='channels'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle>
              <ChannelsPage />
            </>
          }
        />
        <Route
          path='reports'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Qradar Saved Alerts</PageTitle>
              <Reports />
            </>
          }
        />
      </Route>
      <Route
        path='demoalert/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Demo Alert</PageTitle>
            <DemoAlert />
          </>
        }
      />
      <Route
        path='demoalertv1/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Demo Alert</PageTitle>
            <DemoAlertv1 />
          </>
        }
      />
      <Route
        path='demoplaybooks'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Demo Playbooks</PageTitle>
            <DemoPlaybooks />
          </>
        }
      />
      <Route
          path='profile'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>User Profile</PageTitle>
              <UsersProfile />
            </>
          }
        />
      <Route
        path='demo/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Demo</PageTitle>
            <DemoPage />
          </>
        }
      />
      <Route
        path='playbooks/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Playbooks</PageTitle>
            <Playbooks />
          </>
        }
      />
      <Route
        path='addplaybooks'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Playbooks</PageTitle>
            <AddPlaybooks />
          </>
        }
      />
      <Route
        path='updateplaybooks/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Playbooks</PageTitle>
            <UpdatePlaybooks />
          </>
        }
      />
      <Route
        path='ldp-tools/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>LDP Tools</PageTitle>
            <LdpTools />
          </>
        }
      />
      <Route
        path='ldp-tools/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add LDP Tool</PageTitle>
            <AddLdpTools />
          </>
        }
      />
      <Route
        path='/ldp-tools/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update LDP Tool</PageTitle>
            <UpdateLdpTools />
          </>
        }
      />
      <Route
        path='rules-engine/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Rules Engine</PageTitle>
            <RulesEngine />
          </>
        }
      />
      <Route
        path='rules-engine/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Rule</PageTitle>
            <AddRule />
          </>
        }
      />
      <Route
        path='/rules-engine/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update LDP Tool</PageTitle>
            <UpdateRule />
          </>
        }
      />
      <Route
        path='rules-actions/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Rules Actions</PageTitle>
            <RulesActions />
          </>
        }
      />
      <Route
        path='rules-actions/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Rule Action</PageTitle>
            <AddRuleAction />
          </>
        }
      />
      <Route
        path='/rules-actions/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Rule Action</PageTitle>
            <UpdateRuleAction />
          </>
        }
      />
      <Route
        path='tool-type-actions/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Tool Type Actions</PageTitle>
            <ToolTypeActions />
          </>
        }
      />
      <Route
        path='tool-type-actions/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Tool Type Action</PageTitle>
            <AddToolTypeAction />
          </>
        }
      />
      <Route
        path='/tool-type-actions/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Tool Type Action</PageTitle>
            <UpdateToolTypeAction />
          </>
        }
      />
      <Route
        path='tool-actions/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Tool Actions</PageTitle>
            <ToolActions />
          </>
        }
      />
      <Route
        path='tool-actions/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Tool Action</PageTitle>
            <AddToolAction />
          </>
        }
      />
      <Route
        path='/tool-actions/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Tool Action</PageTitle>
            <UpdateToolAction />
          </>
        }
      />
      <Route
        path='organizations/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Organizations</PageTitle>
            <Organizations />
          </>
        }
      />
      <Route
        path='organizations/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Organization</PageTitle>
            <AddOrganizations />
          </>
        }
      />
      <Route
        path='/organizations/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Organization</PageTitle>
            <UpdateOrganizations />
          </>
        }
      />
      <Route
        path='organization-tools/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Organization Tools</PageTitle>
            <OrganizationTools />
          </>
        }
      />
      <Route
        path='organization-tools/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Organization Tools</PageTitle>
            <AddOrganizationTools />
          </>
        }
      />
      <Route
        path='/organization-tools/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Organization Tools</PageTitle>
            <UpdateOrganizationTools />
          </>
        }
      />
      <Route
        path='master-data/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Master Data</PageTitle>
            <MasterData />
          </>
        }
      />
      <Route
        path='master-data/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add Master Data</PageTitle>
            <AddMasterData />
          </>
        }
      />
      <Route
        path='/master-data/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update Master Data</PageTitle>
            <UpdateMasterData />
          </>
        }
      />

      <Route
        path='users-data/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Users Data</PageTitle>
            <UserData />
          </>
        }
      />
      <Route
        path='users-data/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add User Data</PageTitle>
            <AddUserData />
          </>
        }
      />
      <Route
        path='/users-data/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update User Data</PageTitle>
            <UpdateUserData />
          </>
        }
      />

      <Route
        path='roles-data/:status'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Users Data</PageTitle>
            <RoleData />
          </>
        }
      />
      <Route
        path='roles-data/add'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Add User Data</PageTitle>
            <AddRoleData />
          </>
        }
      />
      <Route
        path='/roles-data/update/:id'
        element={
          <>
            <PageTitle breadcrumbs={usersBreadcrumbs}>Update User Data</PageTitle>
            <UpdateRoleData />
          </>
        }
      />

      <Route index element={<Navigate to='/apps/qradar/users' />} />
    </Routes>
  )
}

export default QradarPages
