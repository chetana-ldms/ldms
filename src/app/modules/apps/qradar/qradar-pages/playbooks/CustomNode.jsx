import React, {memo} from 'react'
import {Handle, Position} from 'reactflow'

// ──────────────── Start Node ────────────────
export const StartNode = memo(({data, selected}) => {
  return (
    <div
      className={`playbook-node playbook-node--start ${selected ? 'playbook-node--selected' : ''}`}
    >
      <div className='playbook-node__icon'>
        <i className='fas fa-play' />
      </div>
      <span className='playbook-node__label'>Start</span>
      <Handle type='source' position={Position.Bottom} id='out' />
    </div>
  )
})
StartNode.displayName = 'StartNode'

// ──────────────── End Node ────────────────
export const EndNode = memo(({data, selected}) => {
  return (
    <div
      className={`playbook-node playbook-node--end ${selected ? 'playbook-node--selected' : ''}`}
    >
      <Handle type='target' position={Position.Top} id='in' />
      <div className='playbook-node__icon'>
        <i className='fas fa-stop' />
      </div>
      <span className='playbook-node__label'>End</span>
    </div>
  )
})
EndNode.displayName = 'EndNode'

// ──────────────── Action Node ────────────────
export const ActionNode = memo(({data, selected}) => {
  return (
    <div
      className={`playbook-node playbook-node--action ${selected ? 'playbook-node--selected' : ''}`}
    >
      <Handle type='target' position={Position.Top} id='in' />
      <div className='playbook-node__header'>
        <div className='playbook-node__icon-wrap'>
          <i className='fas fa-bolt' />
        </div>
        <div className='playbook-node__info'>
          <div className='playbook-node__title'>{data.label || 'Action'}</div>
          <div className='playbook-node__type'>Action</div>
        </div>
        <div className='playbook-node__menu'>
          <i className='fas fa-ellipsis-v' />
        </div>
      </div>
      <Handle type='source' position={Position.Bottom} id='out' />
    </div>
  )
})
ActionNode.displayName = 'ActionNode'

export default {StartNode, EndNode, ActionNode}
