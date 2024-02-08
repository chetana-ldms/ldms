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
        title="Compliance Partners >"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/qradar/quickstart"
        icon="/media/icons/duotune/general/gen002.svg"
        title="Quick Start"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to='dashboardCompliance'
        icon='/media/icons/duotune/general/gen003.svg'
        title='Dashboard'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/tasks'
        icon='/media/icons/duotune/general/gen004.svg'
        title='Tasks'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/compliance'
        icon='/media/icons/duotune/general/gen005.svg'
        title='Compliance'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/controle'
        icon='/media/icons/duotune/general/gen006.svg'
        title='Controle'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/frameworks'
        icon='/media/icons/duotune/general/gen007.svg'
        title='Frameworks'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/Monitoring'
        icon='/media/icons/duotune/general/gen008.svg'
        title='Monitoring'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/eventtracking'
        icon='/media/icons/duotune/general/gen009.svg'
        title='Event Tracking'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/connections'
        icon='/media/icons/duotune/general/gen003.svg'
        title='Connections'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/username'
        icon='/media/icons/duotune/general/gen002.svg'
        title='User Name'
        fontIcon='bi-layers'
      />
    </>
  );
};

export { SidebarMenuMainCompiance };
