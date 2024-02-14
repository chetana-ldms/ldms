import React from "react";
import { useIntl } from "react-intl";
import { SidebarMenuItem } from "../../_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem";

const SidebarMenuMainCompiance = () => {
  const intl = useIntl();

  return (
    <>
      <SidebarMenuItem
        to="dashboardCompliance"
        icon="/media/icons/duotune/general/gen001.svg"
        title="Dashboard"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/quickstart"
        icon="/media/icons/duotune/general/gen002.svg"
        title="Quick Start"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/tasks"
        icon="/media/icons/duotune/general/gen004.svg"
        title="Tasks"
        fontIcon="bi-layers"
      />
        <p className="text-white mt-3 mb-0">Compliance</p>
      <SidebarMenuItem
        to="/qradar/controls"
        icon="/media/icons/duotune/general/gen006.svg"
        title="Controls"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/frameworks"
        icon="/media/icons/duotune/general/gen007.svg"
        title="Frameworks"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/Monitoring"
        icon="/media/icons/duotune/general/gen008.svg"
        title="Monitoring"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/eventtracking"
        icon="/media/icons/duotune/general/gen009.svg"
        title="Event Tracking"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/evidencelibrary"
        icon="/media/icons/duotune/general/gen005.svg"
        title="Evidence Library"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/audithub"
        icon="/media/icons/duotune/general/gen009.svg"
        title="Audit Hub"
        fontIcon="bi-layers"
      />
      <p className="text-white mt-3 mb-0">Trust</p>
      <SidebarMenuItem
        to="/qradar/trustcenter"
        icon="/media/icons/duotune/general/gen003.svg"
        title="Trust Center"
        fontIcon="bi-layers"
      />
       <p className="text-white mt-3 mb-0">Risk</p>
      <SidebarMenuItem
        to="/qradar/riskassessment"
        icon="/media/icons/duotune/general/gen004.svg"
        title="Risk Assessment"
        fontIcon="bi-layers"
      />
       <SidebarMenuItem
        to="/qradar/riskmanagement"
        icon="/media/icons/duotune/general/gen005.svg"
        title="Risk Management"
        fontIcon="bi-layers"
      />
       <SidebarMenuItem
        to="/qradar/vendors"
        icon="/media/icons/duotune/general/gen006.svg"
        title="Vendors"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/assets"
        icon="/media/icons/duotune/general/gen007.svg"
        title="Assets"
        fontIcon="bi-layers"
      />
       <p className="text-white mt-3 mb-0">Governance</p>
      <SidebarMenuItem
        to="/qradar/personnel"
        icon="/media/icons/duotune/general/gen008.svg"
        title="Personnel"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/policycenter"
        icon="/media/icons/duotune/general/gen009.svg"
        title="Policy Center"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/accessreview"
        icon="/media/icons/duotune/general/gen003.svg"
        title="Access Review"
        fontIcon="bi-layers"
      />
      <p className="text-white mt-3 mb-0">Trust</p>
      <SidebarMenuItem
        to="/qradar/securityreport"
        icon="/media/icons/duotune/general/gen005.svg"
        title="Security Report"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/connections"
        icon="/media/icons/duotune/general/gen003.svg"
        title="Connections"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/username"
        icon="/media/icons/duotune/general/gen002.svg"
        title="User Name"
        fontIcon="bi-layers"
      />
    </>
  );
};

export { SidebarMenuMainCompiance };
