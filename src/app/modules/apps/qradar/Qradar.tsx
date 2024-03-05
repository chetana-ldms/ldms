import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink } from '../../../../_metronic/layout/core'
import { DemoPage } from './qradar-pages/demo/DemoPage'
import { IncidentsPagev1 } from './qradar-pages/incidents/IncidentsPagev1'
import { IncidentsPageDemo } from './qradar-pages/incidents/IncidentsPageDemo'
import { AlertsPage } from './qradar-pages/alerts/AlertsPage'
import { ChannelsPage } from './qradar-pages/channels/ChannelsPage'
import { Reports } from './qradar-pages/reports/Reports'
import { DemoAlert } from './qradar-pages/demo/DemoAlert'
import { DemoAlertv1 } from './qradar-pages/demo/DemoAlertv1'
import { DemoPlaybooks } from './qradar-pages/demo/DemoPlaybooks'
import { LdpTools } from './qradar-pages/configuration/LdpTools'
import { AddLdpTools } from './qradar-pages/configuration/AddLdpTools'
import { UpdateLdpTools } from './qradar-pages/configuration/UpdateLdpTools'
import { Playbooks } from './qradar-pages/playbooks/Playbooks'
import { AddPlaybooks } from './qradar-pages/playbooks/AddPlaybooks'
import { UpdatePlaybooks } from './qradar-pages/playbooks/UpdatePlaybooks'
import { RulesEngine } from './qradar-pages/configuration/RulesEngine'
import { AddRule } from './qradar-pages/configuration/AddRule'
import { UpdateRule } from './qradar-pages/configuration/UpdateRule'
import { ToolTypeActions } from './qradar-pages/configuration/ToolTypeActions'
import { AddToolTypeAction } from './qradar-pages/configuration/AddToolTypeAction'
import { UpdateToolTypeAction } from './qradar-pages/configuration/UpdateToolTypeAction'
import { ToolActions } from './qradar-pages/configuration/ToolActions'
import { AddToolAction } from './qradar-pages/configuration/AddToolAction'
import { UpdateToolAction } from './qradar-pages/configuration/UpdateToolAction'
import { RulesActions } from './qradar-pages/configuration/RulesActions'
import { AddRuleAction } from './qradar-pages/configuration/AddRuleAction'
import { UpdateRuleAction } from './qradar-pages/configuration/UpdateRuleAction'
import { Organizations } from './qradar-pages/configuration/Organizations'
import { OrganizationTools } from './qradar-pages/configuration/OrganizationTools'
import { MasterData } from './qradar-pages/configuration/MasterData'
import { UserData } from './qradar-pages/configuration/UserData'
import { RoleData } from './qradar-pages/configuration/RoleData'
import { AddOrganizations } from './qradar-pages/configuration/AddOrganizations'
import { UpdateOrganizations } from './qradar-pages/configuration/Updateorganizations'
import { AddMasterData } from './qradar-pages/configuration/AddMasterData'
import { UpdateMasterData } from './qradar-pages/configuration/UpdateMasterData'
import { AddUserData } from './qradar-pages/configuration/AddUserData'
import { UpdateUserData } from './qradar-pages/configuration/UpdateUserData'
import { AddRoleData } from './qradar-pages/configuration/AddRoleData'
import { UpdateRoleData } from './qradar-pages/configuration/UpdateRoleData'
import { AddOrganizationTools } from './qradar-pages/configuration/AddOrganizationTools'
import { UpdateOrganizationTools } from './qradar-pages/configuration/UpdateorganizationTools'
import { IncidentsPageCollaboration } from './qradar-pages/incidents/IncidentsPageCollaboration'
import UsersProfile from './qradar-pages/profile/UsersProfile'
import { IncidentsPage } from './qradar-pages/incidents/IncidentsPage'
import UserName from '../../../../complianceModules/app/UserName'
import Connections from '../../../../complianceModules/app/Connections'
import EventTracking from '../../../../complianceModules/app/EventTracking'
import Monitoring from '../../../../complianceModules/app/Monitoring'
import Frameworks from '../../../../complianceModules/app/Frameworks'
import Controls from '../../../../complianceModules/app/Controls'
import Tasks from '../../../../complianceModules/app/Tasks'
import QuickStart from '../../../../complianceModules/app/QuickStart'
import EvidenceLibrary from '../../../../complianceModules/app/EvidenceLibrary'
import AuditHub from '../../../../complianceModules/app/AuditHub'
import TrustCenter from '../../../../complianceModules/app/TrustCenter'
import RiskAssessment from '../../../../complianceModules/app/RiskAssessment'
import RiskManagement from '../../../../complianceModules/app/RiskManagement'
import Vendors from '../../../../complianceModules/app/Vendors'
import Assets from '../../../../complianceModules/app/Assets'
import Personnel from '../../../../complianceModules/app/Personnel'
import PolicyCenter from '../../../../complianceModules/app/PolicyCenter'
import AccessReview from '../../../../complianceModules/app/AccessReview'
import SecurityReport from '../../../../complianceModules/app/SecurityReport'
import Task from './qradar-pages/tasks/Task'
import AddTask from './qradar-pages/tasks/AddTask'
import UpdateTask from './qradar-pages/tasks/UpdateTask'
import Application from './qradar-pages/application-management/Application'
import RiskComponentUpdate from './qradar-pages/application-management/RiskComponentUpdate'


