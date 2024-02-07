
import React from 'react'
import { useIntl } from 'react-intl'
import { SidebarMenuItem } from '../_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem'
import { SidebarMenuItemWithSub } from '../_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItemWithSub'

const SidebarMenuMainCompiance = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItem
        to='/dashboardCompliance'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Drata Partners >'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/quickstart'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Quick Start'
        fontIcon='bi-layers'
      />
      {/* <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Dashboard'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Tasks'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Compliance'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Controle'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Frameworks'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Monitoring'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Event Tracking'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Connections'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Connected Person'
        fontIcon='bi-layers'
      /> */}
    
    </>
  )
}

export { SidebarMenuMainCompiance }
