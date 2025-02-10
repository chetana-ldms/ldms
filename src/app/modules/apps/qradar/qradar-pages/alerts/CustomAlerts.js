import {useMemo, useEffect, useState, useRef} from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {UsersListPagination} from '../components/pagination/UsersListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useFormik} from 'formik'
import EditAlertsPopUp from './EditAlertsPopUp'
import {notify, notifyFail} from '../components/notification/Notification'
import {
  fetchExportDataAddUrl,
  fetchMasterData,
  fetchUpdatSetAlertIrrelavantStatuseAlert,
} from '../../../../../api/Api'
import {
  fetchGetAlertNotesByAlertID,
  fetchSetAlertEscalationStatus,
  fetchUsers,
  fetchConnectToNetworkUrl,
  fetchDisConnectFromNetworkUrl,
  fetchThreatsActionUrl,
  fetchMitigateActionValidationUrl,
  fetchCustomAlertsUrl,
  fetchCustomAlertsAnalystVerdictUpdateUrl,
  fetchCustomAlertsIncidentStatusUpdateUrl,
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
import {truncateText} from '../../../../../../utils/TruncateText'
import useFeatureActions from '../configuration/useFeatureActions'

const CustomAlerts = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const handleError = useErrorBoundary()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const toolId = Number(sessionStorage.getItem('toolID'))
  const roleId = Number(sessionStorage.getItem('roleID'))
  const featureId = Number(sessionStorage.getItem('selectedFeatureId'))
  const {featureActions} = useFeatureActions(orgId, toolId, roleId, featureId)

  const isActionAuthorized = (actionName) => {
    return featureActions?.some(
      (action) => action.actionName === actionName && action.is_authorized === true
    )
  }
  const [selectedAlert, setselectedAlert] = useState([])
  const [validations, setValidations] = useState('')
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState(null)
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const [dropdownData, setDropdownData] = useState({
    severityNameDropDownData: [],
    statusDropDown: [],
    observableTagDropDown: [],
    analystVerdictDropDown: [],
  })
  console.log(dropdownData, 'dropdownData')
  const [note, setNote] = useState('')
  const [selectedDays, setSelectedDays] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedFilterValue, setSelectedFilterValue] = useState(1)
  const status = useRef()
  const analystVerdict = useRef()
  const [openEditPage, setOpenEditPage] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [selectCheckBox, setSelectCheckBox] = useState(null)
  const [checkboxStates, setCheckboxStates] = useState({})
  useEffect(() => {
    const fetchNumberOfDays = async () => {
      try {
        const data = {
          maserDataType: 'Alert_Searchdata_duration',
          orgId: orgId,
          toolId: toolId,
        }
        const masterDataResponse = await fetchMasterData(data)
        const response = masterDataResponse
        setSelectedDays(response)
      } catch (error) {
        handleError(error)
      }
    }
    fetchNumberOfDays()
  }, [])
  const {severityNameDropDownData, statusDropDown, observableTagDropDown, analystVerdictDropDown} =
    dropdownData
  const handleFormSubmit = () => {
    setShowPopup(false)
  }
  const handleNoteChange = (event) => {
    setNote(event.target.value)
  }
  const openEditPopUp = (item) => {
    setSelectedRow(item)
    setOpenEditPage(true)
  }
  const handleClose = () => {
    setOpenEditPage(false)
  }
  useEffect(() => {
    const fetchAllMasterData = async () => {
      const severityDataRequest = {maserDataType: 'alert_Sevirity', orgId: orgId, toolId: toolId}
      const statusDataRequest = {
        maserDataType: 'Custom_Rule_Alert_Status',
        orgId: orgId,
        toolId: toolId,
      }
      const tagsDataRequest = {maserDataType: 'alert_Tags', orgId: orgId, toolId: toolId}
      const verdictDataRequest = {
        maserDataType: 'Custom_Rule_Analyst_Verdict',
        orgId: orgId,
        toolId: toolId,
      }

      try {
        const [severityData, statusData, tagsData, verdictData] = await Promise.all([
          fetchMasterData(severityDataRequest),
          fetchMasterData(statusDataRequest),
          fetchMasterData(tagsDataRequest),
          fetchMasterData(verdictDataRequest),
        ])

        setDropdownData((prevDropdownData) => ({
          ...prevDropdownData,
          severityNameDropDownData: severityData,
          statusDropDown: statusData,
          observableTagDropDown: tagsData,
          analystVerdictDropDown: verdictData,
        }))
      } catch (error) {
        handleError(error)
      }
    }

    fetchAllMasterData()
  }, [])

  const handleselectedAlert = (item, e) => {
    const {value, checked} = e.target
    setCheckboxStates((prev) => ({...prev, [value]: checked}))
    setSelectCheckBox(item)

    if (checked) {
      setselectedAlert([...selectedAlert, value])
      setIsCheckboxSelected(true)
    } else {
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
  const userID = Number(sessionStorage.getItem('userId'))
  const modifiedDate = new Date().toISOString()
  const [alertData, setAlertDate] = useState([])
  const [filteredAlertData, setFilteredAlertDate] = useState([])
  console.log(filteredAlertData, 'filteredAlertData')
  const [ldp_security_user, setldp_security_user] = useState([])
  const [alertNotesList, setAlertNotesList] = useState([])
  const [escalate, setEscalate] = useState(true)
  const [activePage, setActivePage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [ignorVisible, setIgnorVisible] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isRefreshingMoreDetails, setIsRefreshingMoreDetails] = useState(false)
  const [isRefreshingNotes, setIsRefreshingNotes] = useState(false)
  const [isRefreshingTimeLine, setIsRefreshingTimeLine] = useState(false)
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
  const [selectedToolId, setSelectedToolId] = useState(null)
  const [AnalystVerdictDropDown, setAnalystVerdictDropDown] = useState(false)
  const [selectedVerdict, setSelectedVerdict] = useState('')
  const [StatusDropDown, setStatusDropDown] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sourceProcessParentdetails, setSourceProcessParentdetails] = useState([])
  const [sourceProcessdetails, setSourceProcessdetails] = useState([])
  const [logindetails, setLogindetails] = useState([])
  const [endpointdetails, setEndpointdetails] = useState([])
  const [alertHistory, setAlertHistory] = useState([])
  const [ruleInfo, setRuleInfo] = useState([])
  const dropdownRef = useRef(null)
  const dropdownRefSatus = useRef(null)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const handleRefreshActions = async () => {
    setRefreshFlag(!refreshFlag)
    setCurrentPage(currentPage)
    setActivePage(currentPage)
    reloadHistory()
    reloadNotes()
    fetchAlertDetails()
    setTimeout(() => {
      fetchAlertDetails()
    }, 5000)
    qradaralerts(currentPage)
    setTimeout(() => {
      qradaralerts(currentPage)
    }, 2000)
  }
  const fetchAlertDetails = async () => {
    const data = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: 1,
        rangeEnd: 2,
      },
      customAlertId: selectedAlertId,
    }
    try {
      const responseDetails = await fetchCustomAlertsUrl(data)
      const alert = responseDetails?.alertsList[0]

      if (alert?.alertData) {
        const parsedAlertData = JSON.parse(alert?.alertData)
        setSentinalOne(parsedAlertData)
        console.log(sentinalOne, 'dataaaa')
        const endpoint_Info = parsedAlertData?.sourceParentProcessInfo
        setSourceProcessParentdetails(endpoint_Info)
        const networkHistory = parsedAlertData?.sourceProcessInfo
        setSourceProcessdetails(networkHistory)
        const threatHeaderDtls = parsedAlertData.alertInfo
        setLogindetails(threatHeaderDtls)
        const threatInfo = parsedAlertData.agentDetectionInfo
        setEndpointdetails(threatInfo)
        const ruleInfo = parsedAlertData.ruleInfo
        setRuleInfo(ruleInfo)
      } else {
        console.error('alertData is missing or invalid')
      }
    } catch (error) {
      handleError(error)
    }
  }
  useEffect(() => {
    fetchAlertDetails()
  }, [selectedAlertId])
  useEffect(() => {
    setActiveAccordion(null)
  }, [currentPage])

  const handleTdClick = (item, index) => {
    setSelectedAlertId(item.customAlertId)
    setSelectedToolId(item.toolID)
    setActiveAccordion((prev) => (prev === index ? null : index))
  }
  const reloadHistory = () => {
    if (selectedAlertId !== null && selectedAlertId !== undefined) {
      const data = {
        orgId,
        alertIds: [Number(selectedAlertId)],
      }
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
        const data = {
          alertID: selectedAlertId,
          toolId: selectedToolId,
          orgId: orgId,
        }
        const alertNotesList = await fetchGetAlertNotesByAlertID(data)
        const alertNoteSort = alertNotesList?.sort((a, b) => {
          const dateA = a.createdDate || 0
          const dateB = b.createdDate || 0
          return dateB - dateA
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
  useEffect(() => {
    qradaralerts(currentPage)
  }, [limit])
  const handleCloseForm = () => {
    setActionValue('')
    setShowForm(false)
    resetForm()
  }
  const handleIgnoreSubmit = async () => {
    try {
      const modifiedUserId = Number(sessionStorage.getItem('userId'))
      const orgId = Number(sessionStorage.getItem('orgId'))
      const data = {
        orgId,
        alertIDs: selectedAlert,
        modifiedUserId,
        modifiedDate: new Date().toISOString(),
        notes: note,
      }
      const response = await fetchUpdatSetAlertIrrelavantStatuseAlert(data)
      if (response.isSuccess) {
        notify(response.message)
        setIgnorVisible(false)
        setShowForm(false)
        qradaralerts(currentPage)
        reloadHistory()
        reloadNotes()
        setNote('')
        setActionValue('')
        setShowForm(false)
        resetForm()
      } else {
        notifyFail(response.message)
      }
    } catch (error) {
      handleError(error)
    }
  }
  const handleTableRefresh = () => {
    setActiveAccordion(null)
    qradaralerts(currentPage)
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
    resetForm,
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
        qradaralerts(currentPage)
        reloadHistory()
        reloadNotes()
        notify(message)
        setEscalate(false)
        setActionValue('')
        setShowForm(false)
      } else {
        notifyFail(message)
      }
      resetForm()
    },
  })
  const slaCal = (data) => {
    if (data !== null) {
      data.map((item) => {
        let resolvedTime = item.resolvedtime ? getCurrentTimeZone(item.resolvedtime) : new Date()
        let detectedTime = item.detectedTime ? getCurrentTimeZone(item.detectedTime) : null
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
  const handleReset = () => {
    setSearchValue('')
    if (status.current) {
      status.current.value = ''
    }
    if (analystVerdict.current) {
      analystVerdict.current.value = ''
    }
    setFilteredAlertDate([])
    setSelectedFilterValue(1)
    setAlertsCount(0)
    setpageCount(0)
  }
  const handleSearchAlert = async () => {
    setActivePage(1)
    const data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
      status: status.current?.value || '',
      customAlertId: 0,
      analystVerdict: analystVerdict.current?.value || '',
      name: searchValue || '',
      searchDurationInDays: selectedFilterValue || 0,
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
    try {
      setLoading(true)
      const response = await fetchCustomAlertsUrl(data2)
      setAlertsCount(response.totalAlerts)
      setSource(response.source)
      setAlertDate(response.alertsList != null ? response.alertsList : [])
      const total = response.totalAlerts
      setpageCount(Math.ceil(total / limit))
      slaCal(response?.alertsList)
      setFilteredAlertDate(response?.alertsList)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const handlePageClick = async (data) => {
    const newPage = data.selected + 1
    setCurrentPage(newPage)
    setActivePage(newPage)
    qradaralerts(newPage)
  }
  const handleFilterChange = async (e) => {
    const value = e.target.value
    setSelectedFilterValue(value)
    setActivePage(1)
    const data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: 1,
        rangeEnd: limit,
      },
      status: status.current?.value || '',
      name: searchValue || '',
      customAlertId: 0,
      searchDurationInDays: value || 0,
      analystVerdict: analystVerdict.current?.value || '',
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
    try {
      setLoading(true)
      const response = await fetchCustomAlertsUrl(data2)
      setAlertsCount(response.totalAlerts)
      setSource(response.source)
      setAlertDate(response.alertsList != null ? response.alertsList : [])
      const total = response.totalAlerts
      setpageCount(Math.ceil(total / limit))
      slaCal(response?.alertsList)
      setFilteredAlertDate(response?.alertsList)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const qradaralerts = async (page = currentPage) => {
    const rangeStart = (page - 1) * limit + 1
    const rangeEnd = page * limit
    let data2 = {
      orgId: orgId,
      toolId: toolId,
      paging: {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
      },
    }
    setLoading(true)
    const response = await fetchCustomAlertsUrl(data2)
    setAlertsCount(response.totalAlerts)
    setSource(response.source)
    setAlertDate(response.alertsList != null ? response.alertsList : [])
    setpageCount(Math.ceil(response.totalAlerts / limit))
    slaCal(response?.alertsList)
    setFilteredAlertDate(response?.alertsList)
    setLoading(false)
  }
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
  const handleRefresh = (event) => {
    event.preventDefault()
    setIsRefreshing(true)
    setCurrentPage(1)
    setActivePage(1)
    reloadNotes()
    reloadHistory()
    fetchAlertDetails()
    setselectedAlert([])
    setCheckboxStates({})
    setIsCheckboxSelected(false)
    setTimeout(() => setIsRefreshing(false), 2000)
    qradaralerts(currentPage)
  }
  const handleRefreshMoreDetails = () => {
    fetchAlertDetails()
    setIsRefreshingMoreDetails(true)
    setTimeout(() => {
      setIsRefreshingMoreDetails(false)
    }, 2000)
  }
  const handleRefreshNotes = () => {
    reloadNotes()
    setIsRefreshingNotes(true)
    setTimeout(() => {
      setIsRefreshingNotes(false)
    }, 2000)
  }
  const handleRefreshTimeLine = () => {
    reloadHistory()
    setIsRefreshingTimeLine(true)
    setTimeout(() => {
      setIsRefreshingTimeLine(false)
    }, 2000)
  }
  const RefreshInterval = 1 * 60 * 1000
  useEffect(() => {
    let isActive = true
    const refreshIntervalId = setInterval(() => {
      if (isActive && currentPage === 1) {
        setIsRefreshing(true)
        qradaralerts(1)
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
  }, [currentPage, selectedFilterValue])
  const handleMoreActionsClick = () => {
    setShowMoreActionsModal(false)
  }
  const handleThreatActions = () => {
    setShowDropdown(true)
    fetchValidations()
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
          qradaralerts(currentPage)
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
          qradaralerts(currentPage)
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
          qradaralerts(currentPage)
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
        orgId: orgId,
        toolId: toolId,
        alertIds: selectedAlert,
        analysisVerdict: selectedVerdict,
        modifiedDate,
        modifiedUserId,
      }
      const responseData = await fetchCustomAlertsAnalystVerdictUpdateUrl(data)
      const {isSuccess, message} = responseData
      if (isSuccess) {
        notify(message)
        qradaralerts(currentPage)
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
        orgId: orgId,
        toolId: toolId,
        alertIds: selectedAlert,
        status: selectedStatus,
        modifiedDate,
        modifiedUserId,
      }
      const responseData = await fetchCustomAlertsIncidentStatusUpdateUrl(data)
      const {isSuccess, message} = responseData
      if (isSuccess) {
        notify(message)
        qradaralerts(currentPage)
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
  const exportToExcel = async () => {
    // Add the heading
    let csvContent = 'Alerts Report\n'

    // Convert alertData to CSV format
    csvContent +=
      'Severity,SLA,Status,Detected time,Name,Observables tags,Owner,Source\n' +
      alertData
        .map(
          (item) =>
            `${item.severityName},${item.sla},${item.status},${item.detectedtime},${item.name},${item.source}`
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
      createdUserId: Number(sessionStorage.getItem('userId')),
      orgId: Number(sessionStorage.getItem('orgId')),
      exportDataType: 'Alerts',
    }
    try {
      const response = await fetchExportDataAddUrl(data)
    } catch (error) {
      console.error(error)
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
        item.status,
        item.detectedtime,
        item.name,
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
  const getIconClass = (osType) => {
    switch (osType) {
      case 'windows':
        return 'fab fa-windows fs-40'
      case 'macos':
        return 'fab fa-apple fs-40'
      case 'linux':
        return 'fab fa-linux fs-40'
      default:
        return '' // or a default icon class
    }
  }

  return (
    <KTCardBody className='alert-page'>
      <ToastContainer />
      <div className='mb-5'>
        <div className='d-flex justify-content-between border-0'>
          <h3 className='align-items-start flex-column'>
            <span className='fw-bold fs-3'>
              Custom Alerts{' '}
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
        <div className=''>
          <div className='row'>
            <div className='col-md-7'>
              <div className='row'>
                <div className='card-toolbar float-left'>
                  <div className='d-flex align-items-center gap-2 gap-lg-3'>
                    <div className='m-0'>
                      {isActionAuthorized('UpdateAnalystVerdict') && (
                        <>
                          <a
                            href='#'
                            className={`btn btn-small fs-14 btn-green ${
                              !isCheckboxSelected && 'disabled'
                            }`}
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
                                        <span aria-hidden='true' className='black'>
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
                                        <option key={item.dataID} value={item.dataValue}>
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
                        </>
                      )}
                    </div>
                    <div className='m-0'>
                      {isActionAuthorized('UpdateStatus') && (
                        <>
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
                                        <option key={item.dataID} value={item.dataValue}>
                                          {item.dataValue}
                                        </option>
                                      ))}
                                  </select>
                                </div>

                                <div className='text-right'>
                                  <button
                                    className='btn btn-new btn-small'
                                    onClick={handleSubmitStatus}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {isActionAuthorized('MitigateAction') && (
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
                                    {isActionAuthorized('MitigateAction') && (
                                      <option value='MitigationAction' className='mb-2'>
                                        Mitigation Action
                                      </option>
                                    )}
                                    {isActionAuthorized('AddToBlocklist') && (
                                      <option value='AddToBlockList' className='mb-2'>
                                        Add To Blocklist
                                      </option>
                                    )}
                                    {isActionAuthorized('AddToExclusion') && (
                                      <option value='AddToExclusions' className='p-2'>
                                        Add To Exclusions
                                      </option>
                                    )}
                                    {isActionAuthorized('Unquarantine') && (
                                      <option
                                        value='Unquarantine'
                                        className='p-2'
                                        disabled={
                                          selectedAlert.length == 1 && !validations.unQuarantine
                                        }
                                      >
                                        Unquarantine
                                      </option>
                                    )}
                                    {isActionAuthorized('AddANote') && (
                                      <option value='AddANote' className='p-2'>
                                        Add A Note
                                      </option>
                                    )}
                                    {isActionAuthorized('AddToNetwork') && (
                                      <option
                                        value='ConnectToNetwork'
                                        className='p-2'
                                        disabled={
                                          selectedAlert.length == 1 && !validations.addToNetwork
                                        }
                                      >
                                        Connect To Network
                                      </option>
                                    )}
                                    {isActionAuthorized('DisconnectFromNetwork') && (
                                      <option
                                        value='DisconnectFromNetwork'
                                        className='p-2'
                                        disabled={
                                          selectedAlert.length == 1 &&
                                          !validations.disconnectFromNetwork
                                        }
                                      >
                                        Disconnect From Network
                                      </option>
                                    )}
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
                        className={`btn btn-small fs-14 btn-green ${
                          !isCheckboxSelected && 'disabled'
                        }`}
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
                                  {isActionAuthorized('CreateIncident') && (
                                    <option
                                      value='1'
                                      disabled={
                                        selectCheckBox.alertIncidentMappingId > 0 ||
                                        selectCheckBox.positiveAnalysis === 'False Positive'
                                      }
                                    >
                                      Create Incident
                                    </option>
                                  )}
                                  {isActionAuthorized('Escalate') && (
                                    <option value='2'>Escalate</option>
                                  )}
                                  {isActionAuthorized('IrrelevantIgnore') && (
                                    <option value='3'>Irrelevant / Ignore</option>
                                  )}
                                </select>
                              </div>
                            </div>

                            {actionsValue === '2' && escalate && (
                              <div>
                                {/* Escalation Form */}
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
                                    <label
                                      className='form-label fw-bolder'
                                      htmlFor='excalatecomments'
                                    >
                                      Comments <sup className='red'>*</sup>:
                                    </label>
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
                                    <button
                                      type='submit'
                                      className='btn btn-primary btn-small btn-new'
                                    >
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
                              <div>
                                <div className='mb-5'>
                                  <label className='form-label fw-bolder' htmlFor='noteField'>
                                    Note <sup className='red'>*</sup>:
                                  </label>
                                  <textarea
                                    id='noteField'
                                    className='form-control'
                                    rows='1'
                                    placeholder='Write your note here...'
                                    value={note}
                                    onChange={handleNoteChange}
                                    required
                                  ></textarea>
                                </div>
                                <div className='d-flex justify-content-end'>
                                  <button
                                    type='button'
                                    className='btn btn-small btn-new'
                                    onClick={handleIgnoreSubmit}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='mt-2 bd-highlight'>
                      <div className='w-100px me-0'>
                        <select
                          className='form-select form-select-sm'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc885a14bb'
                          data-allow-clear='true'
                          value={selectedFilterValue}
                          onChange={handleFilterChange}
                        >
                          {selectedDays?.map((day, index) => (
                            <option key={index} value={day.dataValue}>
                              {day.dataName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='d-flex'>
                  <div className='export-report ms-2 '>
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
                  <div className='ds-reload mt-2 ms-5 '>
                    <span className='fs-13 fc-gray' onClick={handleRefresh}>
                      Auto refresh every 2 minutes{' '}
                      <i
                        className={`fa fa-refresh link ${isRefreshing ? 'rotate' : ''}`}
                        title='Auto refresh every 2 minutes'
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-5'>
              <div className='card-title header-filter'>
                {/* begin::Search */}
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control form-control-sm'
                    placeholder='Search Custom Alerts'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button className='btn btn-sm btn-primary' onClick={handleSearchAlert}>
                    <i className='fas fa-search'></i>
                  </button>
                </div>
                <div className='d-flex justify-content-between bd-highlight mb-3'>
                  <div className='mt-2 bd-highlight'>
                    <div className='w-150px me-2'>
                      <div>
                        <select
                          className='form-select form-select-sm'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-dropdown-parent='#kt_menu_637dc885a14bb'
                          data-allow-clear='true'
                          ref={status}
                          // onChange={handleStatusChange}
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
                  <div className='w-150px mt-2'>
                    <div>
                      <select
                        className='form-select form-select-sm'
                        data-kt-select2='true'
                        data-placeholder='Select option'
                        data-dropdown-parent='#kt_menu_637dc885a14bb'
                        data-allow-clear='true'
                        ref={analystVerdict}
                      >
                        <option value=''>Select</option>
                        {analystVerdictDropDown.length > 0 &&
                          analystVerdictDropDown.map((item) => (
                            <option key={item.dataID} value={item.dataValue}>
                              {item.dataValue}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className='mt-2 ms-1 btn btn-primary btn-sm ' onClick={handleReset}>
                    Reset
                  </div>
                </div>
              </div>
            </div>
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
        <div className='card-body1' id='kt_accordion_1'>
          <div className='table-responsive alert-table scroll-x'>
            <table className='table align-middle gs-0 gy-4 fixed-header'>
              <thead>
                <tr className='fw-bold bg-light'>
                  <th className='w-25px'></th>
                  <th>Severity</th>
                  <th>AnalystVerdict</th>
                  <th>SLA</th>
                  <th>Status</th>
                  <th style={{width: 140}}>Detected Time</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Endpoint Name</th>
                  <th>Event Type</th>
                </tr>
              </thead>
              <tbody id='kt_accordion_1'>
                {loading && <UsersListLoading />}
                {filteredAlertData !== null ? (
                  filteredAlertData.map((item, index) => (
                    <>
                      <tr className='table-row' key={item.customAlertId}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            <input
                              className='form-check-input widget-13-check'
                              type='checkbox'
                              value={item.customAlertId}
                              name={item.customAlertId}
                              checked={checkboxStates[item.customAlertId] || false}
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

                        <td>
                          <span className='text-dark d-block'>{item.severity}</span>
                        </td>
                        <td>
                          <span className=''>{item.analystVerdict}</span>
                        </td>
                        <td>
                          <span className='text-dark d-block'>{item.sla}</span>
                        </td>
                        <td>{item.incidentStatus}</td>
                        <td>
                          <span className='text-dark d-block'>
                            <span>
                              {item.detectedTime && getCurrentTimeZone(item.detectedTime)}
                            </span>
                          </span>
                        </td>
                        <td
                          id={'kt_accordion_1_header_' + index}
                          data-bs-toggle='collapse'
                          data-bs-target={'#kt_accordion_1_body_' + index}
                          aria-expanded={activeAccordion === index ? 'true' : 'false'}
                          aria-controls={'kt_accordion_1_body_' + index}
                          style={{cursor: 'pointer'}}
                          onClick={() => handleTdClick(item, index)}
                        >
                          <span className='link-txt' title={item.ruleName}>
                            {truncateText(item.ruleName, 20)}
                          </span>
                        </td>
                        <td className='text-dark fw-bold fs-8' title={item.sourceProcessName}>
                          {truncateText(item.sourceProcessName, 12)}
                        </td>
                        <td className='text-dark fw-bold fs-8'>{item.endpointName}</td>
                        <td className='fs-8'>{item.eventType}</td>
                      </tr>
                      <tr
                        id={'kt_accordion_1_body_' + index}
                        className={`accordion-collapse collapse ${
                          activeAccordion === index ? 'show' : ''
                        }`}
                        aria-labelledby={'kt_accordion_1_header_' + index}
                        data-bs-parent='#kt_accordion_1'
                      >
                        <td colSpan='10'>
                          <div className='row'>
                            <div className='col-md-12'>
                              <div className='card pad-10'>
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
                                      Source Process Parent details
                                    </a>
                                  </li>
                                  <li className='nav-item' role='presentation'>
                                    <a
                                      className='nav-link'
                                      id={`sourceProcessDetailsTab_${index}`}
                                      data-bs-toggle='tab'
                                      href={`#sourceProcessDetails_${index}`}
                                      role='tab'
                                      aria-controls={`sourceProcessDetails_${index}`}
                                      aria-selected='false'
                                    >
                                      Source Process Details
                                    </a>
                                  </li>

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
                                      Login details
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
                                      Endpoint details
                                    </a>
                                  </li>
                                  <li className='nav-item' role='presentation'>
                                    <a
                                      className='nav-link'
                                      id={`customRuleTab_${index}`}
                                      data-bs-toggle='tab'
                                      href={`#customRule_${index}`}
                                      role='tab'
                                      aria-controls={`customRule_${index}`}
                                      aria-selected='false'
                                    >
                                      Custom Rule
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
                                      <div className='row'>
                                        <div className='col-md-2'>
                                          <div className='left-labels'>
                                            <p>
                                              <b>Name</b>
                                            </p>
                                            <p>
                                              <b>Image Path</b>
                                            </p>
                                            <p>
                                              <b>User</b>
                                            </p>
                                            <p>
                                              <b>Start Time</b>
                                            </p>
                                            <p>
                                              <b>Command Line</b>
                                            </p>
                                            <p>
                                              <b>Integrity Level</b>
                                            </p>
                                            <p>
                                              <b>Publisher</b>
                                            </p>
                                            <p>
                                              <b>Subsystem</b>
                                            </p>
                                            <p>
                                              <b>PID</b>
                                            </p>
                                            <p>
                                              <b>Storyline</b>
                                            </p>
                                            <p>
                                              <b>Unique ID</b>
                                            </p>
                                            <p>
                                              <b>Image SHA1</b>
                                            </p>
                                            <p>
                                              <b>Image SHA256</b>
                                            </p>
                                            <p>
                                              <b>Image MD5</b>
                                            </p>
                                          </div>
                                        </div>
                                        <div className='col-md-10'>
                                          <div className='right-values'>
                                            <p>{sourceProcessParentdetails?.name}</p>
                                            <p>{sourceProcessParentdetails?.filePath}</p>
                                            <p>{sourceProcessParentdetails?.user}</p>
                                            <p>{sourceProcessParentdetails?.pidStarttime}</p>
                                            <p>{sourceProcessParentdetails?.commandline}</p>
                                            <p>{sourceProcessParentdetails?.integrityLevel}</p>
                                            <p>{sourceProcessParentdetails?.fileSignerIdentity}</p>
                                            <p>{sourceProcessParentdetails?.subsystem}</p>
                                            <p>{sourceProcessParentdetails?.pid}</p>
                                            <p>{sourceProcessParentdetails?.storyline}</p>
                                            <p>{sourceProcessParentdetails?.uniqueId}</p>
                                            <p>{sourceProcessParentdetails?.fileHashSha1}</p>
                                            <p>{sourceProcessParentdetails?.fileHashSha256}</p>
                                            <p>{sourceProcessParentdetails?.fileHashMd5}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className='tab-pane fade'
                                    id={`sourceProcessDetails_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`sourceProcessDetailsTab_${index}`}
                                  >
                                    <div className='row'>
                                      <div className='col-md-2'>
                                        <div className='left-labels'>
                                          <p>
                                            <b>Name</b>
                                          </p>
                                          <p>
                                            <b>Image Path</b>
                                          </p>
                                          <p>
                                            <b>User</b>
                                          </p>
                                          <p>
                                            <b>Start Time</b>
                                          </p>
                                          <p>
                                            <b>Command Line</b>
                                          </p>
                                          <p>
                                            <b>Integrity Level</b>
                                          </p>
                                          <p>
                                            <b>Publisher</b>
                                          </p>
                                          <p>
                                            <b>Subsystem</b>
                                          </p>
                                          <p>
                                            <b>PID</b>
                                          </p>
                                          <p>
                                            <b>Storyline</b>
                                          </p>
                                          <p>
                                            <b>Unique ID</b>
                                          </p>
                                          <p>
                                            <b>Image SHA1</b>
                                          </p>
                                          <p>
                                            <b>Image SHA256</b>
                                          </p>
                                          <p>
                                            <b>Image MD5</b>
                                          </p>
                                        </div>
                                      </div>

                                      <div className='col-md-10'>
                                        <div className='right-values'>
                                          <p>{sourceProcessdetails?.name}</p>
                                          <p>{sourceProcessdetails?.filePath}</p>
                                          <p>{sourceProcessdetails?.user}</p>
                                          <p>{sourceProcessdetails?.pidStarttime}</p>
                                          <p>{sourceProcessdetails?.commandline}</p>
                                          <p>{sourceProcessdetails?.integrityLevel}</p>
                                          <p>{sourceProcessdetails?.fileSignerIdentity}</p>
                                          <p>{sourceProcessdetails?.subsystem}</p>
                                          <p>{sourceProcessdetails?.pid}</p>
                                          <p>{sourceProcessdetails?.storyline}</p>
                                          <p>{sourceProcessdetails?.uniqueId}</p>
                                          <p>{sourceProcessdetails?.fileHashSha1}</p>
                                          <p>{sourceProcessdetails?.fileHashSha256}</p>
                                          <p>{sourceProcessdetails?.fileHashMd5}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className='tab-pane fade'
                                    id={`notes_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`notesTab_${index}`}
                                  >
                                    <div className='row'>
                                      <div className='col-md-2'>
                                        <div className='left-labels'>
                                          <p>
                                            <b>User Name</b>
                                          </p>
                                          <p>
                                            <b>Source Machine IP</b>
                                          </p>
                                          <p>
                                            <b>Login is Successful</b>
                                          </p>
                                          <p>
                                            <b>Type</b>
                                          </p>
                                          <p>
                                            <b>Is Administrator Equivalent</b>
                                          </p>
                                          <p>
                                            <b>Account SID</b>
                                          </p>
                                          <p>
                                            <b>Account Domain</b>
                                          </p>
                                        </div>
                                      </div>

                                      <div className='col-md-10'>
                                        <div className='right-values'>
                                          <p>{logindetails?.loginsUserName}</p>
                                          <p>{logindetails?.srcMachineIp}</p>
                                          <p>
                                            {logindetails?.loginIsSuccessful
                                              ? logindetails?.loginIsSuccessful
                                              : 'false'}
                                          </p>
                                          <p>{logindetails?.loginType}</p>
                                          <p>
                                            {logindetails?.loginIsAdministratorEquivalent
                                              ? logindetails?.loginIsAdministratorEquivalent
                                              : 'false'}
                                          </p>
                                          <p>{logindetails?.loginAccountSid}</p>
                                          <p>{logindetails?.loginAccountDomain}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className='tab-pane fade'
                                    id={`timeline_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`timelineTab_${index}`}
                                  >
                                    <div className='row'>
                                      <div className='col-md-2'>
                                        <div className='left-labels'>
                                          <p>
                                            <b>Endpoint Name</b>
                                          </p>
                                          <p>
                                            <b>Endpoint OS Type</b>
                                          </p>
                                          <p>
                                            <b>Endpoint OS Name</b>
                                          </p>
                                          <p>
                                            <b>Endpoint OS Revision</b>
                                          </p>
                                          <p>
                                            <b>Agent UUID</b>
                                          </p>
                                          <p>
                                            <b>Agent Version</b>
                                          </p>
                                          <p>
                                            <b>Agent Machine Type</b>
                                          </p>
                                          <p>
                                            <b>Site ID</b>
                                          </p>
                                        </div>
                                      </div>

                                      <div className='col-md-10'>
                                        <div className='right-values'>
                                          <p>{endpointdetails?.name}</p>
                                          <p>{endpointdetails?.osName}</p>
                                          <p>{endpointdetails?.osRevision}</p>
                                          <p>{endpointdetails?.uuid}</p>
                                          <p>{endpointdetails?.version}</p>
                                          <p>{endpointdetails?.machineType}</p>
                                          <p>
                                            {endpointdetails?.siteId
                                              ? endpointdetails?.siteId
                                              : 'N/A'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className='tab-pane fade'
                                    id={`customRule_${index}`}
                                    role='tabpanel'
                                    aria-labelledby={`customRuleTab_${index}`}
                                  >
                                    <div className='row'>
                                      <div className='col-md-2'>
                                        <div className='left-labels'>
                                          <p>
                                            <b>Name</b>
                                          </p>
                                          <p>
                                            <b>Login Failures</b>
                                          </p>
                                          <p>
                                            <b>Description</b>
                                          </p>
                                          <p>
                                            <b>Scope</b>
                                          </p>
                                          <p>
                                            <b>Query Language</b>
                                          </p>
                                          <p>
                                            <b>Query</b>
                                          </p>
                                          <p>
                                            <b>Severity</b>
                                          </p>
                                          <p>
                                            <b>ID</b>
                                          </p>
                                          <p>
                                            <b>Auto Response</b>
                                          </p>
                                        </div>
                                      </div>

                                      <div className='col-md-10'>
                                        <div className='right-values'>
                                          <p>{ruleInfo?.name}</p>
                                          <p>
                                            {ruleInfo?.description ? ruleInfo?.description : 'N/A'}
                                          </p>
                                          <p>{ruleInfo?.scopeLevel}</p>
                                          <p>{ruleInfo?.queryLang}</p>
                                          <p>{ruleInfo?.s1ql}</p>
                                          <p>{ruleInfo?.severity}</p>
                                          <p>{ruleInfo?.id}</p>
                                          <p>{ruleInfo?.treatAsThreat}</p>
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
export default CustomAlerts
