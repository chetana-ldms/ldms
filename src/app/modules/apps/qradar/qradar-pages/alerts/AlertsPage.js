import {useMemo, useEffect, useState, useRef} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {UsersListPagination} from '../components/pagination/UsersListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useFormik} from 'formik'
import EditAlertsPopUp from './EditAlertsPopUp'
import {notify, notifyFail} from '../components/notification/Notification'
import {fetchExportDataAddUrl, fetchMasterData, fetchUpdatSetAlertIrrelavantStatuseAlert} from '../../../../../api/Api'
import {
  fetchAlertData,
  fetchGetAlertNotesByAlertID,
  fetchSetAlertEscalationStatus,
  fetchSetOfAlerts,
  fetchUsers,
  fetchGetalertHistory,
  fetchSentinelOneAlert,
  fetchAnalystVerdictUpdateUrl,
  fetchConnectToNetworkUrl,
  fetchDisConnectFromNetworkUrl,
  fetchThreatsActionUrl,
  fetchAlertsStatusUpdateUrl,
  fetchMitigateActionValidationUrl,
} from '../../../../../api/AlertsApi'
import MitigationModal from './MitigationModal'
import ReactPaginate from 'react-paginate'
import {fetchCreateIncident} from '../../../../../api/IncidentsApi'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import './Alerts.css'
import {useErrorBoundary} from 'react-error-boundary'
import 'jspdf-autotable'
import AddToBlockListModal from './AddToBlockListModal'
import AddToExclusionsModal from './AddToExclusionsModal'
import AddANoteModal from './AddANoteModal'
import jsPDF from 'jspdf'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form} from 'reactstrap'
import {fetchActivitiesUrl} from '../../../../../api/ActivityApi'

const AlertsPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const handleError = useErrorBoundary()
  const [inputValue, setInputValue] = useState('')
  const [selectedAlert, setselectedAlert] = useState([])
  const [validations, setValidations] = useState('')
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const globalAdminRole = Number(sessionStorage.getItem('globalAdminRole'))
  const clientAdminRole = Number(sessionStorage.getItem('clientAdminRole'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    observableTagDropDown: [],
    analystVerdictDropDown: [],
  })
  const [openEditPage, setOpenEditPage] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [selectCheckBox, setSelectCheckBox] = useState(null)
  const {severityNameDropDownData, statusDropDown, observableTagDropDown, analystVerdictDropDown} =
    dropdownData
  const handleFormSubmit = () => {
    setShowPopup(false)
  }
  const openEditPopUp = (item) => {
    setSelectedRow(item)
    setOpenEditPage(true)
  }
  const handleClose = () => {
    setOpenEditPage(false)
  }
  useEffect(() => {
    Promise.all([
      fetchMasterData('alert_Sevirity'),
      fetchMasterData('alert_status'),
      fetchMasterData('alert_Tags'),
      fetchMasterData('analyst_verdict'),
    ])
      .then(([severityData, statusData, tagsData, verdictData]) => {
        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          observableTagDropDown: tagsData,
          analystVerdictDropDown: verdictData,
        }))
      })
      .catch((error) => {
        handleError(error)
      })
  }, [])

  const handleselectedAlert = (item, e) => {
    setSelectCheckBox(item)
    // setIsCheckboxSelected(e.target.checked);
    const {value, checked} = e.target
    if (checked) {
      setselectedAlert([...selectedAlert, value])
      setIsCheckboxSelected(true)
    } else {
      // setselectedAlert(selectedAlert.filter((e) => e !== value))
      const updatedAlert = selectedAlert.filter((e) => e !== value)
      setselectedAlert(updatedAlert)
      setIsCheckboxSelected(updatedAlert.length > 0)
    }
  }
  const [actionsValue, setActionValue] = useState('')
  function createIncidentSubmit(e) {
    setActionValue(e.target.value)
  }
  const navigate = useNavigate()
  const [selectValue, setSelectValue] = useState()
  const onChange = (event) => {
    const value = event.target.value
    setSelectValue(value)
  }
  const userID = Number(sessionStorage.getItem('userId'))
  const orgId = Number(sessionStorage.getItem('orgId'))
  const modifiedDate = new Date().toISOString()
  const [alertData, setAlertDate] = useState([])
  const [filteredAlertData, setFilteredAlertDate] = useState([])
  const [ldp_security_user, setldp_security_user] = useState([])
  const [alertNotesList, setAlertNotesList] = useState([])
  const [escalate, setEscalate] = useState(true)
  const [activePage, setActivePage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  console.log(currentPage, "currentPage")
  const [showForm, setShowForm] = useState(false)
  const [ignorVisible, setIgnorVisible] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [limit, setLimit] = useState(20)
  const [pageCount, setpageCount] = useState(0)
  const [source, setSource] = useState([])
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false)
  const [addToBlockListModal, setAddToBlockListModal] = useState(false)
  const [addToExclusionsModal, setAddToExclusionsModal] = useState(false)
  const [addANoteModal, setAddANoteModal] = useState(false)
  const [sentinalOne, setSentinalOne] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [AnalystVerdictDropDown, setAnalystVerdictDropDown] = useState(false)
  const [selectedVerdict, setSelectedVerdict] = useState('')
  const [StatusDropDown, setStatusDropDown] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [endpointInfo, setEndpointInfo] = useState([])
  const [networkHistory, setNetworkHistory] = useState([])
  const [threatHeaderDtls, setThreatHeaderDtls] = useState([])
  const [threatInfo, setThreatInfo] = useState([])
  const [alertHistory, setAlertHistory] = useState([])
  const dropdownRef = useRef(null)
  const dropdownRefSatus = useRef(null)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const handleRefreshActions = () => {
    setRefreshFlag(!refreshFlag)
    setCurrentPage(1); 
    qradaralerts(1); 
    setActivePage(1)
    setselectedAlert([])
    setIsCheckboxSelected(false)
    reloadHistory()
    reloadNotes()
    fetchAlertDetails()
    setTimeout(() => {
      fetchAlertDetails()
    }, 5000)
  }
  const fetchAlertDetails = async () => {
    try {
      const sentinalOneDetails = await fetchSentinelOneAlert(selectedAlertId)
      setSentinalOne(sentinalOneDetails)
      const endpoint_Info = sentinalOneDetails.endpoint_Info
      setEndpointInfo(endpoint_Info)
      const networkHistory = sentinalOneDetails.networkHistory
      setNetworkHistory(networkHistory)
      const threatHeaderDtls = sentinalOneDetails.threatHeaderDtls
      setThreatHeaderDtls(threatHeaderDtls)
      const threatInfo = sentinalOneDetails.threatInfo
      setThreatInfo(threatInfo)
    } catch (error) {
      handleError(error)
    }
  }
  useEffect(() => {
    fetchAlertDetails()
  }, [selectedAlertId])
  const handleTdClick = (itemId) => {
    setSelectedAlertId(itemId)
  }
  const reloadHistory = () => {
    if (selectedAlertId !== null && selectedAlertId !== undefined) {
      const data = {
        orgId,
        alertIds: [Number(selectedAlertId)],
      }
      // fetchGetalertHistory(data)
      fetchActivitiesUrl(data)
        .then((res) => {
          setAlertHistory(res.activitiesList)
        })
        .catch((error) => {
          handleError(error)
        })
    }
  }

  useEffect(() => {
    reloadHistory()
  }, [selectedAlertId])
  const reloadNotes = async () => {
    try {
      if (selectedAlertId !== null && selectedAlertId !== undefined) {
        const data = {alertID: selectedAlertId}
        const alertNotesList = await fetchGetAlertNotesByAlertID(data)
        const alertNoteSort = alertNotesList.sort((a, b) => {
          return b.alertsNotesId - a.alertsNotesId
        })
        setAlertNotesList(alertNoteSort)
      }
    } catch (error) {
      handleError(error)
    }
  }
  useEffect(() => {
    reloadNotes()
  }, [selectedAlertId])
  const css_classes = [
    'text-primary',
    'text-secondary',
    'text-success',
    'text-danger',
    'text-warning',
    'text-info',
    'text-dark',
    'text-muted',
  ]

  const getRandomClass = () => {
    const randomIndex = Math.floor(Math.random() * css_classes.length)
    return css_classes[randomIndex]
  }
  const handleCloseForm = () => {
    setShowForm(false)
  }
  const handleIgnoreSubmit = async () => {
    try {
      const {ownerUserID, modifiedDate} = selectCheckBox
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const orgId = Number(sessionStorage.getItem('orgId'))
      const data = {
        orgId,
        alertIDs: selectedAlert,
        // ownerID: ownerUserID,
        modifiedUserId,
        modifiedDate,
        notes: '',
      }
      const response = await fetchUpdatSetAlertIrrelavantStatuseAlert(data)
      if (response.isSuccess) {
        notify(response.message)
        setIgnorVisible(false)
        setShowForm(false)
        qradaralerts()
        reloadHistory()
        reloadNotes()
      } else {
        notifyFail(response.message)
      }
    } catch (error) {
      handleError(error)
    }
  }
  const handleTableRefresh = () => {
    qradaralerts()
    reloadHistory()
    reloadNotes()
    fetchAlertDetails()
  }
  const handlePageSelect = (event) => {
    const selectedPerPage = event.target.value
    setLimit(selectedPerPage)
    setCurrentPage(1)
    setActivePage(1)
  }
  const [delay, setDelay] = useState(1)
  const isLoading = true
  const [alertsCount, setAlertsCount] = useState(0)
  const {
    values,
    handleChange: handleEscalate,
    handleSubmit,
  } = useFormik({
    initialValues: {
      owner: '',
      comments: '',
    },
    onSubmit: async (values) => {
      const orgId = Number(sessionStorage.getItem('orgId'))
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const modifiedDate = new Date().toISOString()
      const data = {
        modifiedDate,
        modifiedUserId,
        orgId,
        alertIDs: selectedAlert,
        ownerUserId: values.owner,
        notes: values.comments,
      }
      const response = await fetchSetAlertEscalationStatus(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        qradaralerts()
        reloadHistory()
        reloadNotes()
        notify(message)
        setEscalate(false)
        setShowForm(false)
      } else {
        notifyFail(message)
      }
      handleEscalate({
        target: {
          name: 'owner',
          value: '',
        },
      })
      handleEscalate({
        target: {
          name: 'comments',
          value: '',
        },
      }).catch((error) => {
        handleError(error)
      })
    },
  })
  const slaCal = (data) => {
    if (data !== null) {
      data.map((item) => {
        let resolvedTime = item.resolvedtime ? getCurrentTimeZone(item.resolvedtime) : new Date()
        let detectedTime = item.detectedtime ? getCurrentTimeZone(item.detectedtime) : null
        if (resolvedTime && detectedTime) {
          let timeDifferenceMs = new Date(resolvedTime) - new Date(detectedTime)
          // Convert milliseconds to days, hours, and minutes
          let days = Math.floor(timeDifferenceMs / (24 * 60 * 60 * 1000))
          let hours = Math.floor((timeDifferenceMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
          let minutes = Math.floor((timeDifferenceMs % (60 * 60 * 1000)) / (60 * 1000))
          // Format the time difference
          let formattedTimeDifference = `${days}D ${hours}H : ${minutes}M`
          item.sla = formattedTimeDifference
        }
      })
    } else {
      console.log('No data available')
    }
  }
//   const handlePageClick = async (data) => {
//     let selectedPage  = data?.selected + 1 || 1; 
//     setLoading(true);
//     const setOfAlertsData = await fetchSetOfAlerts(selectedPage , orgId, userID, limit, accountId, siteId, groupId);
//     slaCal(setOfAlertsData);
//     setFilteredAlertDate(setOfAlertsData);     
//     setCurrentPage(selectedPage );
//     setActivePage(1)
//     setLoading(false);
// }
const handlePageClick = async (data) => {
  const newPage = data.selected + 1;
  setCurrentPage(newPage);
  setActivePage(newPage);
};

  const qradaralerts = async (page = 1) => {
    const rangeStart = (page - 1) * limit + 1;
    const rangeEnd = page * limit;
    let data2 = {
      orgID: orgId,
      toolID: '1',
      toolTypeID: '1',
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
      loggedInUserId: userID,
      orgAccountStructureLevel: [
        {
          levelName: 'AccountId',
          levelValue: accountId || '',
        },
        {
          levelName: 'SiteId',
          levelValue: siteId || '',
        },
        {
          levelName: 'GroupId',
          levelValue: groupId || '',
        },
      ],
    }
    setLoading(true)
    const response = await fetchAlertData(data2)
    setAlertsCount(response.totalOffenseCount)
    setSource(response.source)
    setAlertDate(response.alertsList != null ? response.alertsList : [])
    const total = response.totalOffenseCount
    setpageCount(Math.ceil(total / limit))
    slaCal(response?.alertsList)
    setFilteredAlertDate(response?.alertsList)
    setLoading(false)
  }
  useEffect(() => {
    qradaralerts()
  }, [])
  useEffect(() => {
    qradaralerts(currentPage);
  }, [limit, currentPage]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers(orgId, userID)
      setldp_security_user(response?.usersList != undefined ? response?.usersList : [])
    }
    fetchData()
  }, [delay])
  useEffect(() => {
    if (actionsValue === '1') {
      const data = {
        orgId,
        createDate: modifiedDate,
        createUserId: userID,
        alertIDs: selectedAlert,
      }
      fetchCreateIncident(data).then((response) => {
        if (response.isSuccess) {
          notify('Incident Created')
          setTimeout(() => {
            navigate('/qradar/incidents')
          }, 2000)
        } else {
          setShowForm(false)
          notifyFail('Failed to Create Incident')
        }
      })
    }
  }, [actionsValue])

  console.log(filteredAlertData, 'filteredAlertData')
  const handleChange = (e, field) => {
    let data = alertData.filter((it) => it[field] === e.target.value)
    setFilteredAlertDate(data.length > 0 ? data : alertData)
  }
  const onActionsClick = () => {
    if (isCheckboxSelected) {
      setIsCheckboxSelected(true)
    }
    setShowForm(true)
    setEscalate(true)
    setIgnorVisible(true)
  }
  const handleSort = (e, field) => {
    let temp = [...alertData]
    let data =
      e.target.value === 'Dec'
        ? temp.sort((a, b) => Number(b[field]) - Number(a[field]))
        : temp.sort((a, b) => Number(a[field]) - Number(b[field]))
    setFilteredAlertDate(data)
  }
  const handleSortDates = (e, field) => {
    let temp = [...alertData]
    let data =
      e.target.value === 'New'
        ? temp.sort((a, b) => new Date(b[field]) - new Date(a[field]))
        : temp.sort((a, b) => new Date(a[field]) - new Date(b[field]))
    setFilteredAlertDate(data)
  }
  const handleSearch = (e) => {
    setInputValue(e.target.value)
    if (!e.target.value) return setFilteredAlertDate(alertData)
    let data = alertData.filter((it) =>
      it.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredAlertDate(data)
  }
  const handleRefresh = (event) => {
    event.preventDefault()
    setIsRefreshing(true)
    setCurrentPage(1); 
     qradaralerts(1); 
    setActivePage(1)
    reloadNotes()
    reloadHistory()
    fetchAlertDetails()
    setselectedAlert([])
    setIsCheckboxSelected(false)
    setTimeout(() => setIsRefreshing(false), 2000)
  }
  const RefreshInterval = 2 * 60 * 1000
  useEffect(() => {
    let isActive = true
    const refreshIntervalId = setInterval(() => {
      if (isActive && currentPage === 1) {
        setIsRefreshing(true)
        qradaralerts()
        setTimeout(() => {
          setIsRefreshing(false)
        }, 2000)
      } else {
        setIsRefreshing(false)
      }
    }, RefreshInterval)

    return () => {
      isActive = false
      clearInterval(refreshIntervalId)
    }
  }, [currentPage])
  const handleMoreActionsClick = () => {
    setShowMoreActionsModal(false)
  }
  const handleThreatActions = () => {
    setShowDropdown(true)
  }
  const handleDropdownSelect = async (event) => {
    const value = event.target.value
    setSelectedValue(value)
    if (value === 'MitigationAction') {
      setShowMoreActionsModal(true)
    } else if (value === 'AddToBlockList') {
      setAddToBlockListModal(true)
    } else if (value === 'AddToExclusions') {
      setAddToExclusionsModal(true)
    } else if (value === 'AddANote') {
      setAddANoteModal(true)
    } else if (value === 'ConnectToNetwork') {
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        modifiedDate,
        modifiedUserId: userID,
      }
      try {
        const responseData = await fetchConnectToNetworkUrl(data)
        const {isSuccess, message} = responseData
        if (isSuccess) {
          qradaralerts()
          fetchValidations()
          fetchAlertDetails()
          notify(message)
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.error(error)
      }
      setShowDropdown(false)
    } else if (value === 'DisconnectFromNetwork') {
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        modifiedDate,
        modifiedUserId: userID,
      }
      try {
        const responseData = await fetchDisConnectFromNetworkUrl(data)
        const {isSuccess, message} = responseData
        if (isSuccess) {
          qradaralerts()
          fetchValidations()
          fetchAlertDetails()
          notify(message)
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.error(error)
      }
      setShowDropdown(false)
    } else if (value === 'Unquarantine') {
      const data = {
        modifiedDate,
        modifiedUserId: userID,
        orgID: orgId,
        alertIds: selectedAlert,
        kill: false,
        quarantine: false,
        remediate: false,
        rollback: false,
        unQuarantine: true,
        networkQuarantine: false,
      }
      try {
        const responseData = await fetchThreatsActionUrl(data)
        const {isSuccess, message} = responseData
        if (isSuccess) {
          qradaralerts()
          fetchValidations()
          fetchAlertDetails()
          notify(message)
        } else {
          notifyFail(message)
        }
      } catch (error) {
        console.error(error)
      }
      setShowDropdown(false)
    } else {
      setShowDropdown(false)
    }
  }
  const handleShowDropdown = () => {
    setShowDropdown(false)
  }
  const handleCloseMoreActionsModal = () => {
    setShowMoreActionsModal(false)
    setShowDropdown(false)
  }
  const handleAction = () => {
    handleCloseMoreActionsModal()
  }
  const handleCloseAddToBlockList = () => {
    setAddToBlockListModal(false)
    setShowDropdown(false)
  }
  const handleActionAddToBlockList = () => {
    setAddToBlockListModal(false)
  }
  const handleCloseAddToExclusions = () => {
    setAddToExclusionsModal(false)
    setShowDropdown(false)
  }
  const handleActionAddToExclusions = () => {
    setAddToExclusionsModal(false)
  }
  const handleCloseAddANote = () => {
    setAddANoteModal(false)
    setShowDropdown(false)
  }
  const handleActionAddANote = () => {
    setAddANoteModal(false)
  }
  const handleAnalystsVerdict = () => {
    setAnalystVerdictDropDown(true)
  }
  const handleAnalystsVerdictClose = () => {
    setAnalystVerdictDropDown(false)
  }
  const handleAnalystsVerdictDropDown = (event) => {
    setSelectedVerdict(event.target.value)
  }
  const handleSubmitAnalystVerdict = async () => {
    if (!selectedVerdict) {
      notifyFail('Please select a Analyst Verdict option.')
      return
    }
    try {
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        analystVerdictId: selectedVerdict,
        modifiedDate,
        modifiedUserId,
      }
      const responseData = await fetchAnalystVerdictUpdateUrl(data)
      const {isSuccess, message} = responseData
      if (isSuccess) {
        notify(message)
        qradaralerts()
        reloadHistory()
        reloadNotes()
        handleAnalystsVerdictClose()
        fetchAlertDetails()
        if (dropdownRef.current) {
          dropdownRef.current.classList.remove('show')
        }
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleStatus = () => {
    setStatusDropDown(true)
  }
  const handleStatusClose = () => {
    setStatusDropDown(false)
  }
  const handleStatusDropDown = (event) => {
    setSelectedStatus(event.target.value)
  }
  const handleSubmitStatus = async () => {
    if (!selectedStatus) {
      notifyFail('Please select a status option.')
      return
    }
    try {
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const data = {
        orgID: orgId,
        alertIds: selectedAlert,
        statusId: selectedStatus,
        modifiedDate,
        modifiedUserId,
      }
      const responseData = await fetchAlertsStatusUpdateUrl(data)
      const {isSuccess, message} = responseData
      if (isSuccess) {
        notify(message)
        qradaralerts()
        reloadHistory()
        reloadNotes()
        handleStatusClose()
        fetchAlertDetails()
        if (dropdownRefSatus.current) {
          dropdownRefSatus.current.classList.remove('show')
        }
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Function to export data to CSV
  const exportToExcel = async() => {
    // Add the heading
    let csvContent = 'Alerts Report\n'

    // Convert alertData to CSV format
    csvContent +=
      'Severity,SLA,Score,Status,Detected time,Name,Observables tags,Owner,Source\n' +
      alertData
        .map(
          (item) =>
            `${item.severityName},${item.sla},${item.score === null ? '0' : item.score},${
              item.status
            },${item.detectedtime},${item.name},${item.observableTag},${item.ownerusername},${
              item.source
            }`
        )
        .join('\n')

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})

    // Create a temporary anchor element
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'alert_report.csv')

    // Append the anchor element to the body
    document.body.appendChild(link)

    // Trigger the click event to initiate download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    const data = {
      createdDate: new Date().toISOString(),
      createdUserId: Number(sessionStorage.getItem("userId")),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: "Alerts"
    };
    try {
      const response = await fetchExportDataAddUrl(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to export data to PDF
  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF()
    doc.text('Alerts Report', 10, 10) // Add heading to PDF
    doc.autoTable({
      head: [
        [
          'Severity',
          'SLA',
          'Score',
          'Status',
          'Detected time',
          'Name',
          'Observables tags',
          'Owner',
          'Source',
        ],
      ],
      body: alertData.map((item) => [
        item.severityName,
        item.sla,
        item.score === null ? '0' : item.score,
        item.status,
        item.detectedtime,
        item.name,
        item.observableTag,
        item.ownerusername,
        item.source,
      ]),
    })

    // Save the PDF
    doc.save('alert_report.pdf')
  }
  const transformAction = (item) => {
    switch (item.toLowerCase()) {
      case 'kill':
        return 'KILLED'
      case 'quarantine':
        return 'QUARANTINED'
      case 'remediate':
        return 'REMEDIATED'
      case 'rollback':
        return 'ROLLED BACK'
      default:
        return item.toUpperCase()
    }
  }
  const fetchValidations = async () => {
    try {
      const data = {
        alertId: Number(selectedAlert),
      }
      const response = await fetchMitigateActionValidationUrl(data)
      setValidations(response)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    fetchValidations()
  }, [selectedAlert])

  return (
    <KTCardBody className='alert-page'>
      <ToastContainer />

      <div className='mb-5'>
        <div className='d-flex justify-content-between border-0'>
          <h3 className='align-items-start flex-column'>
            <span className='fw-bold fs-3'>
              Alerts{' '}
              {'( ' +
                (filteredAlertData !== null && filteredAlertData.length !== null
                  ? filteredAlertData.length
                  : 0) +
                ' / ' +
                alertsCount +
                ')'}
            </span>
          </h3>
        </div>
      </div>
      <div className='clearfix' />
      <div className='card pad-10'>
        <div className='pb-3 pt-3'>
          <div className='card-toolbar float-left'>
            <div className='d-flex align-items-center gap-2 gap-lg-3'>
              <div className='m-0'>
                <a
                  href='#'
                  className={`btn btn-small fs-14 btn-green ${!isCheckboxSelected && 'disabled'}`}
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                  onClick={handleAnalystsVerdict}
                >
                  Analyst Verdict
                </a>

                <div
                  ref={dropdownRef}
                  className='menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                  data-kt-menu='true'
                >
                  {AnalystVerdictDropDown && (
                    <div className='px-3 py-3'>
                      <div className='mb-5'>
                        <div className='d-flex justify-content-end mb-5'>
                          <div>
                            <div
                              className='close fs-20 text-muted pointer'
                              aria-label='Close'
                              onClick={handleAnalystsVerdictClose}
                            >
                              <span aria-hidden='true' classNam='black'>
                                &times;
                              </span>
                            </div>
                          </div>
                        </div>
                        <select
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc885a14bb'
                          data-allow-clear='true'
                          onChange={handleAnalystsVerdictDropDown}
                        >
                          <option>Select</option>
                          {analystVerdictDropDown.length > 0 &&
                            analystVerdictDropDown.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className='text-right'>
                        <button
                          className='btn btn-new btn-small'
                          onClick={handleSubmitAnalystVerdict}
                        >
                          {' '}
                          Submit{' '}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='m-0'>
                <a
                  href='#'
                  className={`btn btn-small fw-bold fs-14 btn-green ${
                    !isCheckboxSelected && 'disabled'
                  }`}
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                  onClick={handleStatus}
                >
                  Status
                </a>

                <div
                  ref={dropdownRefSatus}
                  className='menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                  data-kt-menu='true'
                >
                  {StatusDropDown && (
                    <div className='px-3 py-3'>
                      <div className='mb-5'>
                        <div className='d-flex justify-content-end mb-5'>
                          <div>
                            <div
                              className='close fs-20 text-muted pointer'
                              aria-label='Close'
                              onClick={handleStatusClose}
                            >
                              <span
                                aria-hidden='true'
                                style={{color: 'inherit', textShadow: 'none'}}
                              >
                                &times;
                              </span>
                            </div>
                          </div>
                        </div>
                        <select
                          className='form-select form-select-solid'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc885a14bb'
                          data-allow-clear='true'
                          onChange={handleStatusDropDown}
                        >
                          <option value=''>Select</option>
                          {statusDropDown.length > 0 &&
                            statusDropDown.map((item) => (
                              <option key={item.dataID} value={item.dataID}>
                                {item.dataValue}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className='text-right'>
                        <button className='btn btn-new btn-small' onClick={handleSubmitStatus}>
                          {' '}
                          Submit{' '}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {orgId === 2 && (
                <>
                  <div className='m-0'>
                    <a
                      href='#'
                      className={`btn btn-small fs-14 btn-green ${
                        !isCheckboxSelected && 'disabled'
                      }`}
                      data-kt-menu-trigger='click'
                      data-kt-menu-placement='bottom-end'
                      onClick={handleThreatActions}
                    >
                      Other Action
                    </a>
                    <div
                      className='menu menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                      data-kt-menu='true'
                    >
                      {showDropdown && selectedAlert.length > 0 && (
                        <div className='px-3 py-3'>
                          <div className='mb-5'>
                            <div className='d-flex justify-content-end mb-5'>
                              <div>
                                <div
                                  className='close fs-20 text-muted pointer'
                                  aria-label='Close'
                                  onClick={handleShowDropdown}
                                >
                                  <span
                                    aria-hidden='true'
                                    style={{
                                      color: 'inherit',
                                      textShadow: 'none',
                                    }}
                                  >
                                    &times;
                                  </span>
                                </div>
                              </div>
                            </div>
                            <select
                              onChange={handleDropdownSelect}
                              className='form-select form-select-solid'
                              data-kt-select2='true'
                              data-control='select2'
                              data-placeholder='Select option'
                              data-allow-clear='true'
                            >
                              <option value='' className='p-2'>
                                Select
                              </option>
                              <option value='MitigationAction' className='mb-2'>
                                Mitigation Action
                              </option>
                              <option value='AddToBlockList' className='mb-2'>
                                Add To Blocklist
                              </option>
                              <option value='AddToExclusions' className='p-2'>
                                Add To Exclusions
                              </option>
                              <option
                                value='Unquarantine'
                                className='p-2'
                                disabled={selectedAlert.length == 1 && !validations.unQuarantine}
                              >
                                Unquarantine
                              </option>
                              <option value='AddANote' className='p-2'>
                                Add A Note
                              </option>
                              <option
                                value='ConnectToNetwork'
                                className='p-2'
                                disabled={selectedAlert.length == 1 && !validations.addToNetwork}
                              >
                                Connect To Network
                              </option>
                              <option
                                value='DisconnectFromNetwork'
                                className='p-2'
                                disabled={
                                  selectedAlert.length == 1 && !validations.disconnectFromNetwork
                                }
                              >
                                Disconnect From Network
                              </option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    {showMoreActionsModal && (
                      <MitigationModal
                        show={showMoreActionsModal}
                        handleClose={handleCloseMoreActionsModal}
                        handleAction={handleAction}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                        refreshParent={handleRefreshActions}
                      />
                    )}
                    {addToBlockListModal && (
                      <AddToBlockListModal
                        show={addToBlockListModal}
                        handleClose={handleCloseAddToBlockList}
                        handleAction={handleActionAddToBlockList}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                        refreshParent={handleRefreshActions}
                      />
                    )}
                    {addToExclusionsModal && (
                      <AddToExclusionsModal
                        show={addToExclusionsModal}
                        handleClose={handleCloseAddToExclusions}
                        handleAction={handleActionAddToExclusions}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                        refreshParent={handleRefreshActions}
                      />
                    )}
                    {addANoteModal && (
                      <AddANoteModal
                        show={addANoteModal}
                        handleClose={handleCloseAddANote}
                        handleAction={handleActionAddANote}
                        selectedValue={selectedValue}
                        selectedAlert={selectedAlert}
                        refreshParent={handleRefreshActions}
                      />
                    )}
                  </div>
                </>
              )}
              <div className='m-0'>
                <a
                  href='#'
                  className={`btn btn-small fs-14 btn-green ${!isCheckboxSelected && 'disabled'}`}
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                  onClick={onActionsClick}
                >
                  Actions
                </a>

                <div
                  className='menu-sub menu-sub-dropdown w-250px w-md-300px alert-action'
                  data-kt-menu='true'
                  id='kt_menu_637dc6f8a1c15'
                >
                  {showForm && selectedAlert.length > 0 && (
                    <div className='px-3 py-3'>
                      <div className='mb-5'>
                        <div className='d-flex justify-content-end mb-5'>
                          <div>
                            <div
                              className='close fs-20 text-muted pointer'
                              aria-label='Close'
                              onClick={handleCloseForm}
                            >
                              <span
                                aria-hidden='true'
                                style={{color: 'inherit', textShadow: 'none'}}
                              >
                                &times;
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='header-filter'>
                          <select
                            onChange={createIncidentSubmit}
                            className='form-select form-select-solid'
                            data-kt-select2='true'
                            data-control='select2'
                            data-placeholder='Select option'
                            data-dropdown-parent='#kt_menu_637dc6f8a1c15'
                            data-allow-clear='true'
                          >
                            <option>Select</option>
                            <option value='1' disabled={selectCheckBox.alertIncidentMappingId > 0 || selectCheckBox.positiveAnalysis == "False Positive"}>
                              Create Incident
                            </option>
                            <option value='2'>Escalate</option>
                            <option value='3'>Irrelevant / Ignore</option>
                            {/* <option value="4">Generate Report</option> */}
                          </select>
                        </div>
                      </div>
                      {actionsValue === '2' && escalate && (
                        <div>
                          <form onSubmit={handleSubmit} className='header-filter'>
                            <div className='mb-5'>
                              <label className='form-label fw-bolder' htmlFor='ownerName'>
                                Owner <sup className='red'>*</sup>:
                              </label>
                              <div>
                                <select
                                  id='ownerName'
                                  className='form-select form-select-solid'
                                  data-placeholder='Select option'
                                  data-allow-clear='true'
                                  value={values.owner}
                                  name='owner'
                                  onChange={handleEscalate}
                                  required
                                >
                                  <option value=''>Select</option>
                                  {ldp_security_user.length > 0 &&
                                    ldp_security_user.map((item, index) => {
                                      return (
                                        <option key={index} value={item?.userID}>
                                          {item?.name}
                                        </option>
                                      )
                                    })}
                                </select>
                              </div>
                            </div>
                            <div className='mb-5'>
                              <label className='form-label fw-bolder' htmlFor='excalatecomments'>
                                Comments <sup className='red'>*</sup>:
                              </label>
                              <br />
                              <textarea
                                placeholder='Leave a comment here'
                                value={values.comments}
                                id='excalatecomments'
                                name='comments'
                                maxLength={4000}
                                onChange={handleEscalate}
                                className='form-control'
                                required
                              />
                            </div>

                            <div className='d-flex justify-content-end'>
                              <button type='submit' className='btn btn-primary btn-small btn-new'>
                                Submit
                              </button>
                              &nbsp;&nbsp;
                              <button
                                className='btn btn-secondary btn-small ml-10'
                                onClick={handleCloseForm}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                      {actionsValue === '3' && ignorVisible && (
                        <div className='d-flex justify-content-end'>
                          <button
                            type='button'
                            className='btn btn-small btn-new'
                            onClick={handleIgnoreSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='export-report ms-2 float-right'>
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <DropdownToggle caret>
                Export <i className='fa fa-file-export link mg-left-10' />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={exportToExcel}>
                  Export to CSV <i className='fa fa-file-excel link float-right' />
                </DropdownItem>
                {/* <DropdownItem onClick={exportToPDF}>
                  Export to PDF <i className='fa fa-file-pdf red float-right' />
                </DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className='ds-reload mt-2 float-right'>
            <span className='fs-13 fc-gray' onClick={handleRefresh}>
              Auto refresh every 2 minutes{' '}
              <i
                className={`fa fa-refresh link ${isRefreshing ? 'rotate' : ''}`}
                title='Auto refresh every 2 minutes'
              />
            </span>
          </div>
        </div>
        {openEditPage ? (
          <EditAlertsPopUp
            show={openEditPage}
            onClose={handleClose}
            onAdd={openEditPopUp}
            row={selectedRow}
            ldp_security_user={ldp_security_user}
            onSubmit={handleFormSubmit}
            dropdownData={dropdownData}
            onTableRefresh={handleTableRefresh}
          />
        ) : null}
        <div className='card-body1 py-3' id='kt_accordion_1'>
          <div className='table-responsive alert-table scroll-x'>
            <table className='table align-middle gs-0 gy-4 fixed-header'>
              <thead>
                <tr className='fw-bold bg-light'>
                  <th className='w-25px'></th>
                  <th>
                    Severity
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'severityName')}
                              >
                                <option value=''>Select</option>
                                {severityNameDropDownData.length > 0 &&
                                  severityNameDropDownData.map((item) => (
                                    <option key={item.dataID} value={item.dataValue}>
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    SLA
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleSortDates(e, 'detectedtime')}
                              >
                                <option>Select</option>
                                <option value='New'>Desc</option>
                                <option value='Old'>Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    Score
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleSort(e, 'severity')}
                              >
                                <option>Select</option>
                                <option value='Dec'>Desc</option>
                                <option value='Asc'>Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    Status
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'status')}
                              >
                                <option value=''>Select</option>
                                {statusDropDown.length > 0 &&
                                  statusDropDown.map((item) => (
                                    <option key={item.dataID} value={item.dataValue}>
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th style={{width: 140}}>
                    Detected Time
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleSortDates(e, 'detectedtime')}
                              >
                                <option>Select</option>
                                <option value='New'>Desc</option>
                                <option value='Old'>Asc</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    Name
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <input value={inputValue} onChange={(e) => handleSearch(e)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    Observables Tags
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'observableTag')}
                              >
                                <option>Select</option>
                                {observableTagDropDown.length > 0 &&
                                  observableTagDropDown.map((item) => (
                                    <option key={item.dataID} value={item.dataValue}>
                                      {item.dataValue}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    Owner
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              <select
                                className='form-select form-select-solid'
                                data-kt-select2='true'
                                data-placeholder='Select option'
                                data-dropdown-parent='#kt_menu_637dc885a14bb'
                                data-allow-clear='true'
                                onChange={(e) => handleChange(e, 'ownerusername')}
                              >
                                <option>Select</option>
                                {ldp_security_user.length > 0 &&
                                  ldp_security_user.map((item, index) => {
                                    return (
                                      <option key={index} value={item?.name}>
                                        {item?.name}
                                      </option>
                                    )
                                  })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                  <th>
                    Source{' '}
                    <span className='m-0 table-filter'>
                      <a
                        href='#'
                        className=''
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                      >
                        <span className='svg-icon svg-icon-6 svg-icon-muted me-1'>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                              fill='currentColor'
                            />
                          </svg>
                        </span>
                      </a>
                      <div
                        className='menu menu-sub menu-sub-dropdown w-250px w-md-250px'
                        data-kt-menu='true'
                        id='kt_menu_637dc885a14bb'
                      >
                        <div className='px-2 py-5'>
                          <div>
                            <div>
                              {source == null ? (
                                <select
                                  className='form-select form-select-solid'
                                  data-kt-select2='true'
                                  data-placeholder='Select option'
                                  data-dropdown-parent='#kt_menu_637dc885a14bb'
                                  data-allow-clear='true'
                                  onChange={(e) => handleChange(e, 'source')}
                                >
                                  <option>Select</option>
                                </select>
                              ) : (
                                <select
                                  className='form-select form-select-solid'
                                  data-kt-select2='true'
                                  data-placeholder='Select option'
                                  data-dropdown-parent='#kt_menu_637dc885a14bb'
                                  data-allow-clear='true'
                                  onChange={(e) => handleChange(e, 'source')}
                                >
                                  <option>Select</option>
                                  {source.length > 0 &&
                                    source.map((item, index) => (
                                      <option key={index} value={item}>
                                        {item}
                                      </option>
                                    ))}
                                </select>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody id='kt_accordion_1'>
                {loading && <UsersListLoading />}
                {filteredAlertData !== null ? (
                  filteredAlertData.map((item, index) => (
                    <>
                      <tr className='table-row' key={item.alertID}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            <input
                              className='form-check-input widget-13-check'
                              type='checkbox'
                              value={item.alertID}
                              name={item.alertID}
                              onChange={(e) => handleselectedAlert(item, e)}
                              autoComplete='off'
                            />
                            <span>
                              {item.status === 'New' && item.alertIncidentMappingId === 0 ? (
                                <i
                                  className='fa fa-circle-exclamation incident-icon red'
                                  title='No Action Initiated'
                                />
                              ) : item.status !== 'New' && item.alertIncidentMappingId === 0 ? (
                                <i
                                  className='fa fa-circle-exclamation incident-icon orange'
                                  title='Incident not created'
                                />
                              ) : (
                                <i
                                  className='fa fa-circle-exclamation incident-icon green'
                                  title='Incident created'
                                />
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          key={index}
                          id={'kt_accordion_1_header_' + index}
                          data-bs-toggle='collapse'
                          data-bs-target={'#kt_accordion_1_body_' + index}
                          aria-expanded='false'
                          aria-controls={'kt_accordion_1_body_' + index}
                          style={{cursor: 'pointer'}}
                          onClick={() => handleTdClick(item.alertID)}
                        >
                          <span className='link underline'>{item.severityName}</span>
                        </td>
                        <td>
                          <span className='text-dark d-block'>{item.sla}</span>
                        </td>
                        <td>
                          <span className='text-dark text-center d-block'>
                            {item.score === null || item.score === '' ? '0' : item.score}
                          </span>
                        </td>
                        <td>{item.status}</td>
                        <td>
                          <span className='text-dark d-block'>
                            <span>
                              {item.detectedtime && getCurrentTimeZone(item.detectedtime)}
                            </span>
                          </span>
                        </td>
                        <td className='text-dark fs-8 alert-name'>
                          <span className='text-dark d-block' title={item.name}>
                            {item.name}
                          </span>
                        </td>
                        <td className='text-dark fs-8'>{item.observableTag}</td>
                        <td className='text-dark fs-8'> {item.ownerusername}</td>
                        <td className='text-dark fw-bold fs-8'>{item.source}</td>
                      </tr>
                      <tr
                        id={'kt_accordion_1_body_' + index}
                        className='accordion-collapse collapse'
                        aria-labelledby={'kt_accordion_1_header_' + index}
                        data-bs-parent='#kt_accordion_1'
                      >
                        <td colSpan='10'>
                          <div className='row'>
                            <div className='col-md-12'>
                              <div className='card pad-10'>
                                {/* Tab Navigation */}
                                <ul
                                  className='nav nav-tabs'
                                  id={`alertTabs_${index}`}
                                  role='tablist'
                                >
                                  <li className='nav-item' role='presentation'>
                                    <a
                                      className='nav-link active'
                                      id={`detailsTab_${index}`}
                                      data-bs-toggle='tab'
                                      href={`#details_${index}`}
                                      role='tab'
                                      aria-controls={`details_${index}`}
                                      aria-selected='true'
                                    >
                                      Details
                                    </a>
                                  </li>
                                  {orgId == 2 && (
                                    <li className='nav-item' role='presentation'>
                                      <a
                                        className='nav-link'
                                        id={`moreDetailsTab_${index}`}
                                        data-bs-toggle='tab'
                                        href={`#moreDetails_${index}`}
                                        role='tab'
                                        aria-controls={`moreDetails_${index}`}
                                        aria-selected='false'
                                      >
                                        More Details
                                      </a>
                                    </li>
                                  )}
                                  <li className='nav-item' role='presentation'>
                                    <a
                                      className='nav-link'
                                      id={`notesTab_${index}`}
                                      data-bs-toggle='tab'
                                      href={`#notes_${index}`}
                                      role='tab'
                                      aria-controls={`notes_${index}`}
                                      aria-selected='false'
                                    >
                                      Notes
                                    </a>
                                  </li>
                                  <li className='nav-item' role='presentation'>
                                    <a
                                      className='nav-link'
                                      id={`timelineTab_${index}`}
                                      data-bs-toggle='tab'
                                      href={`#timeline_${index}`}
                                      role='tab'
                                      aria-controls={`timeline_${index}`}
                                      aria-selected='false'
                                    >
                                      Timeline
                                    </a>
                                  </li>
                                </ul>
                                <div className='tab-content pt-4'>
                                  <div
                                    className='tab-pane fade show active'
                                    id={`details_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`detailsTab_${index}`}
                                  >
                                    <div className='row alert-accordion'>
                                      <div className='col-md-10'>
                                        <div className='alert-details'>
                                          <b>Alert Name: </b>
                                          <span>{item.name}</span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Score:</b>
                                          <span>
                                            {item.score === null || item.score === ''
                                              ? '0'
                                              : item.score}
                                          </span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>SLA: </b>
                                          <span>{item.sla}</span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Severity: </b>
                                          <span>{item.severityName}</span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Status: </b>
                                          <span>{item.status}</span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Detected Date/Time: </b>
                                          <span>
                                            {item.detectedtime &&
                                              getCurrentTimeZone(item.detectedtime)}
                                          </span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Observable Tag: </b>
                                          <span>{item.observableTag} </span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Owner Name </b>
                                          <span>{item.ownerusername}</span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Analysts Verdict: </b>
                                          <span>{item.positiveAnalysis} </span>
                                        </div>
                                        <div className='alert-details'>
                                          <b>Source Name: </b>
                                          <span>{item.source}</span>{' '}
                                        </div>
                                      </div>
                                      <div className='col-md-2'>
                                        <div
                                          className='btn btn-primary btn-new btn-small'
                                          onClick={() => openEditPopUp(item)}
                                        >
                                          Edit
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className='tab-pane fade'
                                    id={`moreDetails_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`moreDetailsTab_${index}`}
                                  >
                                    {orgId == 2 ? (
                                      <div className='h-300px scroll-y'>
                                         <div className='float-right fs-13 fc-gray text-right ds-reload'>
                                          <a href='#' onClick={handleRefresh}>
                                            <i
                                              className={`fa fa-refresh link ${
                                                isRefreshing ? 'rotate' : ''
                                              }`}
                                              title='Auto refresh every 2 minutes'
                                            />
                                          </a>
                                        </div>
                                        <div className='row'>
                                          <div className='col-md-8'>
                                            <div className='d-flex '>
                                              <div className='border-right pe-2'>
                                                {' '}
                                                <span className='semi-bold'>
                                                  Threat status :
                                                </span>{' '}
                                                {threatHeaderDtls?.threatStatus}
                                              </div>
                                              <div className='border-right px-1'>
                                                <span className='semi-bold'>
                                                  AI Confidence level :{' '}
                                                </span>
                                                {threatHeaderDtls?.aiConfidenceLevel}
                                              </div>
                                              <div className='border-right px-1 pe-2 d-flex align-items-center'>
                                                <span className='semi-bold'>
                                                  Analyst Verdict :{' '}
                                                </span>
                                                {threatHeaderDtls?.ldC_AnalysisVerdict}
                                              </div>
                                              <div className='px-1 d-flex align-items-center'>
                                                <span className='semi-bold'>
                                                  Incident Status :{' '}
                                                </span>
                                                {threatHeaderDtls?.ldC_IncidentStatus
}
                                              </div>
                                            </div>
                                            {/* <hr /> */}
                                            <div className='mt-3'>
                                              <span className='semi-bold'>
                                                Mitigation Actions Taken:
                                              </span>
                                              {threatHeaderDtls?.mitigationActionWithStatus ? (
                                                threatHeaderDtls?.mitigationActionWithStatus
                                                  ?.reverse()
                                                  .map((item, index) => (
                                                    <span key={index} className='m-2'>
                                                      {transformAction(item.actionName)}{' '}
                                                      {item.status === 'pending' &&
                                                        ` ${item.status}`}
                                                      {item.status !== 'pending' && (
                                                        <i className='bi bi-check green fs-20 v-middle'></i>
                                                      )}
                                                    </span>
                                                  ))
                                              ) : threatHeaderDtls?.miticationActions ? (
                                                threatHeaderDtls?.miticationActions
                                                  ?.reverse()
                                                  .map((item, index) => (
                                                    <span key={index} className='m-2'>
                                                      {transformAction(item)}
                                                      <i className='bi bi-check green fs-20 v-middle'></i>
                                                    </span>
                                                  ))
                                              ) : (
                                                <span>No mitigation actions</span>
                                              )}
                                            </div>
                                          </div>
                                          <div className='col-md-4'>
                                            <div className='row  d-flex justify-content-end'>
                                              <div className='col-md-1 text-center py-3'>
                                                <i className='bi bi-stopwatch fs-18'></i>
                                              </div>
                                              <div className='col-md-10'>
                                                <p className='mb-2'>
                                                  <span className='semi-bold'>
                                                    Identified Time :{' '}
                                                  </span>
                                                  <span>
                                                    {getCurrentTimeZone(
                                                      threatHeaderDtls?.identifiedTime
                                                    )}
                                                  </span>
                                                </p>
                                                <p className='mb-2'>
                                                  <span className='semi-bold'>
                                                    Reporting Time :{' '}
                                                  </span>
                                                  <span>
                                                    {getCurrentTimeZone(
                                                      threatHeaderDtls?.reportingTime
                                                    )}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                       
                                        <hr />
                                        <div className='row'>
                                          <div className='fs-12 col-md-6'>
                                            <span className='semi-bold'>THREAT FILE NAME :</span>{' '}
                                            {threatInfo?.name}
                                          </div>
                                          <div className='fs-14 mt-5 text-primary col-md-6 text-end'>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                          <div className='col-md-7'>
                                            <div className='row'>
                                              <div className='col-md-3 '>
                                                <p className='semi-bold'>Path: </p>
                                                <p className='semi-bold'>Process User:</p>
                                                <p className='semi-bold'>Original Process:</p>
                                                <p className='semi-bold'>SHA1:</p>
                                                <p className='semi-bold'>Initiated By:</p>
                                              </div>
                                              <div className='col-md-9'>
                                                <p
                                                  style={{
                                                    display: 'block',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '100ch', 
                                                  }}
                                                  title={threatInfo?.path}
                                                >
                                                  {threatInfo?.path}
                                                </p>

                                                <p>{threatInfo?.processUser}</p>
                                                <p>{threatInfo?.originatingProcess}</p>
                                                <p>{threatInfo?.shA1}</p>
                                                <p>{threatInfo?.initiatedBy}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='col-md-5'>
                                            <div className='row'>
                                              <div className='col-md-4 '>
                                                <p className='semi-bold'>Detection Type:</p>
                                                <p className='semi-bold'>Classification:</p>
                                                <p className='semi-bold'> File Size:</p>
                                                <p className='semi-bold'>Storyline</p>
                                                <p className='semi-bold'>Threat id:</p>
                                              </div>
                                              <div className='col-md-6'>
                                                <p>{threatInfo?.detectionType}</p>
                                                <p>{threatInfo?.classification}</p>
                                                <p>{threatInfo?.fileSize}</p>
                                                <p>{threatInfo?.storyline}</p>
                                                <p>{threatInfo?.threatId}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <hr />
                                        <h4>END POINT</h4>
                                        {/* <hr className="my-2" /> */}

                                        <div className='row'>
                                          <div className='col-md-5'>
                                            <div className='row'>
                                              <p className='semi-bold'>
                                                Real Time Data about the end point:
                                              </p>
                                              <div className='row border-bottom'>
                                                <div className='col-md-2'>
                                                  <span>
                                                    <i className='fab fa-windows fs-40'></i>
                                                  </span>
                                                </div>
                                                <div className='col-md-9'>
                                                  <h6>DESCTOP-UPU1TUD</h6>
                                                  <p className='fs-12'>
                                                    LANCESOFT INDIA PRIVATE LIMITE / Defoult site
                                                  </p>
                                                  <p className='fs-10'>
                                                    (Connect Homes/ Defoult) Group
                                                  </p>
                                                </div>
                                              </div>
                                              <div className='col-md-4 '>
                                                {/* <p>Console connectivity</p> */}
                                                <p className='mb-2 semi-bold'>Full Disc scan:</p>
                                                <p className='semi-bold'>Pending Reboot:</p>
                                                {/* <p>Number of not Mitigated Threats</p> */}
                                                <p className='semi-bold'> Network status:</p>
                                              </div>
                                              <div className='col-md-8'>
                                                {/* <p>{endpointInfo.consoleConnectivity}</p> */}
                                                <p>{endpointInfo?.fullDiskScan}</p>
                                                <p>{endpointInfo?.pendinRreboot}</p>
                                                {/* <p>0</p> */}
                                                <p>{endpointInfo?.networkStatus}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='col-md-7'>
                                            <div className='row'>
                                              <div className='col-md-3 '>
                                                {/* <p>At Detection time :</p> */}
                                                <p className='semi-bold'>Scope:</p>
                                                <p className='semi-bold'>OS Version:</p>
                                                <p className='semi-bold'>Agent Version:</p>
                                                <p className='semi-bold'> Policy:</p>
                                                <p className='semi-bold'>Logged in user:</p>
                                                <p className='semi-bold'>UUID:</p>
                                                <p className='semi-bold'>Domain:</p>
                                                <p className='semi-bold'>IP v4 Address:</p>
                                                <p className='semi-bold'>IP v6 Address:</p>
                                                <p className='semi-bold'>Console Visible adress:</p>
                                                <p className='semi-bold'>Subscription Time:</p>
                                              </div>
                                              <div className='col-md-9'>
                                                {/* <p>.</p> */}
                                                <p>{endpointInfo?.scope}</p>
                                                <p>{endpointInfo?.osVersion}</p>
                                                <p>{endpointInfo?.agentVersion}</p>
                                                <p>{endpointInfo?.policy}</p>
                                                <p>{endpointInfo?.loggedInUser}</p>
                                                <p>{endpointInfo?.uuid}</p>
                                                <p>{endpointInfo?.domain}</p>
                                                <p>{endpointInfo?.ipV4Address}</p>
                                                <p>{endpointInfo?.ipV6Address}</p>
                                                <p>{endpointInfo?.consoleVisibleIPAddress}</p>
                                                <p>{endpointInfo?.subscriptionTime}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <span>No Data found</span>
                                    )}
                                  </div>
                                  <div
                                    className='tab-pane fade'
                                    id={`notes_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`notesTab_${index}`}
                                  >
                                    {alertNotesList.length > 0 ? (
                                      <div className='notes-container alert-table'>
                                        <div className='float-right fs-13 fc-gray text-right ds-reload'>
                                          <a href='#' onClick={handleRefresh}>
                                            <i
                                              className={`fa fa-refresh link ${
                                                isRefreshing ? 'rotate' : ''
                                              }`}
                                              title='Auto refresh every 2 minutes'
                                            />
                                          </a>
                                        </div>
                                        <table className='table'>
                                          <thead>
                                            <tr>
                                              <th className='custom-th'>User</th>
                                              <th className='custom-th'>Date</th>
                                              <th className='custom-th'>Note</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {alertNotesList.map((note) => (
                                              <tr key={note.alertsNotesId}>
                                                <td>{note.createdUser}</td>
                                                <td>{getCurrentTimeZone(note.createdDate)}</td>
                                                <td>{note.notes}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div>No notes available.</div>
                                    )}
                                  </div>
                                  <div
                                    className='tab-pane fade'
                                    id={`timeline_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`timelineTab_${index}`}
                                  >
                                    <div className='row'>
                                      <div className='row'>
                                        <div className='col-md-1'></div>
                                        <div className='col-md-11'>
                                          <div className='timeline-section h-300px scroll-y'>
                                            <div className='pt-6 h-600px'>
                                              <div className='timeline-label'>
                                                <div className='float-right fs-13 fc-gray text-right ds-reload'>
                                                  <a href='#' onClick={handleRefresh}>
                                                    <i
                                                      className={`fa fa-refresh link ${
                                                        isRefreshing ? 'rotate' : ''
                                                      }`}
                                                      title='Auto refresh every 2 minutes'
                                                    />
                                                  </a>
                                                </div>
                                                {alertHistory && alertHistory.length > 0 ? (
                                                  alertHistory
                                                    .sort((a, b) => b.activityId - a.activityId)
                                                    .map((item) => {
                                                      const formattedDateTime = getCurrentTimeZone(
                                                        item.activityDate
                                                      )

                                                      return (
                                                        <div
                                                          className='timeline-item'
                                                          key={item.activityId}
                                                        >
                                                          <div className='timeline-label fw-bold text-gray-800 fs-6'>
                                                            <p className='semi-bold'>
                                                              {formattedDateTime}
                                                            </p>
                                                            <p className='text-muted normal'>
                                                              {item.createedUser}
                                                            </p>
                                                          </div>

                                                          <div className='timeline-badge'>
                                                            <i
                                                              className={`fa fa-genderless ${getRandomClass()} fs-1`}
                                                            ></i>
                                                          </div>
                                                          <div className='fw-semibold text-gray-700 ps-3 fs-7'>
                                                            {item.primaryDescription}
                                                          </div>
                                                        </div>
                                                      )
                                                    })
                                                ) : (
                                                  <div className='text-gray-500 text-center'>
                                                    No data found
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan='10' className='text-center'>
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-end align-items-center pagination-bar mt-5'>
            <ReactPaginate
              previousLabel={<i className='fa fa-chevron-left' />}
              nextLabel={<i className='fa fa-chevron-right' />}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={8}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-end'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item custom-previous'}
              previousLinkClassName={'page-link custom-previous-link'}
              nextClassName={'page-item custom-next'}
              nextLinkClassName={'page-link custom-next-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
              forcePage={activePage - 1}
            />
            <div className='col-md-3 d-flex justify-content-end align-items-center'>
              <span className='col-md-4'>Count: </span>
              <select
                className='form-select form-select-sm col-md-4'
                value={limit}
                onChange={handlePageSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <UsersListPagination />
    </KTCardBody>
  )
}
export {AlertsPage}
