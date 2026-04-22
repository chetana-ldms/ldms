import React from 'react'
import { MarkerType, Position } from 'reactflow'

export const edges = [
  { source: 'dndnode_0', target: 'dndnode_1', id: 'edge-0-1' },
  { source: 'dndnode_1', target: 'dndnode_2', id: 'edge-1-2' },
  { source: 'dndnode_2', target: 'dndnode_3', id: 'edge-2-3' },
  { source: 'dndnode_3', target: 'dndnode_4', id: 'edge-3-4' },
  { source: 'dndnode_3', target: 'dndnode_6', id: 'edge-3-6' },
  { source: 'dndnode_6', target: 'dndnode_7', id: 'edge-6-7' },
  { source: 'dndnode_3', target: 'dndnode_7', id: 'edge-3-7' },

  // ✅ All steps connected to LDC Query
  { source: 'dndnode_7', target: 'dndnode_ping', id: 'edge-7-ping' },
  { source: 'dndnode_7', target: 'dndnode_remote', id: 'edge-7-remote' },
  { source: 'dndnode_7', target: 'dndnode_ShowvlanStatus', id: 'edge-7-showvlan' },
  { source: 'dndnode_7', target: 'dndnode_ipinterface', id: 'edge-7-ipinterface' },
  { source: 'dndnode_7', target: 'dndnode_systemctl', id: 'edge-7-systemctl' },
  { source: 'dndnode_7', target: 'dndnode_validate_port', id: 'edge-7-validate' },
  { source: 'dndnode_7', target: 'dndnode_Configuration_mode_end', id: 'edge-7-configend' },
  { source: 'dndnode_7', target: 'dndnode_Save_vlanConfiguration', id: 'edge-7-saveconfig' },
  { source: 'dndnode_7', target: 'dndnode_Verify_vlan_Status', id: 'edge-7-verifyvlan' },
  { source: 'dndnode_7', target: 'dndnode_reviewlogs_firewall', id: 'edge-7-review' },
]

export const dndinitialNodes = [
  {
    id: 'dndnode_0',
    type: 'input',
    position: { x: 75, y: 75 },
    className: 'alerts_node',
    data: { label: 'Alerts' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: 'dndnode_1',
    type: 'default',
    position: { x: 90, y: 120 },
    className: 'check_hostname_ip',
    data: { label: 'Check for HostName IP Address SQL* 192.168.144 X' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: 'dndnode_2',
    type: 'default',
    position: { x: 120, y: 180 },
    className: 'check_for_connection',
    data: { label: 'Check for Connection' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: 'dndnode_3',
    type: 'default',
    position: { x: 210, y: 210 },
    className: 'cdc_out',
    data: { label: 'LDC Out' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: 'dndnode_4',
    type: 'output',
    position: { x: 300, y: 150 },
    className: 'dba_admin',
    data: { label: 'DBA Admin' },
    targetPosition: 'left',
  },
  {
    id: 'dndnode_7',
    type: 'default',
    position: { x: 300, y: 240 },
    className: 'cdc_query',
    data: { label: 'LDC Query' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },

  // ✅ Steps (all connected to LDC Query)
  { id: 'dndnode_ping', type: 'default', position: { x: 500, y: 120 }, data: { label: 'Ping : IP' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_remote', type: 'default', position: { x: 500, y: 150 }, data: { label: 'Establish Remote Session: SSH' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_ShowvlanStatus', type: 'default', position: { x: 500, y: 180 }, data: { label: 'Show VLAN Status' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_ipinterface', type: 'default', position: { x: 500, y: 210 }, data: { label: 'Enter configuration mode' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_systemctl', type: 'default', position: { x: 500, y: 240 }, data: { label: 'Enable VLAN : VLAN Name' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_validate_port', type: 'default', position: { x: 500, y: 270 }, data: { label: 'Re-configure VLAN : no Shutdown' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_Configuration_mode_end', type: 'default', position: { x: 500, y: 300 }, data: { label: 'Configuration mode end' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_Save_vlanConfiguration', type: 'default', position: { x: 500, y: 330 }, data: { label: 'Save VLAN Configuration' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_Verify_vlan_Status', type: 'default', position: { x: 500, y: 360 }, data: { label: 'Verify VLAN Status' }, sourcePosition: 'right', targetPosition: 'left' },
  { id: 'dndnode_reviewlogs_firewall', type: 'default', position: { x: 500, y: 390 }, data: { label: 'Ping : IP' }, sourcePosition: 'right', targetPosition: 'left' },
]