const QradarPages = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path='alerts' element={<AlertsPage />} />
        <Route path='incidents' element={<IncidentsPage />} />
        <Route path='incidentsDemo' element={<IncidentsPageDemo />} />
        <Route path='incidentsv1' element={<IncidentsPagev1 />} />
        <Route path='incidentscollaboration' element={<IncidentsPageCollaboration />} />
        <Route path='channels' element={<ChannelsPage />} />
        <Route path='reports' element={<Reports />} />
    <Route path='quickstart' element={<QuickStart />} />
    <Route path='tasks' element={<Tasks />} />
    <Route path='controls' element={<Controls />} />
    <Route path='frameworks' element={<Frameworks />} />
    <Route path='monitoring' element={<Monitoring />} />
    <Route path='eventtracking' element={<EventTracking />} />
    <Route path='evidencelibrary' element={<EvidenceLibrary />} />
    <Route path='audithub' element={<AuditHub />} />
    <Route path='trustcenter' element={<TrustCenter />} />
    <Route path='riskassessment' element={<RiskAssessment />} />
    <Route path='riskmanagement' element={<RiskManagement />} />
    <Route path='vendors' element={<Vendors />} />
    <Route path='assets' element={<Assets />} />
    <Route path='personnel' element={<Personnel />} />
    <Route path='policycenter' element={<PolicyCenter />} />
    <Route path='accessreview' element={<AccessReview />} />
    <Route path='securityreport' element={<SecurityReport />} />
    <Route path='connections' element={<Connections />} />
    <Route path='username' element={<UserName />} />
      </Route>
      <Route path='demoalert/:status' element={<DemoAlert />} />
      <Route path='demoalertv1/:status' element={<DemoAlertv1 />} />
      <Route path='demoplaybooks' element={<DemoPlaybooks />} />
      <Route path='profile' element={<UsersProfile />} />
      <Route path='demo/:status' element={<DemoPage />} />
      <Route path='playbooks/:status' element={<Playbooks />} />
      <Route path='addplaybooks' element={<AddPlaybooks />} />
      <Route path='updateplaybooks/:id' element={<UpdatePlaybooks />} />
      <Route path='ldp-tools/:status' element={<LdpTools />} />
      <Route path='ldp-tools/add' element={<AddLdpTools />} />
      <Route path='/ldp-tools/update/:id' element={<UpdateLdpTools />} />
      <Route path='rules-engine/:status' element={<RulesEngine />} />
      <Route path='rules-engine/add' element={<AddRule />} />
      <Route path='/rules-engine/update/:id' element={<UpdateRule />} />
      <Route path='rules-actions/:status' element={<RulesActions />} />
      <Route path='rules-actions/add' element={<AddRuleAction />} />
      <Route path='/rules-actions/update/:id' element={<UpdateRuleAction />} />
      <Route path='tool-type-actions/:status' element={<ToolTypeActions />} />
      <Route path='tool-type-actions/add' element={<AddToolTypeAction />} />
      <Route path='/tool-type-actions/update/:id' element={<UpdateToolTypeAction />} />
      <Route path='tool-actions/:status' element={<ToolActions />} />
      <Route path='tool-actions/add' element={<AddToolAction />} />
      <Route path='/tool-actions/update/:id' element={<UpdateToolAction />} />
      <Route path='organizations/:status' element={<Organizations />} />
      <Route path='organizations/add' element={<AddOrganizations />} />
      <Route path='/organizations/update/:id' element={<UpdateOrganizations />} />
      <Route path='organization-tools/:status' element={<OrganizationTools />} />
      <Route path='organization-tools/add' element={<AddOrganizationTools />} />
      <Route path='/organization-tools/update/:id' element={<UpdateOrganizationTools />} />
      <Route path='master-data/:status' element={<MasterData />} />
      <Route path='master-data/add' element={<AddMasterData />} />
      <Route path='/master-data/update/:id' element={<UpdateMasterData />} />
      <Route path='users-data/:status' element={<UserData />} />
      <Route path='users-data/add' element={<AddUserData />} />
      <Route path='/users-data/update/:id' element={<UpdateUserData />} />
      <Route path='roles-data/:status' element={<RoleData />} />
      <Route path='roles-data/add' element={<AddRoleData />} />
      <Route path='/roles-data/update/:id' element={<UpdateRoleData />} />
      <Route path='tasks/:status' element={<Task />} />
      <Route path='tasks/add' element={<AddTask />} />
      <Route path='/tasks/update/:id' element={<UpdateTask />} />
      <Route path='application/:status' element={<Application />} />
      <Route path='/application/update/:id' element={<RiskComponentUpdate />} />
      <Route index element={<Navigate to='/apps/qradar/users' />} />
    </Routes>
  )
}

export default QradarPages
