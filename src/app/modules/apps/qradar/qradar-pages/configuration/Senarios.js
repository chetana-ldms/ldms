import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useErrorBoundary} from 'react-error-boundary'
import {useSelector} from 'react-redux'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {fetchExportDataAddUrl} from '../../../../../api/Api'
import {fetchSecuritySenariosUrl} from '../../../../../api/ConfigurationApi'

const Senarios = () => {
  const navigate = useNavigate()
  const userData = useSelector((state) => state?.user?.userData)

  const handleError = useErrorBoundary()

  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // =========================
  // FETCH DATA
  // =========================

  const reload = async () => {
    try {
      setLoading(true)

      const response = await fetchSecuritySenariosUrl()

      setTools(response?.data || [])
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  // =========================
  // SORTING
  // =========================

  const sortedList = [...(tools || [])].sort((a, b) => {
    const aVal = a.parentScenarioName || ''
    const bVal = b.parentScenarioName || ''

    if (aVal === '' && bVal !== '') return -1
    if (aVal !== '' && bVal === '') return 1

    return 0
  })

  // =========================
  // EXPORT CSV
  // =========================

  const exportToExcel = async () => {
    const dataToExport = sortedList || []

    let csvContent = 'Senarios Report\n'

    csvContent +=
      'Scenario Name,Parent Scenario Name\n' +
      dataToExport
        .map(
          (item) =>
            `${item.scenarioName || ''},${
              item.parentScenarioName || ''
            }`
        )
        .join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const link = document.createElement('a')

    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)

    link.setAttribute('download', 'senarios_report.csv')

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    try {
      await fetchExportDataAddUrl({
        createdDate: new Date().toISOString(),
        createdUserId: Number(sessionStorage.getItem('userId')),
        orgId: Number(sessionStorage.getItem('orgId')),
        exportDataType: 'Senarios',
      })
    } catch (error) {
      console.error(error)
    }
  }

  // =========================
  // BUILD TREE
  // =========================

  const buildScenarioTree = (data) => {
    const map = {}

    const roots = []

    // create node map
    data.forEach((item) => {
      map[item.scenarioName] = {
        ...item,
        children: [],
      }
    })

    // build parent-child relation
    data.forEach((item) => {
      if (item.parentScenarioName) {
        const parent = map[item.parentScenarioName]

        if (parent) {
          parent.children.push(map[item.scenarioName])
        }
      } else {
        roots.push(map[item.scenarioName])
      }
    })

    return roots
  }

  const scenarioTree = buildScenarioTree(sortedList)

  // =========================
  // TREE NODE
  // =========================

  const TreeNode = ({node}) => {
    const [open, setOpen] = useState(true)

    return (
      <li style={{listStyle: 'none', marginBottom: '10px'}}>
        <div
          style={{
            cursor: 'pointer',
            padding: '5px 10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            background: '#f8f9fa',
            display: 'inline-block',
          }}
          onClick={() => setOpen(!open)}
        >
          {node.children.length > 0 ? (
            <span>
              {open ? '📂' : '📁'} {node.scenarioName}
            </span>
          ) : (
            <span>📄 {node.scenarioName}</span>
          )}
        </div>

        {open && node.children.length > 0 && (
          <ul style={{marginLeft: '30px', marginTop: '10px'}}>
            {node.children.map((child) => (
              <TreeNode
                key={child.scenarioId}
                node={child}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className='card pad-10 config'>
      <ToastContainer />

      {/* HEADER */}

      <div className='card-header no-pad'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Senarios ({tools.length})
          </span>
        </h3>

        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Dropdown
              isOpen={dropdownOpen}
              toggle={() => setDropdownOpen(!dropdownOpen)}
            >
              <DropdownToggle className='btn btn-small btn-light' caret>
                Export{' '}
                <i className='fa fa-file-export link mg-left-10' />
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem onClick={exportToExcel}>
                  Export to CSV{' '}
                  <i className='fa fa-file-excel link float-right' />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className='card-body no-pad'>
        {loading ? (
          <UsersListLoading />
        ) : (
          <div className='card mt-5 p-5'>
            <h3 className='mb-5'>Scenario Tree</h3>

            {scenarioTree.length > 0 ? (
              <ul style={{paddingLeft: '0px'}}>
                {scenarioTree.map((node) => (
                  <TreeNode
                    key={node.scenarioId}
                    node={node}
                  />
                ))}
              </ul>
            ) : (
              <div>No tree data found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export {Senarios}