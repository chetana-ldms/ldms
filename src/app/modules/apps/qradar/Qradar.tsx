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
import InventoryComponentUpdate from './qradar-pages/application-management/InventoryComponentUpdate'
import Policy from './qradar-pages/application-management/Policy'
import RisksComponent from './qradar-pages/application-management/RisksComponent'
import InventoryComponent from './qradar-pages/application-management/InventoryComponent'
import Setinels from './qradar-pages/Setinels/Setinels'
import Settings from './qradar-pages/settings/Settings'
import Activity from './qradar-pages/activities/Activity'
import Features from './qradar-pages/security/Features'
import FeatureAction from './qradar-pages/security/FeatureAction'
import RoleBasedAccess from './qradar-pages/security/RoleBasedAccess'
import Endpoint from './qradar-pages/Setinels/Endpoint'
import Exclusions from './qradar-pages/Setinels/Exclusions'
import BlockList from './qradar-pages/Setinels/BlockList'
import AccountDetalis from './qradar-pages/Setinels/AccountDetalis'
import PolicySentinal from './qradar-pages/Setinels/Policy'
import AddFeatures from './qradar-pages/security/AddFeatures'
import UpdateFeatures from './qradar-pages/security/UpdateFeatures'
import AddFeatureAction from './qradar-pages/security/AddFeatureAction'
import UpdateFeatureAction from './qradar-pages/security/UpdateFeatureAction'
import Accounts from './qradar-pages/settings/Accounts'
import Sites from './qradar-pages/settings/Sites'
import SiteName from './qradar-pages/settings/SiteName'
import SiteType from './qradar-pages/settings/SiteType'
import SitePolicy from './qradar-pages/settings/SitePolicy'
import SiteStepper from './qradar-pages/settings/SiteStepper'
import SentinelsReport from './qradar-pages/sentinels-report/SentinelsReport'
import LoadReportTask from './qradar-pages/sentinels-report/LoadReportTask'
import MaintenanceWindow from './qradar-pages/Setinels/MaintenanceWindow'
import SentinelLiveUpdates from './qradar-pages/Setinels/SentinelLiveUpdates'
import { AutoUpgrade } from './qradar-pages/Setinels/AutoUpgrade'
import Tags from './qradar-pages/Setinels/Tags'
import { ConfigurationData } from './qradar-pages/configuration/ConfigurationData'
import { AddConfigurationData } from './qradar-pages/configuration/AddConfigurationData'
import { UpdateConfigurationData } from './qradar-pages/configuration/UpdateConfigurationData'
import UsersLocked from './qradar-pages/security/UsersLocked'
import ApplicationLogs from './qradar-pages/application-logs/ApplicationLogs'
import CustomAlerts from './qradar-pages/alerts/CustomAlerts'
import EmailLogs from './qradar-pages/email-logs/EmailLogs'
import ChatBot from './qradar-pages/chat-bot/ChatBot'
import IncidentReport from './qradar-pages/reports/IncidentReport'
import IncidentReportSummery from './qradar-pages/reports/IncidentReportSummery'
import { Templates } from './qradar-pages/components/message-templates/Templates'
import { AddTemplates } from './qradar-pages/components/message-templates/AddTemplates'
import { Placeholder } from './qradar-pages/components/message-templates/Placeholder'
import { AddPlaceholder } from './qradar-pages/components/message-templates/AddPlaceholder'
import { UpdateTemplates } from './qradar-pages/components/message-templates/UpdateTemplates'
import { UpdatePlaceholder } from './qradar-pages/components/message-templates/UpdatePlaceholder'
import { TemplateGroupes } from './qradar-pages/components/message-templates/TemplateGroupes'
import { AddTemplateGroupes } from './qradar-pages/components/message-templates/AddTemplateGroupes'
import { UpdateTemplateGroupes } from './qradar-pages/components/message-templates/UpdateTemplateGroupes'
import { TemplateTypes } from './qradar-pages/components/message-templates/TemplateTypes'
import { AddTemplateTypes } from './qradar-pages/components/message-templates/AddTemplateTypes'
import { UpdateTemplateTypes } from './qradar-pages/components/message-templates/UpdateTemplateTypes'
import { PlaceholderGroups } from './qradar-pages/components/message-templates/PlaceholderGroups'
import { AddPlaceholderGroups } from './qradar-pages/components/message-templates/AddPlaceholderGroups'
import { UpdatePlaceholderGroups } from './qradar-pages/components/message-templates/UpdatePlaceholderGroups'
import RiskProfile from './qradar-pages/risk-upgrade/RiskProfile'
import Vulnerabilities from './qradar-pages/risk-upgrade/Vulnerabilities'
import Domain from './qradar-pages/risk-upgrade/Domain'
import IpAddress from './qradar-pages/risk-upgrade/IpAddress'
import RiskWaiver from './qradar-pages/risk-upgrade/RiskWaiver'
import { Techniques } from './qradar-pages/mitre/Techniques'
import { Tactics } from './qradar-pages/mitre/Tactics'
import { Rules } from './qradar-pages/configuration/Rules'
import AddRule from './qradar-pages/configuration/AddRule'
import UpdateRule from './qradar-pages/configuration/UpdateRule'
import { Resolver } from './qradar-pages/playbook-configuration/Resolver'
import AddResolver from './qradar-pages/playbook-configuration/AddResolver'
import UpdateResolver from './qradar-pages/playbook-configuration/UpdateResolver'
import { Senarios } from './qradar-pages/configuration/Senarios'
import AddAlertFields from './qradar-pages/alert-fields/AddAlertFields'
import AlertFields from './qradar-pages/alert-fields/AlertFields'
import UpdateAlertFields from './qradar-pages/alert-fields/UpdateAlertFields'
import Scripts from './qradar-pages/scripts/Scripts'
import AddScripts from './qradar-pages/scripts/AddScripts'
import UpdateScripts from './qradar-pages/scripts/UpdateScripts'


