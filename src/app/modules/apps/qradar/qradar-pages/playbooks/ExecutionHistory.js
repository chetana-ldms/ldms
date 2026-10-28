import React, {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {fetchgetExecutionHistoryUrl} from '../../../../../api/playBookApi'
import { getCurrentTimeZone } from '../../../../../../utils/helper'

const PAGE_SIZE = 20

const parseJson = (value, fallback) => {
  if (typeof value !== 'string') return value ?? fallback
  try {
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

function ExecutionHistory() {
  const navigate = useNavigate()
  const [executions, setExecutions] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetchgetExecutionHistoryUrl({pageNumber, pageSize: PAGE_SIZE})
      const rows = Array.isArray(response) ? response : response?.data
      setExecutions(Array.isArray(rows) ? rows : [])
    } catch (requestError) {
      console.error('Error loading execution history:', requestError)
      setExecutions([])
      setError('Failed to load execution history.')
    } finally {
      setLoading(false)
    }
  }, [pageNumber])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return (
    <div className='config card pad-10'>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h3 className='card-label fw-bold fs-3 mb-1'>Execution History</h3>
        <span className='text-muted fs-7'>Page {pageNumber}</span>
      </div>

      <div className='card-body no-pad mt-3'>
        <div className='table-responsive'>
          <table className='table align-middle gs-0 gy-4 dash-table alert-table'>
            <thead>
              <tr className='fw-bold text-muted bg-blue'>
                <th>Execution ID</th>
                <th>Status</th>
                <th>Matched Rules</th>
                <th>Started At</th>
                <th>Completed At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='6' className='text-center'>
                    Loading execution history...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan='6' className='text-center'>
                    {error}
                  </td>
                </tr>
              ) : executions.length ? (
                executions.map((execution) => {
                  const standardizedData = parseJson(execution.standardizedData, null)
                  const matchedRules = parseJson(execution.matchedRules, [])
                  return (
                    <tr key={execution.executionId} className='fs-12'>
                      <td>{execution.executionId ?? '--'}</td>
                      <td>
                        <span className='badge badge-light-primary'>
                          {execution.status || '--'}
                        </span>
                      </td>

                      <td className='text-wrap'>
                        {Array.isArray(matchedRules) && matchedRules.length
                          ? matchedRules.map((rule, index) => (
                              <div key={rule.RuleId ?? index}>
                                {rule.RuleName || `Rule ${rule.RuleId ?? ''}`}
                              </div>
                            ))
                          : '--'}
                      </td>
                      <td>{getCurrentTimeZone(execution.startedAt)}</td>
                      <td>{getCurrentTimeZone(execution.completedAt)}</td>
                      <td>
                        <button
                          type='button'
                          className='btn btn-sm btn-light-primary'
                          onClick={() => navigate(`/qradar/execution-details/${execution.executionId}`)}
                          disabled={!execution.executionId}
                        >
                          More Details
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan='6' className='text-center'>
                    No execution history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='d-flex justify-content-end gap-2 mt-3'>
          <button
            type='button'
            className='btn btn-sm btn-light'
            onClick={() => setPageNumber((page) => Math.max(1, page - 1))}
            disabled={loading || pageNumber === 1}
          >
            Previous
          </button>
          <button
            type='button'
            className='btn btn-sm btn-light'
            onClick={() => setPageNumber((page) => page + 1)}
            disabled={loading || executions.length < PAGE_SIZE}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExecutionHistory
