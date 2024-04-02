/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { useIntl } from 'react-intl'
import { KTSVG } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const orgId = Number(sessionStorage.getItem('orgId'));

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/general/gen001.svg'
        title='Home'
        fontIcon='bi-layers'
      />
      {/* <SidebarMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen049.svg'
        title='People'
        fontIcon='bi-layers'
      /> */}
     

      <SidebarMenuItem
        to='/qradar/alerts'
        title='Alerts'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen044.svg'
      />
      <SidebarMenuItem
        to='/qradar/incidents'
        title='Incidents'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen011.svg'
      />
       {
        orgId == 2 &&
       <SidebarMenuItem
          icon='/media/icons/duotune/communication/com008.svg'
          to='/qradar/application/list'
          title='Applications'
        />
      }
      {
         orgId == 2 &&
        <SidebarMenuItem
          icon='/media/icons/duotune/communication/com009.svg'
          to='/qradar/setinels/list'
          title='Setinels'
        />
      }
      {/* <SidebarMenuItem
        to='/qradar/incidentsPagev2'
        title='Incidentsv1'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen011.svg'
      /> */}
       <SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/general/gen004.svg' title='Playbook'>
        <SidebarMenuItem hasBullet={true} to='/qradar/demo/v1' title='Alert Types' />
        <SidebarMenuItem hasBullet={true} to='/qradar/demoalert/updated' title='Playbook Alert' />
        <SidebarMenuItem hasBullet={true} to='/qradar/demoplaybooks' title='Alert Playbooks' />
      </SidebarMenuItemWithSub>
       <SidebarMenuItem
        to='/qradar/reports'
        icon='/media/icons/duotune/general/gen005.svg'
        title='Reports'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/qradar/channels'
        title='Channels'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/abstract/abs013.svg'
      ></SidebarMenuItem>

      {/* //configuration navigation*/}
      <SidebarMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/coding/cod001.svg'
        title='Configuration'
      >


        <SidebarMenuItem hasBullet={true} to='/qradar/organizations/list' title='Organizations' />
        <SidebarMenuItem hasBullet={true} to='/qradar/users-data/list' title='Users' />
        <SidebarMenuItem hasBullet={true} to='/qradar/organization-tools/list' title='Organization Tools' />
        <SidebarMenuItem hasBullet={true} to='/qradar/ldp-tools/list' title='LDP Tools' />
        <SidebarMenuItem hasBullet={true} to='/qradar/rules-engine/list' title='Rules' />
        <SidebarMenuItem hasBullet={true} to='/qradar/rules-actions/list' title='Rules Actions' />
        <SidebarMenuItem hasBullet={true} to='/qradar/tool-actions/list' title='Tool Actions' />
        <SidebarMenuItem hasBullet={true} to='/qradar/tool-type-actions/list' title='Tool Type Actions' />
        <SidebarMenuItem hasBullet={true} to='/qradar/roles-data/list' title='Roles' />
        <SidebarMenuItem hasBullet={true} to='/qradar/master-data/list' title='Master Data' />

        {/* <SidebarMenuItem hasBullet={true} to='/qradar/master-data/list' title='Master Data' /> */}

      </SidebarMenuItemWithSub>
      {/* <SidebarMenuItem
          icon='/media/icons/duotune/communication/com006.svg'
          to='/qradar/profile'
          title='Users Profile'
        /> */}
        <SidebarMenuItem
          icon='/media/icons/duotune/communication/com007.svg'
          to='/qradar/tasks/list'
          title='My Tasks'
        />

     
      {/* <SidebarMenuItem
        icon='/media/icons/duotune/communication/com012.svg'
        to='/apps/chat/group-chat'
        title='Chat'
      /> */}
      {/* <SidebarMenuItem
        to='/qradar/playbooks/list'
        title='Playbooks'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen017.svg'
      /> */}


    
      
       
    </>
  )
}

export { SidebarMenuMain }
