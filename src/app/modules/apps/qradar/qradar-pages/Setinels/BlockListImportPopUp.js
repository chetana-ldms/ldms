import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button, Dropdown, Form} from 'react-bootstrap'
import {fetchAccountsStructureUrl, fetchOrganizations} from '../../../../../api/Api'
import {
  fetchBlockedListImportReportUrl,
  fetchBlockedListImportUrl,
} from '../../../../../api/SentinalApi'
import {notify, notifyFail} from '../components/notification/Notification'

const BlockListImportPopUp = ({show, onClose, refreshParent}) => {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const CreatedUserId = Number(sessionStorage.getItem('userId'))
  const date = new Date().toISOString()
  const toolId = Number(sessionStorage.getItem('toolID'))
  const accountNames = sessionStorage.getItem('accountName')
  const [organizations, setOrganizations] = useState([])
  const [accountNameId, setAccountNameId] = useState(sessionStorage.getItem('accountId') || '')
  const [siteNameId, setSiteNameId] = useState(sessionStorage.getItem('siteId') || '')
  const [groupNameId, setGroupNameId] = useState(sessionStorage.getItem('groupId') || '')
  const [accountName, setAccountName] = useState(sessionStorage.getItem('accountName') || '')
  const [siteName, setSiteName] = useState(sessionStorage.getItem('siteName') || '')
  const [groupName, setGroupName] = useState(sessionStorage.getItem('groupName') || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const siteNames = sessionStorage.getItem('siteName') || ''
  const groupNames = sessionStorage.getItem('groupName') || ''
  const [importSuccess, setImportSuccess] = useState(false)
  const [importAnotherFile, setImportAnotherFile] = useState(false)
  const [count, setCount] = useState({})
  const [reportId, setReportId] = useState(null)
  const fileInputRef = useRef(null)

  const handleAccountClick = (accountId, accountName) => {
    setAccountNameId(accountId)
    setAccountName(accountName)
    setSiteNameId('')
    setSiteName('')
    setGroupNameId('')
    setGroupName('')
  }

  const handleAccordionClick = (name, id) => {
    setSiteNameId(id)
    setSiteName(name)
    setGroupNameId('')
    setGroupName('')
  }

  const handleGroupClick = (name, id) => {
    setGroupNameId(id)
    setGroupName(name)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationsResponse = await fetchOrganizations()
        setOrganizations(organizationsResponse)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const orgNames = organizations.filter((item) => item.orgID === orgId).map((item) => item.orgName)

  const [accountsStructure, setAccountsStructure] = useState([])

  const fetchData = async () => {
    const data = {
      orgID: orgId,
    }
    try {
      const response = await fetchAccountsStructureUrl(data)
      setAccountsStructure(response)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }
  const handleSubmit = async () => {
    if (!selectedFile) {
      notifyFail('Please upload the file')
      return
    }
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('ImportDate', date)
    formData.append('ImportedUserId', CreatedUserId)
    formData.append('OrgId', orgId)
    formData.append('ToolId', toolId)

    if (groupNameId) {
      formData.append('ScopeName', 'GroupId')
      formData.append('ScopeValue', groupNameId)
    } else if (siteNameId) {
      formData.append('ScopeName', 'SiteId')
      formData.append('ScopeValue', siteNameId)
    } else if (accountNameId) {
      formData.append('ScopeName', 'AccountId')
      formData.append('ScopeValue', accountNameId)
    }

    try {
      const response = await fetchBlockedListImportUrl(formData)
      const {isSuccess, message} = response
      if (isSuccess) {
        setCount(response?.data)
        setReportId(response?.data.reportId)
        notify(message)
        setImportSuccess(true)
        setImportAnotherFile(true)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleClose = () => {
    refreshParent()
    onClose()
  }
  const handleSubmitAnotherFile = () => {
    setImportSuccess(false)
    setImportAnotherFile(false)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleDownloadReport = async () => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        reportId: reportId,
      }
      const response = await fetchBlockedListImportReportUrl(data)
      const {isSuccess, message, text} = response

      if (isSuccess) {
        // Extract and convert the text data to CSV
        const tableData = extractTableData(text)
        exportToCSV(tableData)

        notify(message)
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
      notifyFail('An error occurred while downloading the report.')
    }
  }

  const extractTableData = (items) => {
    return items.map((item) => ({
      OS: item.OS,
      Description: item.Description,
      Hash: item.Value,
      'Scope Path': item['Scope Path'],
      User: item.User,
      'Last Updated': item['Last Update'],
      Source: item.Source,
      Reason: item.Reason,
    }))
  }

  const convertToCSV = (data) => {
    const csvRows = []

    // Add header row
    const header = Object.keys(data[0])
    csvRows.push(header.join(','))

    // Add data rows
    data.forEach((item) => {
      const values = header.map((key) => {
        let value = item[key]
        // Escape double quotes in values
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""')
        }
        // Enclose value in double quotes if it contains special characters
        if (/[",\n]/.test(value)) {
          value = `"${value}"`
        }
        return value
      })
      csvRows.push(values.join(','))
    })

    // Combine rows into a single string
    return csvRows.join('\n')
  }

  const exportToCSV = (data) => {
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'})
    const fileName = 'Validation_Reports.csv'
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName)
    } else {
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  return (
    <Modal show={show} onHide={handleClose} className='application-modal'>
      <Modal.Header closeButton>
        <Modal.Title>Import Block List</Modal.Title>
        <button type='button' className='application-modal-close' aria-label='Close'>
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body>
        <p>
          Destination Scope <i className='bi bi-question-circle-fill ms-2'></i>
        </p>
        <div className='d-flex mt-5 semi-bold acc-site account-header'>
          {accountsStructure !== null ? (
            <>
              <Dropdown>
                <Dropdown.Toggle variant='primary' className='no-btn' id='dropdown-basic'>
                  {orgNames} <i className='fa fa-chevron-down link mg-left-5' />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {accountsStructure.map((account, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleAccountClick(account.accountId, account.name)}
                    >
                      {account.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {accountName || accountNames ? (
                <Dropdown>
                  <Dropdown.Toggle variant='primary' className='no-btn' id='dropdown-basic'>
                    {`/ ${accountName || accountNames}`}{' '}
                    <i className='fa fa-chevron-down link mg-left-5' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {accountsStructure
                      ?.find((account) => account.name === (accountName || accountNames))
                      ?.sites?.map((site, siteIndex) => (
                        <Dropdown.Item
                          key={siteIndex}
                          onClick={() => handleAccordionClick(site.name, site.siteId)}
                        >
                          <div className='d-flex justify-content-between '>
                            <div>{site.name}</div>
                            <div>({site.activeLicenses})</div>
                          </div>
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : null}

              {siteName || siteNames ? (
                <Dropdown>
                  <Dropdown.Toggle variant='primary' className='no-btn' id='dropdown-basic'>
                    {`/ ${siteName || siteNames}`}{' '}
                    <i className='fa fa-chevron-down link mg-left-5' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {accountsStructure
                      ?.find((account) => account.name === (accountName || accountNames))
                      ?.sites.find((site) => site.name === (siteName || siteNames))
                      ?.groups.map((group, groupIndex) => (
                        <Dropdown.Item
                          key={groupIndex}
                          onClick={() => handleGroupClick(group.name, group.groupId)}
                        >
                          <div className='d-flex justify-content-between '>
                            <div>{group.name}</div>
                            <div>({group.totalAgents})</div>
                          </div>
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : null}

              {groupName || groupNames ? (
                <Dropdown>
                  <Dropdown.Toggle variant='primary' className='no-btn' id='dropdown-basic'>
                    {`/ ${groupName || groupNames}`}
                  </Dropdown.Toggle>
                </Dropdown>
              ) : null}
            </>
          ) : (
            <div>{orgNames}</div>
          )}
        </div>
        <div className='mt-5 pt-3'>
          <p>
            Upload a CSV file with a list of blocklist entries{' '}
            <i className='bi bi-question-circle-fill ms-2'></i>
          </p>
          <Form>
            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label
                className='btn btn-primary'
                style={{width: '100%', backgroundColor: 'grey'}}
              >
                <i className='bi bi-upload me-2'></i>
                {selectedFile ? selectedFile.name : 'Choose file to upload'}
                <Form.Control type='file' hidden onChange={handleFileChange} ref={fileInputRef} />
              </Form.Label>
            </Form.Group>
          </Form>
          {importSuccess && !reportId && (
            <div className='mt-4 text-center'>
              <div>
                <i
                  className='fa fa-check-circle text-success me-2'
                  style={{fontSize: '40px', width: '40px', height: '40px'}}
                ></i>
                <p className='mt-3'>
                  <strong>Success!</strong>
                </p>
              </div>
              <div className='mt-3'>
                <p>Succeeded: {count?.succeeded}</p>
                <p>Total: {count?.total}</p>
                <h5> blocklist entries imported successfully.</h5>
              </div>
            </div>
          )}
          {reportId && importSuccess && (
            <div className='mt-4 text-center'>
              <div className='m-auto'>
                <i
                  className='fas fa-exclamation text-primary bg-dark'
                  style={{
                    fontSize: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    margin: '0 auto',
                    display: 'block',
                    lineHeight: '40px',
                    textAlign: 'center',
                  }}
                ></i>
              </div>
              <div className='mt-3'>
                <p>Succeeded: {count?.succeeded}</p>
                <p>Total: {count?.total}</p>
                <button className='btn text-black link' onClick={handleDownloadReport}>
                  Download Validation Report
                </button>
                <h5>Use the Validation Report to fix the issue. Then try to import again.</h5>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        {!importSuccess && !importAnotherFile && (
          <Button variant='primary' onClick={handleSubmit} disabled={!selectedFile}>
            Import BlockList
          </Button>
        )}
        {importAnotherFile && (
          <Button variant='primary' onClick={handleSubmitAnotherFile}>
            Import Another File
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default BlockListImportPopUp