const QradarPages = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path='alerts' element={<AlertsPage />} />
        <Route path='custom-alerts' element={<CustomAlerts />} />
        <Route path='email-logs' element={<EmailLogs />} />
        <Route path='chat-bot' element={<ChatBot />} />
        <Route path='incidents' element={<IncidentsPage />} />
        <Route path='incidentsv1' element={<IncidentsPagev1 />} />
        <Route path='incidentscollaboration' element={<IncidentsPageCollaboration />} />
        <Route path='channels' element={<ChannelsPage />} />
        <Route path='reports' element={<Reports />} />
        <Route path='incident-report-summery' element={<IncidentReportSummery />} />
        <Route path='incident-report' element={<IncidentReport />} />
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
        <Route path='incidentsDemo' element={<IncidentsPageDemo />} />
      <Route path='demoplaybooks' element={<DemoPlaybooks />} />
      <Route path='profile' element={<UsersProfile />} />
      <Route path='demo/:status' element={<DemoPage />} />
      <Route path='playbooks/:status' element={<Playbooks />} />
      <Route path='addplaybooks' element={<AddPlaybooks />} />
      <Route path='updateplaybooks/:id' element={<UpdatePlaybooks />} />
      <Route path='ldp-tools/:status' element={<LdpTools />} />
      <Route path='ldp-tools/add' element={<AddLdpTools />} />
      <Route path='/ldp-tools/update/:id' element={<UpdateLdpTools />} />
      <Route path='rules-engine/:status' element={<Rules/>} />
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
      <Route path='configuration-data/:status' element={<ConfigurationData />} />
      <Route path='configuration-data/add' element={<AddConfigurationData />} />
      <Route path='/configuration-data/update/:id' element={<UpdateConfigurationData />} />
      <Route path='users-data/:status' element={<UserData />} />
      <Route path='users-data/add' element={<AddUserData />} />
      <Route path='/users-data/update/:id' element={<UpdateUserData />} />

      <Route path='templates/:status' element={<Templates />} />
      <Route path='templates/add' element={<AddTemplates />} />
      <Route path='/templates/update/:id' element={<UpdateTemplates />} />
       <Route path='placeholder/:status' element={<Placeholder />} />
      <Route path='placeholder/add' element={<AddPlaceholder />} />
      <Route path='/placeholder/update/:id' element={<UpdatePlaceholder />} />
          <Route path='template-groupes/:status' element={<TemplateGroupes />} />
      <Route path='template-groupes/add' element={<AddTemplateGroupes />} />
      <Route path='/template-groupes/update/:id' element={<UpdateTemplateGroupes />} />
        <Route path='template-types/:status' element={<TemplateTypes />} />
      <Route path='template-types/add' element={<AddTemplateTypes />} />
      <Route path='/template-types/update/:id' element={<UpdateTemplateTypes />} />
       <Route path='placeholder-groups/:status' element={<PlaceholderGroups />} />
      <Route path='placeholder-groups/add' element={<AddPlaceholderGroups />} />
      <Route path='/placeholder-groups/update/:id' element={<UpdatePlaceholderGroups />} />
      <Route path='roles-data/:status' element={<RoleData />} />
      <Route path='roles-data/add' element={<AddRoleData />} />
      <Route path='/roles-data/update/:id' element={<UpdateRoleData />} />
      <Route path='tasks/:status' element={<Task />} />
      <Route path='tasks/add' element={<AddTask />} />
      <Route path='/tasks/update/:id' element={<UpdateTask />} />
      <Route path='application/:status' element={<Application />} />
      <Route path="/application/update/:id" element={<RiskComponentUpdate />} />
      <Route path="/application/update/:name/:vendor" element={<InventoryComponentUpdate />} />
      <Route path="/application/policy" element={<Policy />} />
      <Route path="/application/risk" element={<RisksComponent />} />
      <Route path="/application/inventory" element={<InventoryComponent />} />
      <Route path='setinels/:status' element={<Setinels />} />
      <Route path='setinels/endpoits' element={<Endpoint />} />
      <Route path='setinels/exclusions' element={<Exclusions />} />
      <Route path='setinels/blockList' element={<BlockList />} />
      <Route path='setinels/policy' element={<PolicySentinal />} />
      <Route path='setinels/accountDetalis' element={<AccountDetalis />} />
      <Route path='setinels/autoupgrade' element={<AutoUpgrade />} />
      <Route path='setinels/tags' element={<Tags />} />
      <Route path='setinels/maintenancewindow' element={<MaintenanceWindow />} />
      <Route path='setinels/sentinelliveupdates' element={<SentinelLiveUpdates />} />
      <Route path='settings/:status' element={<Settings />} />
      <Route path='accounts/:status' element={<Accounts />} />
      <Route path='sites/:status' element={<Sites />} />
      <Route path='activity/:status' element={<Activity />} />
      <Route path='application-logs/:status' element={<ApplicationLogs />} />
      <Route path='features/:status' element={<Features />} />
      <Route path='features/update/:id' element={<UpdateFeatures />} />
      <Route path='features/add' element={<AddFeatures />} />
      <Route path='featureaction/:status' element={<FeatureAction />} />
      <Route path='UsersLocked/:status' element={<UsersLocked />} />
      <Route path='featureaction/update/:id' element={<UpdateFeatureAction />} />
      <Route path='featureaction/add' element={<AddFeatureAction />} />
      <Route path='rolebasedaccess/:status' element={<RoleBasedAccess />} />
      <Route path="/site-stepper" element={<SiteStepper />} />
      <Route path="/sentinelsReport" element={<SentinelsReport />} />
      <Route path='load-report-task/:status' element={<LoadReportTask />} />
       <Route path='RiskProfile/:status' element={<RiskProfile />} />
       <Route path='Vulnerabilities/:status' element={<Vulnerabilities />} />
       <Route path='Domain/:status' element={<Domain />} />
       <Route path='IpAddress/:status' element={<IpAddress />} />
       <Route path='RiskWaiver/:status' element={<RiskWaiver />} />
       <Route path='Techniques/:status' element={<Techniques />} />
       <Route path='Tactics/:status' element={<Tactics />} />
        <Route path='resolver/:status' element={<Resolver/>} />
      <Route path='resolver/add' element={<AddResolver />} />
      <Route path='/resolver/update/:id' element={<UpdateResolver />} />
      <Route path='senarios/:status' element={<Senarios />} />
       <Route path='alert-fields/:status' element={<AlertFields/>} />
      <Route path='alert-fields/add' element={<AddAlertFields />} />
      <Route path='/alert-fields/update/:id' element={<UpdateAlertFields />} />
      <Route path='scripts/:status' element={<Scripts/>} />
      <Route path='scripts/add' element={<AddScripts />} />
      <Route path='/scripts/update/:id' element={<UpdateScripts />} />
      <Route index element={<Navigate to='/apps/qradar/users' />} />
    </Routes>
  )
}

export default QradarPages
