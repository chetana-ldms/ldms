/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const intl = useIntl()

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
        to='/qradar/reports'
        icon='/media/icons/duotune/general/gen005.svg'
        title='Reports'
        fontIcon='bi-layers'
      />

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
        <SidebarMenuItem
          hasBullet={true}
          to='/qradar/tool-type-actions/list'
          title='Tool Type Actions'
        />
        <SidebarMenuItem hasBullet={true} to='/qradar/organizations/list' title='Organizations' />
        <SidebarMenuItem hasBullet={true} to='/qradar/users-data/list' title='Users' />
        <SidebarMenuItem hasBullet={true} to='/qradar/ldp-tools/list' title='LDP Tools' />
        <SidebarMenuItem hasBullet={true} to='/qradar/tool-actions/list' title='Tool Actions' />
        <SidebarMenuItem
          hasBullet={true}
          to='/qradar/organization-tools/list'
          title='Organization Tools'
        />
        <SidebarMenuItem hasBullet={true} to='/qradar/rules-engine/list' title='Rules' />
        <SidebarMenuItem hasBullet={true} to='/qradar/rules-actions/list' title='Rules Actions' />
        <SidebarMenuItem hasBullet={true} to='/qradar/master-data/list' title='Master Data' />

        {/* <SidebarMenuItem hasBullet={true} to='/qradar/master-data/list' title='Master Data' /> */}
        <SidebarMenuItem hasBullet={true} to='/qradar/roles-data/list' title='Roles' />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/general/gen004.svg' title='Demo'>
        <SidebarMenuItem hasBullet={true} to='/qradar/demo/v1' title='Demo' />
        <SidebarMenuItem hasBullet={true} to='/qradar/demoalert/updated' title='Demo Alert' />
        <SidebarMenuItem hasBullet={true} to='/qradar/demoplaybooks' title='Demo Playbooks' />
      </SidebarMenuItemWithSub>
      {/* <SidebarMenuItem
        icon='/media/icons/duotune/communication/com012.svg'
        to='/apps/chat/group-chat'
        title='Chat'
      /> */}
      <SidebarMenuItem
        to='/qradar/playbooks/list'
        title='Playbooks'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen017.svg'
      />
      {/* <SidebarMenuItem
        to='/apps/help'
        title='Help'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/general/gen026.svg'
      /> */}
      {/* <SidebarMenuItem
        to='/apps/user-management/users'
        icon='/media/icons/duotune/general/gen051.svg'
        title='Notifications '
        fontIcon='bi-layers'
      /> */}
      <SidebarMenuItem
        icon='/media/icons/duotune/communication/com006.svg'
        to='/crafted/account/overview'
        title='Profile'
      />
      {/* <SidebarMenuItem
        icon='/media/icons/duotune/coding/cod001.svg'
        to='/apps/chat/settings'
        title='Settings'
      /> */}
    </>
  )
}

export {SidebarMenuMain}
