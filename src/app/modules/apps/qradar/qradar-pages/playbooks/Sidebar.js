import React from 'react'

const Sidebar = ({actions = [], loading = false}) => {
  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/playbookNode', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className='playbook-sidebar'>
      <div className='playbook-sidebar__title'>Nodes</div>

      {/* ── Start / End ── */}
      <details className='playbook-sidebar__group' open>
        <summary className='playbook-sidebar__group-header'>
          <span>Start / End</span>
          <i className='fas fa-chevron-up playbook-sidebar__chevron' />
        </summary>
        <div className='playbook-sidebar__items'>
          <div
            className='playbook-sidebar__item playbook-sidebar__item--start'
            draggable
            onDragStart={(e) =>
              onDragStart(e, {type: 'startNode', label: 'Start', actionId: 0})
            }
          >
            <div className='playbook-sidebar__item-icon playbook-sidebar__item-icon--start'>
              <i className='fas fa-play' />
            </div>
            <span>Start</span>
          </div>
          <div
            className='playbook-sidebar__item playbook-sidebar__item--end'
            draggable
            onDragStart={(e) =>
              onDragStart(e, {type: 'endNode', label: 'End', actionId: 0})
            }
          >
            <div className='playbook-sidebar__item-icon playbook-sidebar__item-icon--end'>
              <i className='fas fa-stop' />
            </div>
            <span>End</span>
          </div>
        </div>
      </details>

      {/* ── Actions (from Action Master API) ── */}
      <details className='playbook-sidebar__group' open>
        <summary className='playbook-sidebar__group-header'>
          <span>Action</span>
          <i className='fas fa-chevron-up playbook-sidebar__chevron' />
        </summary>
        <div className='playbook-sidebar__items'>
          {loading && (
            <div className='playbook-sidebar__loading'>
              <span className='spinner-border spinner-border-sm me-2' />
              Loading...
            </div>
          )}
          {!loading && actions.length === 0 && (
            <div className='playbook-sidebar__empty'>No actions found</div>
          )}
          {!loading &&
            actions.map((action) => (
              <div
                key={action.actionId}
                className='playbook-sidebar__item playbook-sidebar__item--action'
                draggable
                onDragStart={(e) =>
                  onDragStart(e, {
                    type: 'actionNode',
                    label: action.actionName || action.name || `Action ${action.actionId}`,
                    actionId: action.actionId,
                  })
                }
                title={action.actionName || action.name}
              >
                <div className='playbook-sidebar__item-icon playbook-sidebar__item-icon--action'>
                  <i className='fas fa-bolt' />
                </div>
                <span className='playbook-sidebar__item-label'>
                  {action.actionName || action.name || `Action ${action.actionId}`}
                </span>
              </div>
            ))}
        </div>
      </details>
    </aside>
  )
}

export default Sidebar
