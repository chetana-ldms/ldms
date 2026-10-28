import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {fetchgetExecutionDetailsUrl} from '../../../../../api/playBookApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'

/* ─── helpers ────────────────────────────────────────────────────── */
const parseJson = (value, fallback) => {
  if (typeof value !== 'string') return value ?? fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const formatDuration = (ms) => {
  if (ms == null) return '--'
  const totalSec = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const formatDateTime = (iso) => {
  if (!iso) return '--'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

const calcDuration = (start, end) => {
  if (!start || !end) return '--'
  const ms = new Date(end) - new Date(start)
  if (isNaN(ms)) return '--'
  return formatDuration(ms)
}

/* ─── StatusBadge ─────────────────────────────────────────────────── */
const StatusBadge = ({status}) => {
  const s = (status || '').toLowerCase()
  const map = {
    completed: {bg: '#dcfce7', color: '#15803d', dot: '#22c55e'},
    failed: {bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444'},
    pending: {bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af'},
    running: {bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6'},
  }
  const c = map[s] || map['pending']
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 10px',
        borderRadius: 99,
        background: c.bg,
        color: c.color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: c.dot,
          display: 'inline-block',
        }}
      />
      {status || 'Pending'}
    </span>
  )
}

/* ─── FlowStep ────────────────────────────────────────────────────── */
const FlowStep = ({num, label, completed, active}) => {
  const bg = completed ? '#22c55e' : active ? '#3b82f6' : '#d1d5db'
  return (
    <div
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 90}}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: bg,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {completed ? '✓' : num}
      </div>
      <span style={{fontSize: 12, color: '#374151', fontWeight: 500, textAlign: 'center'}}>
        {label}
      </span>
    </div>
  )
}

/* ─── SectionCard ─────────────────────────────────────────────────── */
const SectionCard = ({title, badge, badgeColor, children, defaultOpen = true}) => {
  const [open, setOpen] = useState(defaultOpen)
  const bgMap = {green: '#dcfce7', blue: '#dbeafe', gray: '#f3f4f6'}
  const clrMap = {green: '#15803d', blue: '#1d4ed8', gray: '#374151'}
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        marginBottom: 12,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          cursor: 'pointer',
          borderBottom: open ? '1px solid #f3f4f6' : 'none',
          background: '#f9fafb',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{fontWeight: 600, fontSize: 13, color: '#111827'}}>{title}</span>
          {badge && (
            <span
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 99,
                background: bgMap[badgeColor] || bgMap.gray,
                color: clrMap[badgeColor] || clrMap.gray,
                fontWeight: 600,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <span style={{color: '#9ca3af', fontSize: 12}}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div style={{padding: '12px 14px'}}>{children}</div>}
    </div>
  )
}

/* ─── NodeRow ─────────────────────────────────────────────────────── */
const NodeRow = ({node}) => {
  const s = (node.status || '').toLowerCase()
  const iconColor = node.isSuccess ? '#22c55e' : s === 'failed' ? '#ef4444' : '#d1d5db'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <span style={{fontSize: 16, color: iconColor, lineHeight: 1}}>
        {node.isSuccess ? '✓' : s === 'failed' ? '✗' : '○'}
      </span>
      <span style={{fontSize: 13, color: '#374151', flex: 1}}>
        Node {node.nodeOrder} – {node.nodeName}
      </span>
      <span style={{fontSize: 12, color: '#6b7280', minWidth: 64, textAlign: 'right'}}>
        {node.durationMs != null ? formatDuration(node.durationMs) : '--'}
      </span>
      <StatusBadge status={node.status} />
    </div>
  )
}

/* ─── ExecutionDetails ────────────────────────────────────────────── */
function ExecutionDetails() {
  const {id} = useParams()
  const navigate = useNavigate()
  const [execution, setExecution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resultTab, setResultTab] = useState('summary')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetchgetExecutionDetailsUrl({executionId: Number(id)})
        const result = response?.data ?? response
        setExecution(Array.isArray(result) ? result[0] ?? null : result)
      } catch (err) {
        console.error('Error loading execution details:', err)
        setError('Failed to load execution details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading)
    return (
      <div className='config card pad-10'>
        <div style={{textAlign: 'center', padding: 60, color: '#6b7280'}}>
          Loading execution details…
        </div>
      </div>
    )
  if (error)
    return (
      <div className='config card pad-10'>
        <div style={{textAlign: 'center', padding: 60, color: '#ef4444'}}>{error}</div>
      </div>
    )
  if (!execution)
    return (
      <div className='config card pad-10'>
        <div style={{textAlign: 'center', padding: 60, color: '#6b7280'}}>
          Execution details not found.
        </div>
      </div>
    )

  const standardizedData = parseJson(execution.standardizedData, null)
  const matchedRules = parseJson(execution.matchedRules, [])
  const playbookExecutions = execution.playbookExecutions ?? []
  const overallStatus = execution.status || 'Unknown'
  const isSuccess = overallStatus.toLowerCase() === 'completed'
  const totalDuration = calcDuration(execution.startedAt, execution.completedAt)

  const step1Done = !!standardizedData
  const step2Done = Array.isArray(matchedRules) && matchedRules.length > 0
  const step3Done = playbookExecutions.length > 0
  const step3Active = step2Done && !step3Done

  const TABS = [
    {id: 'summary', label: 'Summary'},
    {id: 'node-details', label: 'Node Details'},
    {id: 'final-output', label: 'Final Output'},
    {id: 'logs', label: 'Logs'},
  ]

  return (
    <div style={{background: '#f8f9fb', minHeight: '100vh'}}>
      {/* Header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{margin: 0, fontSize: 20, fontWeight: 700, color: '#111827'}}>
            Execution Details
          </h2>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 12,
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Execution ID: {execution.executionId ?? id} &nbsp;|&nbsp;{' '}
            <StatusBadge status={overallStatus} />
          </p>
        </div>
        <button
          type='button'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 16px',
            borderRadius: 7,
            border: '1px solid #d1d5db',
            background: '#fff',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* 2-column body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 16,
          padding: 20,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Execution Flow ── */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f3f4f6',
              fontWeight: 700,
              fontSize: 15,
              color: '#111827',
            }}
          >
            Execution Flow
          </div>

          {/* step indicators */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 24px',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <FlowStep num={1} label='Standardization' completed={step1Done} active={!step1Done} />
            <div
              style={{
                flex: 1,
                height: 2,
                background: step1Done ? '#22c55e' : '#e5e7eb',
                marginBottom: 20,
              }}
            />
            <FlowStep
              num={2}
              label='Rule Evaluation'
              completed={step2Done}
              active={step1Done && !step2Done}
            />
            <div
              style={{
                flex: 1,
                height: 2,
                background: step2Done ? '#22c55e' : '#e5e7eb',
                marginBottom: 20,
              }}
            />
            <FlowStep
              num={3}
              label='Playbook Execution'
              completed={step3Done}
              active={step3Active}
            />
          </div>

          {/* step detail cards */}
          <div style={{padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12}}>
            {/* Step 1 – Standardization */}
            <SectionCard title='1. Standardization' badge='Completed' badgeColor='green'>
              <p style={{margin: '0 0 10px', fontSize: 12, color: '#6b7280'}}>
                Raw alert data was converted to standardized format.
              </p>
              {standardizedData ? (
                <>
                  <div style={{fontWeight: 600, fontSize: 12, color: '#374151', marginBottom: 6}}>
                    Standardized Data
                  </div>
                  <pre
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      padding: '10px 12px',
                      fontSize: 12,
                      margin: 0,
                      overflowX: 'auto',
                      color: '#374151',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {JSON.stringify(standardizedData, null, 2)}
                  </pre>
                </>
              ) : (
                <span style={{color: '#9ca3af', fontSize: 12}}>
                  No standardized data available.
                </span>
              )}
            </SectionCard>

            {/* Step 2 – Rule Evaluation */}
            <SectionCard
              title='2. Rule Evaluation'
              badge={step2Done ? 'Completed' : 'Pending'}
              badgeColor={step2Done ? 'green' : 'gray'}
            >
              <p style={{margin: '0 0 10px', fontSize: 12, color: '#6b7280'}}>
                Matched rules for the standardized data.
              </p>
              {Array.isArray(matchedRules) && matchedRules.length > 0 ? (
                <>
                  <div style={{fontWeight: 600, fontSize: 12, color: '#374151', marginBottom: 6}}>
                    Matched Rules
                  </div>
                  {matchedRules.map((rule, idx) => (
                    <div
                      key={rule.RuleId ?? idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        marginBottom: 6,
                        background: '#f9fafb',
                        fontSize: 13,
                      }}
                    >
                      <span style={{color: '#374151', fontWeight: 500}}>
                        Rule {rule.RuleId} – {rule.RuleName}
                      </span>
                      {Array.isArray(rule.PlaybookIds) && rule.PlaybookIds.length > 0 && (
                        <span style={{fontSize: 11, color: '#6b7280'}}>
                          Playbooks: {rule.PlaybookIds.join(', ')}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <span style={{color: '#9ca3af', fontSize: 12}}>No matched rules.</span>
              )}
            </SectionCard>

            {/* Step 3 – Playbook Execution */}
            {(() => {
              const pb3Status =
                playbookExecutions.length === 0
                  ? 'Pending'
                  : playbookExecutions.every((p) => p.status?.toLowerCase() === 'completed')
                  ? 'Completed'
                  : playbookExecutions.some((p) => p.status?.toLowerCase() === 'failed')
                  ? 'Failed'
                  : 'Running'
              const pb3Color =
                pb3Status === 'Completed' ? 'green' : pb3Status === 'Failed' ? 'gray' : 'gray'
              return (
                <SectionCard title='3. Playbook Execution' badge={pb3Status} badgeColor={pb3Color}>
                  {playbookExecutions.length === 0 ? (
                    <span style={{color: '#9ca3af', fontSize: 12}}>
                      No playbook executions recorded.
                    </span>
                  ) : (
                    playbookExecutions.map((pb, pbIdx) => (
                      <div key={pb.playbookExecutionId ?? pbIdx} style={{marginBottom: 12}}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: '#eff6ff',
                            borderRadius: 6,
                            marginBottom: 4,
                          }}
                        >
                          <span style={{fontSize: 14, color: '#3b82f6'}}>●</span>
                          <span style={{fontWeight: 600, fontSize: 13, color: '#1d4ed8', flex: 1}}>
                            Playbook {pb.playbookId}
                          </span>
                          <span style={{fontSize: 12, color: '#6b7280'}}>
                            {formatDuration(pb.durationMs)}
                          </span>
                          <StatusBadge status={pb.status} />
                        </div>
                        <div
                          style={{border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden'}}
                        >
                          {(pb.nodeExecutions ?? []).length === 0 ? (
                            <div style={{padding: '10px 12px', color: '#9ca3af', fontSize: 12}}>
                              No node executions.
                            </div>
                          ) : (
                            (pb.nodeExecutions ?? [])
                              .slice()
                              .sort((a, b) => (a.nodeOrder ?? 0) - (b.nodeOrder ?? 0))
                              .map((node) => <NodeRow key={node.nodeExecutionId} node={node} />)
                          )}
                        </div>
                        {pb.finalOutput && (
                          <div style={{marginTop: 8}}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 12,
                                color: '#374151',
                                marginBottom: 4,
                              }}
                            >
                              Final Output
                            </div>
                            <pre
                              style={{
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                padding: '8px 12px',
                                fontSize: 12,
                                margin: 0,
                                overflowX: 'auto',
                                color: '#374151',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                              }}
                            >
                              {JSON.stringify(parseJson(pb.finalOutput, pb.finalOutput), null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </SectionCard>
              )
            })()}
          </div>
        </div>

        {/* ── RIGHT: Execution Result ── */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {/* title + total time */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{fontWeight: 700, fontSize: 15, color: '#111827'}}>Execution Result</span>
            <div
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                padding: '4px 12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Total Time
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#111827',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {totalDuration}
              </div>
            </div>
          </div>

          {/* status banner */}
          <div style={{padding: '12px 16px', borderBottom: '1px solid #f3f4f6'}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 14px',
                background: isSuccess ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 8,
              }}
            >
              <span style={{fontSize: 20, lineHeight: 1, marginTop: 1}}>
                {isSuccess ? '✅' : '❌'}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: isSuccess ? '#15803d' : '#b91c1c',
                    marginBottom: 2,
                  }}
                >
                  {isSuccess ? 'Playbook Execution Completed' : 'Playbook Execution Failed'}
                </div>
                <div style={{fontSize: 12, color: isSuccess ? '#166534' : '#991b1b'}}>
                  {execution.message || '--'}
                </div>
              </div>
            </div>
            {execution.errorDetails && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginTop: 8,
                  padding: '8px 12px',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#9a3412',
                }}
              >
                <span>⚠️</span>
                <span>{execution.errorDetails}</span>
              </div>
            )}
          </div>

          {/* tabs */}
          <div style={{display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 16px'}}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => setResultTab(tab.id)}
                style={{
                  padding: '8px 12px',
                  fontSize: 13,
                  fontWeight: resultTab === tab.id ? 600 : 400,
                  color: resultTab === tab.id ? '#3b82f6' : '#6b7280',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    resultTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div style={{padding: '14px 16px'}}>
            {/* Summary */}
            {resultTab === 'summary' && (
              <div>
                {playbookExecutions.map((pb, idx) => (
                  <div key={pb.playbookExecutionId ?? idx} style={{marginBottom: 16}}>
                    <div style={{fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8}}>
                      Playbook Summary
                    </div>
                    <table style={{width: '100%', fontSize: 12, borderCollapse: 'collapse'}}>
                      <tbody>
                        {[
                          ['Playbook ID', pb.playbookId ?? '--'],
                          ['Status', <StatusBadge status={pb.status} />],
                          ['Message', pb.message || '--'],
                          ['Duration', formatDuration(pb.durationMs)],
                          ['Started At', getCurrentTimeZone(pb.startedAt)],
                          ['Completed At', getCurrentTimeZone(pb.completedAt)],
                        ].map(([label, val]) => (
                          <tr key={label} style={{borderBottom: '1px solid #f3f4f6'}}>
                            <td
                              style={{
                                padding: '6px 0',
                                color: '#6b7280',
                                fontWeight: 500,
                                width: '45%',
                                verticalAlign: 'top',
                              }}
                            >
                              {label}
                            </td>
                            <td style={{padding: '6px 0', color: '#111827', verticalAlign: 'top'}}>
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                <div style={{fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8}}>
                  Overall Summary
                </div>
                <table style={{width: '100%', fontSize: 12, borderCollapse: 'collapse'}}>
                  <tbody>
                    {[
                      ['Execution ID', execution.executionId ?? id],
                      ['Tool ID', execution.toolId ?? '--'],
                      ['Alert ID', execution.alertId ?? '--'],
                      ['Target Host', execution.targetHost ?? '--'],
                      ['Status', <StatusBadge status={overallStatus} />],
                      ['Started At', getCurrentTimeZone(execution.startedAt)],
                      ['Completed At', getCurrentTimeZone(execution.completedAt)],
                      ['Log Trace ID', execution.logTraceId ?? '--'],
                    ].map(([label, val]) => (
                      <tr key={label} style={{borderBottom: '1px solid #f3f4f6'}}>
                        <td
                          style={{
                            padding: '6px 0',
                            color: '#6b7280',
                            fontWeight: 500,
                            width: '45%',
                            verticalAlign: 'top',
                          }}
                        >
                          {label}
                        </td>
                        <td
                          style={{
                            padding: '6px 0',
                            color: '#111827',
                            wordBreak: 'break-all',
                            verticalAlign: 'top',
                          }}
                        >
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Node Details */}
            {resultTab === 'node-details' && (
              <div>
                {playbookExecutions.length === 0 ? (
                  <span style={{color: '#9ca3af', fontSize: 12}}>No node execution data.</span>
                ) : (
                  playbookExecutions.map((pb, pbIdx) => (
                    <div key={pb.playbookExecutionId ?? pbIdx} style={{marginBottom: 16}}>
                      <div
                        style={{fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8}}
                      >
                        Playbook {pb.playbookId} – Node Execution Details
                      </div>
                      <table
                        style={{
                          width: '100%',
                          fontSize: 12,
                          borderCollapse: 'collapse',
                          border: '1px solid #e5e7eb',
                          borderRadius: 6,
                        }}
                      >
                        <thead>
                          <tr style={{background: '#f9fafb'}}>
                            {['Node Name', 'Status', 'Time', 'Output', 'Error'].map((h) => (
                              <th
                                key={h}
                                style={{
                                  padding: '6px 10px',
                                  textAlign: 'left',
                                  fontWeight: 600,
                                  color: '#6b7280',
                                  borderBottom: '1px solid #e5e7eb',
                                }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(pb.nodeExecutions ?? [])
                            .slice()
                            .sort((a, b) => (a.nodeOrder ?? 0) - (b.nodeOrder ?? 0))
                            .map((node) => (
                              <tr
                                key={node.nodeExecutionId}
                                style={{borderBottom: '1px solid #f3f4f6'}}
                              >
                                <td style={{padding: '6px 10px', color: '#374151'}}>
                                  {node.nodeName}
                                </td>
                                <td style={{padding: '6px 10px'}}>
                                  <StatusBadge status={node.status} />
                                </td>
                                <td
                                  style={{
                                    padding: '6px 10px',
                                    color: '#374151',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {node.durationMs != null ? formatDuration(node.durationMs) : '--'}
                                </td>
                                <td
                                  style={{
                                    padding: '6px 10px',
                                    color: '#374151',
                                    fontSize: 11,
                                    maxWidth: 120,
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {node.output || '--'}
                                </td>
                                <td style={{padding: '6px 10px', color: '#ef4444', fontSize: 11}}>
                                  {node.errorDetails || '--'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Final Output */}
            {resultTab === 'final-output' && (
              <div>
                {playbookExecutions.length === 0 ? (
                  <span style={{color: '#9ca3af', fontSize: 12}}>No final output available.</span>
                ) : (
                  playbookExecutions.map((pb, idx) => (
                    <div key={pb.playbookExecutionId ?? idx} style={{marginBottom: 12}}>
                      <div
                        style={{fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6}}
                      >
                        Playbook {pb.playbookId}
                      </div>
                      <pre
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: 6,
                          padding: '10px 12px',
                          fontSize: 12,
                          margin: 0,
                          overflowX: 'auto',
                          color: '#374151',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {JSON.stringify(parseJson(pb.finalOutput, pb.finalOutput), null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Logs */}
            {resultTab === 'logs' && (
              <div>
                <div style={{fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 8}}>
                  Execution Log
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12}}>
                  {[
                    {time: execution.startedAt, label: 'Execution started', color: '#3b82f6'},
                    ...(Array.isArray(matchedRules) && matchedRules.length > 0
                      ? [
                          {
                            time: execution.startedAt,
                            label: `Matched ${matchedRules.length} rule(s)`,
                            color: '#22c55e',
                          },
                        ]
                      : []),
                    ...playbookExecutions.flatMap((pb) => [
                      {
                        time: pb.startedAt,
                        label: `Playbook ${pb.playbookId} started`,
                        color: '#8b5cf6',
                      },
                      ...(pb.nodeExecutions ?? [])
                        .slice()
                        .sort((a, b) => (a.nodeOrder ?? 0) - (b.nodeOrder ?? 0))
                        .map((n) => ({
                          time: n.completedAt,
                          label: `Node "${n.nodeName}" – ${n.status}${
                            n.output ? ` (${n.output})` : ''
                          }`,
                          color: n.isSuccess ? '#22c55e' : '#ef4444',
                        })),
                      {
                        time: pb.completedAt,
                        label: `Playbook ${pb.playbookId} ${pb.status}`,
                        color: pb.status?.toLowerCase() === 'completed' ? '#22c55e' : '#ef4444',
                      },
                    ]),
                    {
                      time: execution.completedAt,
                      label: 'Execution completed',
                      color: isSuccess ? '#22c55e' : '#ef4444',
                    },
                  ]
                    .filter((e) => e.time)
                    .map((entry, i) => (
                      <div key={i} style={{display: 'flex', gap: 8, alignItems: 'flex-start'}}>
                        <span
                          style={{color: entry.color, fontSize: 14, lineHeight: 1, marginTop: 1}}
                        >
                          ●
                        </span>
                        <div style={{flex: 1}}>
                          <span style={{color: '#374151'}}>{entry.label}</span>
                          <span style={{color: '#9ca3af', marginLeft: 8, fontSize: 11}}>
                            {formatDateTime(entry.time)}
                          </span>
                        </div>
                      </div>
                    ))}
                  {execution.logTraceId && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '6px 10px',
                        background: '#f9fafb',
                        borderRadius: 6,
                        color: '#6b7280',
                        fontSize: 11,
                      }}
                    >
                      Log Trace ID: {execution.logTraceId}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutionDetails
