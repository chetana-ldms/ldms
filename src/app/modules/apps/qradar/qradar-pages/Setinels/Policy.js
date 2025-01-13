import React, {useEffect, useState} from 'react'
import {
  fetchPolicyDetailsUrl,
  fetchSentinalOnePolicyUpdateUrl,
} from '../../../../../api/SentinalApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {getCurrentTimeZone} from '../../../../../../utils/helper'
import './Policy.css'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EventTypeConfiguration from './EventTypeConfiguration'

function Policy() {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const accountId = sessionStorage.getItem('accountId')
  const siteId = sessionStorage.getItem('siteId')
  const groupId = sessionStorage.getItem('groupId')
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [showModal, setShowModal] = useState(false)
  const handleShowModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const [policy, setPolicy] = useState({
    mitigationMode: 'protect',
    autoMitigationAction: 'mitigation.quarantineThreat',
    mitigationModeSuspicious: 'detect',
    monitorOnExecute: false,
    isDvPolicyPerEventType: false,
    monitorOnWrite: false,
    iocSupported: false,
    networkQuarantineOn: false,
    removeMacros: false,
    agentUiOn: false,
    containment: false,
    allowRemoteShell: false,
    autoDecommissionOn: false,
    autoDecommissionDays: 0,
    snapshotsOn: false,
    antiTamperingOn: false,
    scanNewAgents: false,
    signedDriverBlockingOn: false,
    agentNotification: false,
    agentLoggingOn: false,
    researchOn: false,
    networkQuarantineOn: false,
    fwForNetworkQuarantineEnabled: false,
    identityEndpointReporting: '',
    identityOn: false,
    identityReportInterval: 0,
    identityThrottlingInterval: 0,
    identityUpdateInterval: 0,
    inheritedFrom: '',
    ioc: false,
    allowUnprotectByApprovedProcess: false,
    driverBlocking: false,
    enginesflag: {
      reputation: false,
      preExecution: false,
      preExecutionSuspicious: false,
      executables: false,
      documentScript: false,
      dataFiles: false,
      exploits: false,
      applicationControl: false,
      penetration: false,
      pup: false,
      lateralMovement: false,
      remoteShell: false,
      driftDetection: false,
      idr: false,
    },
    agentUi: {
      agentUiOn: false,
      contactCompany: '',
      contactDirectMessage: '',
      contactEmail: '',
      contactFreeText: '',
      contactOther: '',
      contactPhoneNumber: '',
      contactSupportWebsite: '',
      devicePopUpNotifications: false,
      maxEventAgeDays: 0,
      showAgentWarnings: false,
      showDeviceTab: false,
      showQuarantineTab: false,
      showSupport: false,
      showSuspicious: false,
      threatPopUpNotifications: false,
    },
    iocAttributes: {
      process: false,
      file: false,
      url: false,
      dns: false,
      ip: false,
      login: false,
      registry: false,
      scheduledTask: false,
      behavioralIndicators: false,
      commandScripts: false,
      crossProcess: false,
      driver: false,
      dataMasking: false,
      smartFileMonitoring: false,
      autoInstallBrowserExtensions: false,
      dllModuleLoad: false,
      fds: false,
      namedPipe: false,
      namedPipeExtended: false,
      windowsEventLogs: false,
      windowsEventLogsExtended: false,
    },
    dvAttributesPerEventType: {
      isEnabled: false,
      autoInstallBrowserExtensions: {
        isEnabled: false,
        count: '',
        autoInstallBrowserExtensions: false,
      },
      behavioralIndicators: {
        isEnabled: false,
        count: '',
        dvEventTypeBehavioralIndicators: false,
      },
      commandScripts: {
        isEnabled: false,
        count: '',
        dvEventTypeCommandScripts: false,
      },
      crossProcess: {
        isEnabled: false,
        count: '',
          dvEventTypeCrossProcessDuplicateProcess: false,
          dvEventTypeCrossProcessDuplicateThread: false,
          dvEventTypeCrossProcessOpenProcess: false,
          dvEventTypeCrossProcessRemoteThread: false,
      },
      dataMasking: {
        isEnabled: false,
        count: '',
        dataMasking: false,
      },
      dllModuleLoad: {
        isEnabled: false,
        count: '',
        dvEventTypeDllModuleLoad: false,
      },
      dns: {
        isEnabled: false,
        count: '',
        dvEventTypeDns: false,
      },
      driver: {
        isEnabled: false,
        count: '',
        dvEventTypeDriverLoad: false,
      },
      file: {
        isEnabled: false,
        count: '',
          dvEventTypeFileCreation: false,
          dvEventTypeFileDeletion: false,
          dvEventTypeFileModification: false,
          dvEventTypeFileRename: false,
          fullDiskScan: false,
      },
      ip: {
        isEnabled: false,
        count: '',
          dvEventTypeIpConnect: false,
          dvEventTypeIpListen: false,
      },
      login: {
        isEnabled: false,
        count: '',
          dvEventTypeLoginLoggedIn: false,
          dvEventTypeLoginLoggedOut: false,
      },
      namedPipe: {
        isEnabled: false,
        count: '',
          dvEventTypeNamedPipeConnection: false,
          dvEventTypeNamedPipeCreation: false,
      },
      namedPipeExtended: {
        isEnabled: false,
        count: '',
        namedPipeExtended: false,
      },
      process: {
        isEnabled: false,
        count: '',
          dvEventTypeProcessCreation: true,
          dvEventTypeProcessExit: null,
          dvEventTypeProcessModification: null,
      },
      registry: {
        isEnabled: false,
        count: '',
          dvEventTypeRegistryKeyCreated: false,
          dvEventTypeRegistryKeyDelete: false,
          dvEventTypeRegistryKeyExport: false,
          dvEventTypeRegistryKeyImport: false,
          dvEventTypeRegistryKeyRename: false,
          dvEventTypeRegistryKeySecurityChanged: true,
          dvEventTypeRegistryValueCreated: false,
          dvEventTypeRegistryValueDeleted: false,
          dvEventTypeRegistryValueModified: false,
      },
      scheduledTask: {
        isEnabled: false,
        count: '',
          dvEventTypeScheduledTaskDelete: false,
          dvEventTypeScheduledTaskRegister: false,
          dvEventTypeScheduledTaskStart: false,
          dvEventTypeScheduledTaskTrigger: false,
          dvEventTypeScheduledTaskUpdate: false,
      },
      smartFileMonitoring: {
        isEnabled: false,
        count: '',
        smartFileMonitoring: false,
      },
      url: {
        isEnabled: false,
        count: '',
        dvEventTypeUrl: false,
      },
      windowsEventLogs: {
        isEnabled: false,
        count: '',
        dvEventTypeWindowsEventLogCreation: false,
      },
      windowsEventLogsExtended: {
        isEnabled: false,
        count: '',
        windowsEventLogsExtended: false,
      },
      openDirectoryActivity: null,
      profileActivity: null,
      userSubstitution: null,
    },

    autoFileUpload: {
      enabled: false,
      includeBenignFiles: false,
      maxDailyFileUpload: 0,
      maxDailyFileUploadLimit: 0,
      maxFileSize: 0,
      maxFileSizeLimit: 0,
      maxLocalDiskUsage: 0,
      maxLocalDiskUsageLimit: 0,
    },
    autoImmuneOn: false,
    cloudValidationOn: false,
    identityConfigurationSettings: {
      identityMaxMemoryUsage: 0,
      identityThresholdMonitoring: false,
      identityMaxDefinedMemoryLimit: 0,
      identityMaxCpuThreshold: 0,
      identityMaxMemoryLimit: 0,
    },
    remoteScriptOrchestration: {
      alwaysUploadStreamToCloud: false,
      maxDailyFileDownload: 0,
      maxDailyFileDownloadLimit: 0,
      maxDailyFileUpload: 0,
      maxDailyFileUploadLimit: 0,
      maxFileSize: 0,
      maxFileSizeLimit: 0,
      maxLocalPackageDiskUsage: 0,
      maxLocalPackageDiskUsageLimit: 0,
    },
    remoteOpsForensics: {
      parsedArtifactsDestination: '',
      maximumFileSizeUploadLimit: 0,
      maximumFileSizeUpload: 0,
      cpuLimit: 0,
      maximumDailyUploadLimit: 0,
      enabled: false,
      maximumDailyUpload: 0,
    },
    identityConfigurationSettings: {
      identityMaxMemoryUsage: 0,
      identityThresholdMonitoring: false,
      identityMaxDefinedMemoryLimit: 0,
      identityMaxCpuThreshold: 0,
      identityMaxMemoryLimit: 0,
    },
  })

  console.log(policy, 'policy')
  const [isDefaultPolicy, setIsDefaultPolicy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deepVisibilityEnabled, setDeepVisibilityEnabled] = useState(false)
  const [policyData, setPolicyData] = useState(null)
  const handleRadioChange = (e) => {
    const {name, value} = e.target

    setPolicy((prev) => {
      const updatedPolicy = {...prev, [name]: value}

      if (name === 'mitigationModeSuspicious' && value === 'protect') {
        updatedPolicy.autoMitigationAction = prev.autoMitigationAction || 'mitigation.none'
      }

      return updatedPolicy
    })
  }

  const handleCheckboxChange = (e) => {
    const {name, checked} = e.target
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      [name]: checked,
    }))
  }
  const handleDetectionEngineChange = (engine) => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      enginesflag: {
        ...prevPolicy.enginesflag,
        [engine]: !prevPolicy.enginesflag[engine],
      },
    }))
  }
  const handleAgentUiChange = (key) => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      agentUi: {
        ...prevPolicy.agentUi,
        [key]: !prevPolicy.agentUi[key],
      },
    }))
  }
  const handleDvAttributeChange = (key) => {
    setPolicy((prevPolicy) => {
      const updatedDvAttributes = {
        ...prevPolicy.dvAttributesPerEventType,
        [key]: {
          ...prevPolicy.dvAttributesPerEventType[key],
          isEnabled: !prevPolicy.dvAttributesPerEventType[key]?.isEnabled,
        },
      }

      // Check if any attribute is enabled
      const isAnyEnabled = Object.values(updatedDvAttributes).some((attr) => attr?.isEnabled)

      // If none are enabled and `deepVisibilityEnabled` is true, set `process` to true
      if (deepVisibilityEnabled && !isAnyEnabled) {
        updatedDvAttributes.process = {
          ...updatedDvAttributes.process,
          isEnabled: true,
        }
      }

      return {
        ...prevPolicy,
        dvAttributesPerEventType: updatedDvAttributes,
      }
    })
  }

  const handleDeepVisibilityEnabled = () => {
    setDeepVisibilityEnabled((prev) => {
      const newDeepVisibilityState = !prev

      if (newDeepVisibilityState) {
        setPolicy((prevPolicy) => {
          const updatedDvAttributes = {
            ...prevPolicy.dvAttributesPerEventType,
          }

          // Check if no attributes are enabled
          const isAnyEnabled = Object.values(updatedDvAttributes).some((attr) => attr?.isEnabled)

          // If none are enabled, set `process` to true
          if (!isAnyEnabled) {
            updatedDvAttributes.process = {
              ...updatedDvAttributes.process,
              isEnabled: true,
            }
          }

          return {
            ...prevPolicy,
            dvAttributesPerEventType: updatedDvAttributes,
          }
        })
      }

      return newDeepVisibilityState
    })
  }

  const handleAutoFileUploadChange = () => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      autoFileUpload: {
        ...prevPolicy.autoFileUpload,
        enabled: !prevPolicy.autoFileUpload.enabled,
      },
    }))
  }
  const handleFileUploadFieldChange = (field, value) => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      autoFileUpload: {
        ...prevPolicy.autoFileUpload,
        [field]: value ? Number(value) * 1024 * 1024 : 0,
      },
    }))
  }
  const handleAutoDecommissionChange = () => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      autoDecommissionOn: !prevPolicy.autoDecommissionOn,
    }))
  }

  const handleRemoteShellChange = () => {
    setPolicy((prevPolicy) => ({
      ...prevPolicy,
      allowRemoteShell: !prevPolicy.allowRemoteShell,
    }))
  }

  const fetchData = async () => {
    let data = {
      orgID: orgId,
      toolId: toolId,
      tenantPolicyScope: false,
      accountPolicyScope: false,
      sitePolicyScope: false,
      groupPolicyScope: false,
      scopeId: null,
    }

    if (groupId) {
      data.scopeId = groupId
      data.groupPolicyScope = true
    } else if (siteId) {
      data.scopeId = siteId
      data.sitePolicyScope = true
    } else if (accountId) {
      data.scopeId = accountId
      data.accountPolicyScope = true
    }

    try {
      setLoading(true)
      const response = await fetchPolicyDetailsUrl(data)

      // Initialize policy and deepVisibilityEnabled
      let updatedPolicy = {...response}

      if (response?.dvAttributesPerEventType?.isEnabled) {
        const isAnyEnabled = Object.values(response.dvAttributesPerEventType).some(
          (attr) => attr?.isEnabled
        )

        if (!isAnyEnabled) {
          updatedPolicy.dvAttributesPerEventType = {
            ...response.dvAttributesPerEventType,
            process: {
              ...response.dvAttributesPerEventType?.process,
              isEnabled: true,
            },
          }
        }
      }

      setPolicy(updatedPolicy)
      setIsDefaultPolicy(response?.inheritedFrom)
      setDeepVisibilityEnabled(response?.dvAttributesPerEventType?.isEnabled || false)
    } catch (error) {
      console.error('API request error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const handleStepClick = (action) => {
    setPolicy((prev) => ({
      ...prev,
      autoMitigationAction: action,
    }))
  }
  const stepData = [
    {action: 'mitigation.quarantineThreat', label: 'Kill & Quarantine'},
    {action: 'mitigation.remediateThreat', label: 'Remediate'},
    {action: 'mitigation.rollbackThreat', label: 'Rollback'},
  ]
  const handleInheritSettingsChange = (isChecked) => {
    setIsDefaultPolicy(isChecked)
    setPolicy((prev) => ({
      ...prev,
      inheritedFrom: isChecked ? '' : null,
      isDefaultPolicy: isChecked,
    }))
  }
  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      let data = {
        orgId: orgId,
        toolId: toolId,
        tenantPolicyScope: false,
        accountPolicyScope: false,
        sitePolicyScope: false,
        groupPolicyScope: false,
        scopeId: null,
        data: {
          agentLoggingOn: policy?.agentLoggingOn || false,
          agentNotification: policy?.agentNotification || false,
          agentUi: {
            agentUiOn: policy?.agentUi?.agentUiOn || false,
            contactCompany: policy?.agentUi?.contactCompany,
            contactDirectMessage: policy?.agentUi?.contactDirectMessage,
            contactEmail: policy?.agentUi?.contactEmail,
            contactFreeText: policy?.agentUi?.contactFreeText,
            contactOther: policy?.agentUi?.contactOther,
            contactPhoneNumber: policy?.agentUi?.contactPhoneNumber,
            contactSupportWebsite: policy?.agentUi?.contactSupportWebsite,
            devicePopUpNotifications: policy?.agentUi?.devicePopUpNotifications || false,
            maxEventAgeDays: policy?.agentUi?.maxEventAgeDays,
            showAgentWarnings: policy?.agentUi?.showAgentWarnings || false,
            showDeviceTab: policy?.agentUi?.showDeviceTab || false,
            showQuarantineTab: policy?.agentUi?.showQuarantineTab || false,
            showSupport: policy?.agentUi?.showSupport || false,
            showSuspicious: policy?.agentUi?.showSuspicious || false,
            threatPopUpNotifications: policy?.agentUi?.threatPopUpNotifications || false,
          },
          allowRemoteShell: policy?.allowRemoteShell || false,
          allowUnprotectByApprovedProcess: policy?.allowUnprotectByApprovedProcess || false,
          antiTamperingOn: policy?.antiTamperingOn || false,
          autoDecommissionDays: policy?.autoDecommissionDays,
          autoDecommissionOn: policy?.autoDecommissionOn || false,
          autoFileUpload: {
            enabled: policy?.autoFileUpload?.enabled || false,
            includeBenignFiles: policy?.autoFileUpload?.includeBenignFiles,
            maxDailyFileUploadLimit: policy?.autoFileUpload?.maxDailyFileUploadLimit,
            maxFileSizeLimit: policy?.autoFileUpload?.maxFileSizeLimit,
            maxLocalDiskUsageLimit: policy?.autoFileUpload?.maxLocalDiskUsageLimit,
            maxFileSize: policy.autoFileUpload.maxFileSize,
            maxDailyFileUpload: policy.autoFileUpload.maxDailyFileUpload,
            maxLocalDiskUsage: policy.autoFileUpload.maxLocalDiskUsage,
          },
          autoImmuneOn: policy?.autoImmuneOn,
          autoMitigationAction: policy?.autoMitigationAction || '',
          createdAt: policy?.createdAt,
          driverBlocking: policy?.driverBlocking,
          dvAttributesPerEventType: {
            isEnabled: deepVisibilityEnabled || false,
            autoInstallBrowserExtensions: {
              autoInstallBrowserExtensions:
                policy?.dvAttributesPerEventType?.autoInstallBrowserExtensions
                  ?.autoInstallBrowserExtensions,
            },
            behavioralIndicators: {
              dvEventTypeBehavioralIndicators:
                policy?.dvAttributesPerEventType?.behavioralIndicators?.isEnabled || false,
            },
            commandScripts: {
              dvEventTypeCommandScripts:
                policy?.dvAttributesPerEventType?.commandScripts?.isEnabled || false,
            },
            login: policy?.dvAttributesPerEventType?.login?.isEnabled
              ? {
                  dvEventTypeLoginLoggedIn: true,
                  dvEventTypeLoginLoggedOut: true,
                }
              : {
                  dvEventTypeLoginLoggedIn: false,
                  dvEventTypeLoginLoggedOut: false,
                },
            crossProcess: policy?.dvAttributesPerEventType?.crossProcess?.isEnabled
              ? {
                  dvEventTypeCrossProcessDuplicateProcess: true,
                  dvEventTypeCrossProcessDuplicateThread: true,
                  dvEventTypeCrossProcessOpenProcess: true,
                  dvEventTypeCrossProcessRemoteThread: true,
                }
              : {
                  dvEventTypeCrossProcessDuplicateProcess: false,
                  dvEventTypeCrossProcessDuplicateThread: false,
                  dvEventTypeCrossProcessOpenProcess: false,
                  dvEventTypeCrossProcessRemoteThread: false,
                },
            dataMasking: {
              dataMasking: policy?.dvAttributesPerEventType?.dataMasking?.isEnabled || false,
            },
            dllModuleLoad: {
              dvEventTypeDllModuleLoad:
                policy?.dvAttributesPerEventType?.dllModuleLoad?.dvEventTypeDllModuleLoad,
            },
            dns: {
              dvEventTypeDns: policy?.dvAttributesPerEventType?.dns?.isEnabled || false,
            },
            driver: {
              dvEventTypeDriverLoad: policy?.dvAttributesPerEventType?.driver?.isEnabled || false,
            },
            file: policy?.dvAttributesPerEventType?.file?.isEnabled
              ? {
                  dvEventTypeFileCreation: true,
                  dvEventTypeFileDeletion: true,
                  dvEventTypeFileModification: true,
                  dvEventTypeFileRename: true,
                  fullDiskScan: true,
                }
              : {
                  dvEventTypeFileCreation: false,
                  dvEventTypeFileDeletion: false,
                  dvEventTypeFileModification: false,
                  dvEventTypeFileRename: false,
                  fullDiskScan: false,
                },
            ip: policy?.dvAttributesPerEventType?.ip?.isEnabled
              ? {
                  dvEventTypeIpConnect: true,
                  dvEventTypeIpListen: true,
                }
              : {
                  dvEventTypeIpConnect: false,
                  dvEventTypeIpListen: false,
                },
            namedPipe: {
              dvEventTypeNamedPipeConnection:
                policy?.dvAttributesPerEventType?.namedPipe?.dvEventTypeNamedPipeConnection,
              dvEventTypeNamedPipeCreation:
                policy?.dvAttributesPerEventType?.namedPipe?.dvEventTypeNamedPipeCreation,
            },
            namedPipeExtended: {
              namedPipeExtended:
                policy?.dvAttributesPerEventType?.namedPipeExtended?.namedPipeExtended,
            },
            process: {
              dvEventTypeProcessCreation:
                policy?.dvAttributesPerEventType?.process?.isEnabled || false,
            },
            registry: policy?.dvAttributesPerEventType?.registry?.isEnabled
              ? {
                  dvEventTypeRegistryKeyCreated: true,
                  dvEventTypeRegistryKeyDelete: true,
                  dvEventTypeRegistryKeyExport: true,
                  dvEventTypeRegistryKeyImport: true,
                  dvEventTypeRegistryKeyRename: true,
                  dvEventTypeRegistryKeySecurityChanged: true,
                  dvEventTypeRegistryValueCreated: true,
                  dvEventTypeRegistryValueDeleted: true,
                  dvEventTypeRegistryValueModified: true,
                }
              : {
                  dvEventTypeRegistryKeyCreated: false,
                  dvEventTypeRegistryKeyDelete: false,
                  dvEventTypeRegistryKeyExport: false,
                  dvEventTypeRegistryKeyImport: false,
                  dvEventTypeRegistryKeyRename: false,
                  dvEventTypeRegistryKeySecurityChanged: false,
                  dvEventTypeRegistryValueCreated: false,
                  dvEventTypeRegistryValueDeleted: false,
                  dvEventTypeRegistryValueModified: false,
                },
            scheduledTask: policy?.dvAttributesPerEventType?.scheduledTask?.isEnabled
              ? {
                  dvEventTypeScheduledTaskDelete: true,
                  dvEventTypeScheduledTaskRegister: true,
                  dvEventTypeScheduledTaskStart: true,
                  dvEventTypeScheduledTaskTrigger: true,
                  dvEventTypeScheduledTaskUpdate: true,
                }
              : {
                  dvEventTypeScheduledTaskDelete: false,
                  dvEventTypeScheduledTaskRegister: false,
                  dvEventTypeScheduledTaskStart: false,
                  dvEventTypeScheduledTaskTrigger: false,
                  dvEventTypeScheduledTaskUpdate: false,
                },
            smartFileMonitoring: {
              smartFileMonitoring:
                policy?.dvAttributesPerEventType?.smartFileMonitoring?.isEnabled || false,
            },
            url: {
              dvEventTypeUrl: policy?.dvAttributesPerEventType?.url?.isEnabled || false,
            },
            windowsEventLogs: {
              dvEventTypeWindowsEventLogCreation:
                policy?.dvAttributesPerEventType?.windowsEventLogs
                  ?.dvEventTypeWindowsEventLogCreation,
            },
            windowsEventLogsExtended: {
              windowsEventLogsExtended:
                policy?.dvAttributesPerEventType?.windowsEventLogsExtended
                  ?.windowsEventLogsExtended,
            },
          },
          enginesflag: {
            applicationControl: policy?.enginesflag?.applicationControl || false,
            dataFiles: policy?.enginesflag?.dataFiles || false,
            driftDetection: policy?.enginesflag?.driftDetection || false,
            executables: policy?.enginesflag?.executables || false,
            exploits: policy?.enginesflag?.exploits || false,
            idr: policy?.enginesflag?.idr || false,
            lateralMovement: policy?.enginesflag?.lateralMovement || false,
            penetration: policy?.enginesflag?.penetration || false,
            preExecution: policy?.enginesflag?.preExecution || false,
            preExecutionSuspicious: policy?.enginesflag?.preExecutionSuspicious || false,
            pup: policy?.enginesflag?.pup || false,
            remoteShell: policy?.enginesflag?.remoteShell || false,
            reputation: policy?.enginesflag?.reputation || false,
          },
          fwForNetworkQuarantineEnabled: policy?.fwForNetworkQuarantineEnabled,
          identityEndpointReporting: policy?.identityEndpointReporting,
          identityOn: policy?.identityOn,
          identityReportInterval: policy?.identityReportInterval,
          identityThrottlingInterval: policy?.identityThrottlingInterval,
          identityUpdateInterval: policy?.identityUpdateInterval,
          inheritedFrom: policy?.inheritedFrom || '',
          ioc: policy?.ioc,
          iocAttributes: {
            autoInstallBrowserExtensions:
              policy?.iocAttributes?.autoInstallBrowserExtensions || false,
            behavioralIndicators: policy?.iocAttributes?.behavioralIndicators || false,
            commandScripts: policy?.iocAttributes?.commandScripts || false,
            crossProcess: policy?.iocAttributes?.crossProcess || false,
            dataMasking: policy?.iocAttributes?.dataMasking || false,
            dllModuleLoad: policy?.iocAttributes?.dllModuleLoad || false,
            dns: policy?.iocAttributes?.dns || false,
            driver: policy?.iocAttributes?.driver || false,
            fds: policy?.iocAttributes?.fds || false,
            file: policy?.iocAttributes?.file || false,
            ip: policy?.iocAttributes?.ip || false,
            login: policy?.iocAttributes?.login || false,
            namedPipe: policy?.iocAttributes?.namedPipe || false,
            namedPipeExtended: policy?.iocAttributes?.namedPipeExtended || false,
            process: policy?.iocAttributes?.process || false,
            registry: policy?.iocAttributes?.registry || false,
            scheduledTask: policy?.iocAttributes?.scheduledTask || false,
            smartFileMonitoring: policy?.iocAttributes?.smartFileMonitoring || false,
            url: policy?.iocAttributes?.url || false,
            windowsEventLogs: policy?.iocAttributes?.windowsEventLogs || false,
            windowsEventLogsExtended: policy?.iocAttributes?.windowsEventLogsExtended || false,
          },
          isDefault: isDefaultPolicy || false,
          isDvPolicyPerEventType: policy?.isDvPolicyPerEventType,
          mitigationMode: policy?.mitigationMode,
          mitigationModeSuspicious: policy?.mitigationModeSuspicious,
          monitorOnExecute: policy?.monitorOnExecute,
          monitorOnWrite: policy?.monitorOnWrite,
          iocSupported: policy?.iocSupported || false,
          networkQuarantineOn: policy?.networkQuarantineOn,
          remoteScriptOrchestration: {
            alwaysUploadStreamToCloud: policy?.remoteScriptOrchestration?.alwaysUploadStreamToCloud,
            maxDailyFileDownload: policy?.remoteScriptOrchestration?.maxDailyFileDownload,
            maxDailyFileDownloadLimit: policy?.remoteScriptOrchestration?.maxDailyFileDownloadLimit,
            maxDailyFileUpload: policy?.remoteScriptOrchestration?.maxDailyFileUpload,
            maxDailyFileUploadLimit: policy?.remoteScriptOrchestration?.maxDailyFileUploadLimit,
            maxFileSize: policy?.remoteScriptOrchestration?.maxFileSize,
            maxFileSizeLimit: policy?.remoteScriptOrchestration?.maxFileSizeLimit,
            maxLocalPackageDiskUsage: policy?.remoteScriptOrchestration?.maxLocalPackageDiskUsage,
            maxLocalPackageDiskUsageLimit:
              policy?.remoteScriptOrchestration?.maxLocalPackageDiskUsageLimit,
          },
          remoteOpsForensics: {
            parsedArtifactsDestination: policy?.remoteOpsForensics?.parsedArtifactsDestination,
            maximumFileSizeUploadLimit: policy?.remoteOpsForensics?.maximumFileSizeUploadLimit,
            maximumFileSizeUpload: policy?.remoteOpsForensics?.maximumFileSizeUpload,
            cpuLimit: policy?.remoteOpsForensics?.cpuLimit,
            maximumDailyUploadLimit: policy?.remoteOpsForensics?.maximumDailyUploadLimit,
            enabled: policy?.remoteOpsForensics?.enabled,
            maximumDailyUpload: policy?.remoteOpsForensics?.maximumDailyUpload,
          },
          identityConfigurationSettings: {
            identityMaxMemoryUsage: policy?.identityConfigurationSettings?.identityMaxMemoryUsage,
            identityThresholdMonitoring:
              policy?.identityConfigurationSettings?.identityThresholdMonitoring,
            identityMaxDefinedMemoryLimit:
              policy?.identityConfigurationSettings?.identityMaxDefinedMemoryLimit,
            identityMaxCpuThreshold: policy?.identityConfigurationSettings?.identityMaxCpuThreshold,
            identityMaxMemoryLimit: policy?.identityConfigurationSettings?.identityMaxMemoryLimit,
          },
          agentUiOn: policy?.agentUi?.agentUiOn || false,
          removeMacros: policy?.removeMacros,
          researchOn: policy?.researchOn,
          scanNewAgents: policy?.scanNewAgents || false,
          signedDriverBlockingOn: policy?.signedDriverBlockingOn || false,
          snapshotsOn: policy?.snapshotsOn || false,
          unsignedDriverBlockingOn: true,
          updatedAt: new Date().toISOString(),
        },
      }
      if (groupId) {
        data.scopeId = groupId
        data.groupPolicyScope = true
      } else if (siteId) {
        data.scopeId = siteId
        data.sitePolicyScope = true
      } else if (accountId) {
        data.scopeId = accountId
        data.accountPolicyScope = true
      }
      setPolicyData(data)
      const response = await fetchSentinalOnePolicyUpdateUrl(data)
      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        fetchData()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleEventTypeConfigurationClick = () => {
    try {
      setLoading(true)
      let data = {
        orgId: orgId,
        toolId: toolId,
        tenantPolicyScope: false,
        accountPolicyScope: false,
        sitePolicyScope: false,
        groupPolicyScope: false,
        scopeId: null,
        data: {
          agentLoggingOn: policy?.agentLoggingOn || false,
          agentNotification: policy?.agentNotification || false,
          agentUi: {
            agentUiOn: policy?.agentUi?.agentUiOn || false,
            contactCompany: policy?.agentUi?.contactCompany,
            contactDirectMessage: policy?.agentUi?.contactDirectMessage,
            contactEmail: policy?.agentUi?.contactEmail,
            contactFreeText: policy?.agentUi?.contactFreeText,
            contactOther: policy?.agentUi?.contactOther,
            contactPhoneNumber: policy?.agentUi?.contactPhoneNumber,
            contactSupportWebsite: policy?.agentUi?.contactSupportWebsite,
            devicePopUpNotifications: policy?.agentUi?.devicePopUpNotifications || false,
            maxEventAgeDays: policy?.agentUi?.maxEventAgeDays,
            showAgentWarnings: policy?.agentUi?.showAgentWarnings || false,
            showDeviceTab: policy?.agentUi?.showDeviceTab || false,
            showQuarantineTab: policy?.agentUi?.showQuarantineTab || false,
            showSupport: policy?.agentUi?.showSupport || false,
            showSuspicious: policy?.agentUi?.showSuspicious || false,
            threatPopUpNotifications: policy?.agentUi?.threatPopUpNotifications || false,
          },
          allowRemoteShell: policy?.allowRemoteShell || false,
          allowUnprotectByApprovedProcess: policy?.allowUnprotectByApprovedProcess || false,
          antiTamperingOn: policy?.antiTamperingOn || false,
          autoDecommissionDays: policy?.autoDecommissionDays,
          autoDecommissionOn: policy?.autoDecommissionOn || false,
          autoFileUpload: {
            enabled: policy?.autoFileUpload?.enabled || false,
            includeBenignFiles: policy?.autoFileUpload?.includeBenignFiles,
            maxDailyFileUploadLimit: policy?.autoFileUpload?.maxDailyFileUploadLimit,
            maxFileSizeLimit: policy?.autoFileUpload?.maxFileSizeLimit,
            maxLocalDiskUsageLimit: policy?.autoFileUpload?.maxLocalDiskUsageLimit,
            maxFileSize: policy.autoFileUpload.maxFileSize,
            maxDailyFileUpload: policy.autoFileUpload.maxDailyFileUpload,
            maxLocalDiskUsage: policy.autoFileUpload.maxLocalDiskUsage,
          },
          autoImmuneOn: policy?.autoImmuneOn,
          autoMitigationAction: policy?.autoMitigationAction || '',
          createdAt: policy?.createdAt,
          driverBlocking: policy?.driverBlocking,
          dvAttributesPerEventType: {
            isEnabled: deepVisibilityEnabled || false,
            autoInstallBrowserExtensions: {
              autoInstallBrowserExtensions:
                policy?.dvAttributesPerEventType?.autoInstallBrowserExtensions
                  ?.autoInstallBrowserExtensions,
            },
            behavioralIndicators: {
              dvEventTypeBehavioralIndicators:
                policy?.dvAttributesPerEventType?.behavioralIndicators?.isEnabled || false,
            },
            commandScripts: {
              dvEventTypeCommandScripts:
                policy?.dvAttributesPerEventType?.commandScripts?.isEnabled || false,
            },
            login: policy?.dvAttributesPerEventType?.login?.isEnabled
              ? {
                  dvEventTypeLoginLoggedIn: true,
                  dvEventTypeLoginLoggedOut: true,
                }
              : {
                  dvEventTypeLoginLoggedIn: false,
                  dvEventTypeLoginLoggedOut: false,
                },
            crossProcess: policy?.dvAttributesPerEventType?.crossProcess?.isEnabled
              ? {
                  dvEventTypeCrossProcessDuplicateProcess: true,
                  dvEventTypeCrossProcessDuplicateThread: true,
                  dvEventTypeCrossProcessOpenProcess: true,
                  dvEventTypeCrossProcessRemoteThread: true,
                }
              : {
                  dvEventTypeCrossProcessDuplicateProcess: false,
                  dvEventTypeCrossProcessDuplicateThread: false,
                  dvEventTypeCrossProcessOpenProcess: false,
                  dvEventTypeCrossProcessRemoteThread: false,
                },
            dataMasking: {
              dataMasking: policy?.dvAttributesPerEventType?.dataMasking?.isEnabled || false,
            },
            dllModuleLoad: {
              dvEventTypeDllModuleLoad:
                policy?.dvAttributesPerEventType?.dllModuleLoad?.dvEventTypeDllModuleLoad,
            },
            dns: {
              dvEventTypeDns: policy?.dvAttributesPerEventType?.dns?.isEnabled || false,
            },
            driver: {
              dvEventTypeDriverLoad: policy?.dvAttributesPerEventType?.driver?.isEnabled || false,
            },
            file: policy?.dvAttributesPerEventType?.file?.isEnabled
              ? {
                  dvEventTypeFileCreation: true,
                  dvEventTypeFileDeletion: true,
                  dvEventTypeFileModification: true,
                  dvEventTypeFileRename: true,
                  fullDiskScan: true,
                }
              : {
                  dvEventTypeFileCreation: false,
                  dvEventTypeFileDeletion: false,
                  dvEventTypeFileModification: false,
                  dvEventTypeFileRename: false,
                  fullDiskScan: false,
                },
            ip: policy?.dvAttributesPerEventType?.ip?.isEnabled
              ? {
                  dvEventTypeIpConnect: true,
                  dvEventTypeIpListen: true,
                }
              : {
                  dvEventTypeIpConnect: false,
                  dvEventTypeIpListen: false,
                },
            namedPipe: {
              dvEventTypeNamedPipeConnection:
                policy?.dvAttributesPerEventType?.namedPipe?.dvEventTypeNamedPipeConnection,
              dvEventTypeNamedPipeCreation:
                policy?.dvAttributesPerEventType?.namedPipe?.dvEventTypeNamedPipeCreation,
            },
            namedPipeExtended: {
              namedPipeExtended:
                policy?.dvAttributesPerEventType?.namedPipeExtended?.namedPipeExtended,
            },
            process: {
              dvEventTypeProcessCreation:
                policy?.dvAttributesPerEventType?.process?.isEnabled || false,
            },
            registry: policy?.dvAttributesPerEventType?.registry?.isEnabled
              ? {
                  dvEventTypeRegistryKeyCreated: true,
                  dvEventTypeRegistryKeyDelete: true,
                  dvEventTypeRegistryKeyExport: true,
                  dvEventTypeRegistryKeyImport: true,
                  dvEventTypeRegistryKeyRename: true,
                  dvEventTypeRegistryKeySecurityChanged: true,
                  dvEventTypeRegistryValueCreated: true,
                  dvEventTypeRegistryValueDeleted: true,
                  dvEventTypeRegistryValueModified: true,
                }
              : {
                  dvEventTypeRegistryKeyCreated: false,
                  dvEventTypeRegistryKeyDelete: false,
                  dvEventTypeRegistryKeyExport: false,
                  dvEventTypeRegistryKeyImport: false,
                  dvEventTypeRegistryKeyRename: false,
                  dvEventTypeRegistryKeySecurityChanged: false,
                  dvEventTypeRegistryValueCreated: false,
                  dvEventTypeRegistryValueDeleted: false,
                  dvEventTypeRegistryValueModified: false,
                },
            scheduledTask: policy?.dvAttributesPerEventType?.scheduledTask?.isEnabled
              ? {
                  dvEventTypeScheduledTaskDelete: true,
                  dvEventTypeScheduledTaskRegister: true,
                  dvEventTypeScheduledTaskStart: true,
                  dvEventTypeScheduledTaskTrigger: true,
                  dvEventTypeScheduledTaskUpdate: true,
                }
              : {
                  dvEventTypeScheduledTaskDelete: false,
                  dvEventTypeScheduledTaskRegister: false,
                  dvEventTypeScheduledTaskStart: false,
                  dvEventTypeScheduledTaskTrigger: false,
                  dvEventTypeScheduledTaskUpdate: false,
                },
            smartFileMonitoring: {
              smartFileMonitoring:
                policy?.dvAttributesPerEventType?.smartFileMonitoring?.isEnabled || false,
            },
            url: {
              dvEventTypeUrl: policy?.dvAttributesPerEventType?.url?.isEnabled || false,
            },
            windowsEventLogs: {
              dvEventTypeWindowsEventLogCreation:
                policy?.dvAttributesPerEventType?.windowsEventLogs
                  ?.dvEventTypeWindowsEventLogCreation,
            },
            windowsEventLogsExtended: {
              windowsEventLogsExtended:
                policy?.dvAttributesPerEventType?.windowsEventLogsExtended
                  ?.windowsEventLogsExtended,
            },
          },
          enginesflag: {
            applicationControl: policy?.enginesflag?.applicationControl || false,
            dataFiles: policy?.enginesflag?.dataFiles || false,
            driftDetection: policy?.enginesflag?.driftDetection || false,
            executables: policy?.enginesflag?.executables || false,
            exploits: policy?.enginesflag?.exploits || false,
            idr: policy?.enginesflag?.idr || false,
            lateralMovement: policy?.enginesflag?.lateralMovement || false,
            penetration: policy?.enginesflag?.penetration || false,
            preExecution: policy?.enginesflag?.preExecution || false,
            preExecutionSuspicious: policy?.enginesflag?.preExecutionSuspicious || false,
            pup: policy?.enginesflag?.pup || false,
            remoteShell: policy?.enginesflag?.remoteShell || false,
            reputation: policy?.enginesflag?.reputation || false,
          },
          fwForNetworkQuarantineEnabled: policy?.fwForNetworkQuarantineEnabled,
          identityEndpointReporting: policy?.identityEndpointReporting,
          identityOn: policy?.identityOn,
          identityReportInterval: policy?.identityReportInterval,
          identityThrottlingInterval: policy?.identityThrottlingInterval,
          identityUpdateInterval: policy?.identityUpdateInterval,
          inheritedFrom: policy?.inheritedFrom || '',
          ioc: policy?.ioc,
          iocAttributes: {
            autoInstallBrowserExtensions:
              policy?.iocAttributes?.autoInstallBrowserExtensions || false,
            behavioralIndicators: policy?.iocAttributes?.behavioralIndicators || false,
            commandScripts: policy?.iocAttributes?.commandScripts || false,
            crossProcess: policy?.iocAttributes?.crossProcess || false,
            dataMasking: policy?.iocAttributes?.dataMasking || false,
            dllModuleLoad: policy?.iocAttributes?.dllModuleLoad || false,
            dns: policy?.iocAttributes?.dns || false,
            driver: policy?.iocAttributes?.driver || false,
            fds: policy?.iocAttributes?.fds || false,
            file: policy?.iocAttributes?.file || false,
            ip: policy?.iocAttributes?.ip || false,
            login: policy?.iocAttributes?.login || false,
            namedPipe: policy?.iocAttributes?.namedPipe || false,
            namedPipeExtended: policy?.iocAttributes?.namedPipeExtended || false,
            process: policy?.iocAttributes?.process || false,
            registry: policy?.iocAttributes?.registry || false,
            scheduledTask: policy?.iocAttributes?.scheduledTask || false,
            smartFileMonitoring: policy?.iocAttributes?.smartFileMonitoring || false,
            url: policy?.iocAttributes?.url || false,
            windowsEventLogs: policy?.iocAttributes?.windowsEventLogs || false,
            windowsEventLogsExtended: policy?.iocAttributes?.windowsEventLogsExtended || false,
          },
          isDefault: isDefaultPolicy || false,
          isDvPolicyPerEventType: policy?.isDvPolicyPerEventType,
          mitigationMode: policy?.mitigationMode,
          mitigationModeSuspicious: policy?.mitigationModeSuspicious,
          monitorOnExecute: policy?.monitorOnExecute,
          monitorOnWrite: policy?.monitorOnWrite,
          iocSupported: policy?.iocSupported || false,
          networkQuarantineOn: policy?.networkQuarantineOn,
          remoteScriptOrchestration: {
            alwaysUploadStreamToCloud: policy?.remoteScriptOrchestration?.alwaysUploadStreamToCloud,
            maxDailyFileDownload: policy?.remoteScriptOrchestration?.maxDailyFileDownload,
            maxDailyFileDownloadLimit: policy?.remoteScriptOrchestration?.maxDailyFileDownloadLimit,
            maxDailyFileUpload: policy?.remoteScriptOrchestration?.maxDailyFileUpload,
            maxDailyFileUploadLimit: policy?.remoteScriptOrchestration?.maxDailyFileUploadLimit,
            maxFileSize: policy?.remoteScriptOrchestration?.maxFileSize,
            maxFileSizeLimit: policy?.remoteScriptOrchestration?.maxFileSizeLimit,
            maxLocalPackageDiskUsage: policy?.remoteScriptOrchestration?.maxLocalPackageDiskUsage,
            maxLocalPackageDiskUsageLimit:
              policy?.remoteScriptOrchestration?.maxLocalPackageDiskUsageLimit,
          },
          remoteOpsForensics: {
            parsedArtifactsDestination: policy?.remoteOpsForensics?.parsedArtifactsDestination,
            maximumFileSizeUploadLimit: policy?.remoteOpsForensics?.maximumFileSizeUploadLimit,
            maximumFileSizeUpload: policy?.remoteOpsForensics?.maximumFileSizeUpload,
            cpuLimit: policy?.remoteOpsForensics?.cpuLimit,
            maximumDailyUploadLimit: policy?.remoteOpsForensics?.maximumDailyUploadLimit,
            enabled: policy?.remoteOpsForensics?.enabled,
            maximumDailyUpload: policy?.remoteOpsForensics?.maximumDailyUpload,
          },
          identityConfigurationSettings: {
            identityMaxMemoryUsage: policy?.identityConfigurationSettings?.identityMaxMemoryUsage,
            identityThresholdMonitoring:
              policy?.identityConfigurationSettings?.identityThresholdMonitoring,
            identityMaxDefinedMemoryLimit:
              policy?.identityConfigurationSettings?.identityMaxDefinedMemoryLimit,
            identityMaxCpuThreshold: policy?.identityConfigurationSettings?.identityMaxCpuThreshold,
            identityMaxMemoryLimit: policy?.identityConfigurationSettings?.identityMaxMemoryLimit,
          },
          agentUiOn: policy?.agentUi?.agentUiOn || false,
          removeMacros: policy?.removeMacros,
          researchOn: policy?.researchOn,
          scanNewAgents: policy?.scanNewAgents || false,
          signedDriverBlockingOn: policy?.signedDriverBlockingOn || false,
          snapshotsOn: policy?.snapshotsOn || false,
          unsignedDriverBlockingOn: true,
          updatedAt: new Date().toISOString(),
        },
      }
      if (groupId) {
        data.scopeId = groupId
        data.groupPolicyScope = true
      } else if (siteId) {
        data.scopeId = siteId
        data.sitePolicyScope = true
      } else if (accountId) {
        data.scopeId = accountId
        data.accountPolicyScope = true
      }
      setPolicyData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  };
  
  const handleAction = () => {
    setShowModal(false)
  }
  const handleResponseData = (data) => {
    setPolicy(data)
    console.log(data, "valuefomchild")
  };
  

  return (
    <div className='account-policy'>
      <ToastContainer />
      {loading ? (
        <UsersListLoading />
      ) : (
        <>
          <div className='card mb-1'>
            <div className='card-body p-0 m-0 px-5'>
              <div className='d-flex justify-content-between align-items-center'>
                <div className='bg-white mb-1 p-2 '>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='form-check ms-5'>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        id='inheritDefaultSettings'
                        checked={policy?.inheritedFrom !== null}
                        onChange={(e) => handleInheritSettingsChange(e.target.checked)}
                      />
                      <label className='form-check-label mt-1' htmlFor='inheritDefaultSettings'>
                        Default Inherited Settings
                      </label>
                    </div>
                  </div>
                </div>
                <div className=''>
                  <button className='btn btn-primary p-0 px-4 py-2' onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={`${isDefaultPolicy ? 'disabled-page' : ''}`}>
            <div className='row'>
              <div className='col-md-7'>
                <div className='card'>
                  <div className='bg-heading'>
                    <h6 className='white pad-10'>Protection Mode</h6>
                  </div>
                  <div className='card-body pad-10'>
                    <div className='d-flex'>
                      <h6 className='mr-3'>Malicious Threats</h6>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input'
                          type='radio'
                          id='detect'
                          name='mitigationMode'
                          value='detect'
                          checked={policy?.mitigationMode === 'detect'}
                          onChange={handleRadioChange}
                        />
                        <label className='form-check-label mr-3' htmlFor='detect'>
                          Detect
                        </label>
                      </div>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input'
                          type='radio'
                          id='protect'
                          name='mitigationMode'
                          value='protect'
                          checked={policy?.mitigationMode === 'protect'}
                          onChange={handleRadioChange}
                        />
                        <label className='form-check-label mr-3' htmlFor='protect'>
                          Protect
                        </label>
                      </div>
                      <div className='form-check form-check-inline'>
                        {policy?.mitigationMode === 'protect' ? (
                          policy?.autoMitigationAction === 'mitigation.none' ? (
                            <span>Alerts only</span>
                          ) : policy?.autoMitigationAction === 'mitigation.quarantineThreat' ? (
                            <span>Kill & Quarantine</span>
                          ) : policy?.autoMitigationAction === 'mitigation.remediateThreat' ? (
                            <span>Kill & Quarantine, Remediate</span>
                          ) : policy?.autoMitigationAction === 'mitigation.rollbackThreat' ? (
                            <span>Kill & Quarantine, Remediate, Rollback</span>
                          ) : (
                            <span>Unknown Action</span>
                          )
                        ) : (
                          <span>Alerts only</span>
                        )}
                      </div>
                    </div>

                    <div className='d-flex my-5'>
                      <h6 className='mr-3'>Suspicious Threat</h6>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input'
                          type='radio'
                          id='detectSuspicious'
                          name='mitigationModeSuspicious'
                          value='detect'
                          checked={policy?.mitigationModeSuspicious === 'detect'}
                          onChange={handleRadioChange}
                        />
                        <label className='form-check-label mr-3' htmlFor='detectSuspicious'>
                          Detect
                        </label>
                      </div>
                      <div className='form-check form-check-inline'>
                        <input
                          className='form-check-input'
                          type='radio'
                          id='protectSuspicious'
                          name='mitigationModeSuspicious'
                          value='protect'
                          checked={policy?.mitigationModeSuspicious === 'protect'}
                          onChange={handleRadioChange}
                        />
                        <label className='form-check-label mr-3' htmlFor='protectSuspicious'>
                          Protect
                        </label>
                      </div>
                      <div className='form-check form-check-inline'>
                        {policy?.mitigationModeSuspicious === 'protect' ? (
                          policy?.autoMitigationAction === 'mitigation.none' ? (
                            <span>Alerts only</span>
                          ) : policy?.autoMitigationAction === 'mitigation.quarantineThreat' ? (
                            <span>Kill & Quarantine</span>
                          ) : policy?.autoMitigationAction === 'mitigation.remediateThreat' ? (
                            <span>Kill & Quarantine, Remediate</span>
                          ) : policy?.autoMitigationAction === 'mitigation.rollbackThreat' ? (
                            <span>Kill & Quarantine, Remediate, Rollback</span>
                          ) : (
                            <span>Unknown Action</span>
                          )
                        ) : (
                          <span>Alerts only</span>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div
                      className={`progress-line-bar border-top border-btm mt-5 mb-5 pt-3 ${
                        policy?.mitigationMode === 'detect' ? 'disabled' : ''
                      }`}
                    >
                      <h6 className='mr-3 float-left'>Protect Level</h6>
                      <div className='stepper-wrapper'>
                        {stepData.map((step, index) => {
                          const isCompleted =
                            step.action === policy?.autoMitigationAction ||
                            stepData.findIndex((s) => s.action === policy?.autoMitigationAction) >
                              index
                          const isActive = step.action === policy?.autoMitigationAction

                          return (
                            <div
                              key={step.action}
                              className={`stepper-item ${isCompleted ? 'completed' : ''} ${
                                isActive ? 'active' : ''
                              }`}
                              onClick={() => handleStepClick(step.action)}
                            >
                              <div className='step-counter'>
                                {isCompleted ? <i className='fa fa-check' /> : index + 1}
                              </div>
                              <div className='step-name'>{step.label}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <h4>Malicious Macros Mitigation</h4>
                    <p>
                      This only applies when the static AI detection engine is on. Protection mode
                      from malicious threat.{' '}
                    </p>
                    <input
                      className=''
                      type='checkbox'
                      name='removeMacros'
                      checked={policy?.removeMacros}
                      onChange={handleCheckboxChange}
                    />
                    <label>
                      Remove malicious Macros from the office file instead of placing the files in
                      quarantine
                    </label>
                    <hr />
                    <div>
                      <span>
                        {' '}
                        <strong>Containment</strong>{' '}
                      </span>
                      <span className='mg-left-5'>
                        {' '}
                        <input
                          className=''
                          type='checkbox'
                          name='networkQuarantineOn'
                          checked={policy?.networkQuarantineOn}
                          onChange={handleCheckboxChange}
                        />
                        <label>Disconnect from the network</label>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-5'>
                <div className='card'>
                  <div className='card-header bg-heading'>
                    <h6 className='pad-10 white'>Detection Engine</h6>
                  </div>
                  <div className='card-body pad-10'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='reputation'
                        checked={policy?.enginesflag?.reputation}
                        onChange={() => handleDetectionEngineChange('reputation')}
                        disabled
                      />
                      <label className='form-check-label' htmlFor='reputation'>
                        Reputation
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='preExecution'
                        checked={policy?.enginesflag?.preExecution}
                        onChange={() => handleDetectionEngineChange('preExecution')}
                      />
                      <label className='form-check-label' htmlFor='preExecution'>
                        Static AI
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='preExecutionSuspicious'
                        checked={policy?.enginesflag?.preExecutionSuspicious}
                        onChange={() => handleDetectionEngineChange('preExecutionSuspicious')}
                      />
                      <label className='form-check-label' htmlFor='preExecutionSuspicious'>
                        Static AI - Suspicious
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='behavioralAi'
                        checked={policy?.enginesflag?.executables}
                        onChange={() => handleDetectionEngineChange('executables')}
                      />
                      <label className='form-check-label' htmlFor='executables'>
                        Behavioral AI - Executable
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='documentScript'
                        checked={policy?.enginesflag?.dataFiles}
                        onChange={() => handleDetectionEngineChange('dataFiles')}
                      />
                      <label className='form-check-label' htmlFor='dataFiles'>
                        Document, Script
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='lateralMovements'
                        checked={policy?.enginesflag?.lateralMovement}
                        onChange={() => handleDetectionEngineChange('lateralMovement')}
                      />
                      <label className='form-check-label' htmlFor='lateralMovements'>
                        Lateral Movements
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='antiExploitation'
                        checked={policy?.enginesflag?.exploits}
                        onChange={() => handleDetectionEngineChange('exploits')}
                      />
                      <label className='form-check-label' htmlFor='antiExploitation'>
                        Anti Exploitation / Fileless
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='pup'
                        checked={policy?.enginesflag?.pup}
                        onChange={() => handleDetectionEngineChange('pup')}
                      />
                      <label className='form-check-label' htmlFor='pup'>
                        Potential Unwanted Applications
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='applicationControls'
                        checked={policy?.enginesflag?.applicationControl}
                        onChange={() => handleDetectionEngineChange('applicationControl')}
                      />
                      <label className='form-check-label' htmlFor='applicationControls'>
                        Application Controls
                      </label>
                    </div>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id='penetration'
                        checked={policy?.enginesflag?.penetration}
                        onChange={() => handleDetectionEngineChange('penetration')}
                      />
                      <label className='form-check-label' htmlFor='penetration'>
                        Detect Alternative Threats
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-12'>
                <div className='card'>
                  <div className='card-header bg-heading'>
                    <h6 className='white pad-10'>Agent</h6>
                  </div>
                  <div className='card-body row pad-10 mt-3'>
                    <div className='col-md-2'>
                      <p className='semi-bold'>Security Settings :</p>
                    </div>
                    <div className='col-md-10'>
                      <ul>
                        <li className='form-check form-switch inline-block'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='snapshots'
                            name='snapshotsOn'
                            checked={policy?.snapshotsOn}
                            onChange={handleCheckboxChange}
                          />
                          <label className='form-check-label' htmlFor='snapshots'>
                            Snapshots
                          </label>
                        </li>
                        <li className='form-check form-switch inline-block'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='antiTamper'
                            name='antiTamperingOn'
                            checked={policy?.antiTamperingOn}
                            onChange={handleCheckboxChange}
                          />
                          <label className='form-check-label' htmlFor='antiTamper'>
                            Anti Tamper
                          </label>
                        </li>
                        <li className='form-check form-switch inline-block'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='scanNewAgents'
                            name='scanNewAgents'
                            checked={policy?.scanNewAgents}
                            onChange={handleCheckboxChange}
                          />
                          <label className='form-check-label' htmlFor='scanNewAgents'>
                            Scan new agents
                          </label>
                        </li>
                        <li className='form-check form-switch inline-block'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='suspiciousDriveBlocking'
                            name='signedDriverBlockingOn'
                            checked={policy?.signedDriverBlockingOn}
                            onChange={handleCheckboxChange}
                          />
                          <label className='form-check-label' htmlFor='suspiciousDriveBlocking'>
                            Suspicious Drive Blocking
                          </label>
                        </li>
                        <li className='form-check form-switch inline-block'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id='logging'
                            name='agentLoggingOn'
                            checked={policy?.agentLoggingOn}
                            onChange={handleCheckboxChange}
                          />
                          <label className='form-check-label' htmlFor='logging'>
                            Logging
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-12'>
                <div className='card'>
                  <div className='bg-heading'>
                    <h6 className='white pad-10'>Agent UI</h6>
                  </div>
                  <div className='mt-5 card-body pad-10'>
                    <input
                      className=''
                      type='checkbox'
                      id='agentUi'
                      name='agentUiOn'
                      checked={policy?.agentUi?.agentUiOn}
                      onChange={() => handleAgentUiChange('agentUiOn')}
                    />
                    <label htmlFor='agentUi'>Show Agent UI & tray icon on endpoints</label>

                    <p className='semi-bold'>
                      Set which information and notification to show for end-user
                    </p>
                    <div className='d-flex justify-align-center'>
                      <span className='inline-block w-250px'>Show pop-up notification for:</span>
                      <div className='form-check-inline form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='threatMitigation'
                          name='threatPopUpNotifications'
                          checked={policy?.agentUi?.threatPopUpNotifications}
                          onChange={() => handleAgentUiChange('threatPopUpNotifications')}
                        />
                        <label className='form-check-label w-150px' htmlFor='threatMitigation'>
                          Threat and Mitigation
                        </label>
                      </div>
                      <div className='form-check-inline form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='blockedDevices'
                          name='devicePopUpNotifications'
                          checked={policy?.agentUi?.devicePopUpNotifications}
                          onChange={() => handleAgentUiChange('devicePopUpNotifications')}
                        />
                        <label className='form-check-label w-150px' htmlFor='blockedDevices'>
                          Blocked Devices
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className='inline-block w-250px'>show Suspicious event in the UI:</p>
                      <div className='form-check form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='includeSuspicious'
                          name='showSuspicious'
                          checked={policy?.agentUi?.showSuspicious}
                          onChange={() => handleAgentUiChange('showSuspicious')}
                        />
                        <label className='form-check-label' htmlFor='includeSuspicious'>
                          Include Suspicious
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className='inline-block w-250px'>show warning in case of Agent errors:</p>
                      <div className='form-check form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='includeWarning'
                          name='showAgentWarnings'
                          checked={policy?.agentUi?.showAgentWarnings}
                          onChange={() => handleAgentUiChange('showAgentWarnings')}
                        />
                        <label className='form-check-label' htmlFor='includeWarning'>
                          Include warning
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className='inline-block w-250px'>show in the UI events from the last:</p>
                      <div className='form-check inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='text'
                          id='showLast30Days'
                          name='maxEventAgeDays'
                          value={policy?.agentUi?.maxEventAgeDays}
                          onChange={() => handleAgentUiChange('maxEventAgeDays')}
                        />
                        <label className='form-check-label' htmlFor='showLast30Days'>
                          days
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className='inline-block w-250px'>show these menu item in the UI:</p>
                      <div className='form-check form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='threatMitigationMenu'
                          name='showDeviceTab'
                          checked={policy?.agentUi?.showDeviceTab}
                          onChange={() => handleAgentUiChange('showDeviceTab')}
                        />
                        <label className='form-check-label' htmlFor='threatMitigationMenu'>
                          Blocked Devices
                        </label>
                      </div>
                      <div className='form-check form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='blockedDevicesMenu'
                          name='showQuarantineTab'
                          checked={policy?.agentUi?.showQuarantineTab}
                          onChange={() => handleAgentUiChange('showQuarantineTab')}
                        />
                        <label className='form-check-label' htmlFor='blockedDevicesMenu'>
                          Quarantined Files
                        </label>
                      </div>
                      <div className='form-check form-switch inline-block ms-10'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='contactSupportMenu'
                          name='showSupport'
                          checked={policy?.agentUi?.showSupport}
                          onChange={() => handleAgentUiChange('showSupport')}
                        />
                        <label className='form-check-label' htmlFor='contactSupportMenu'>
                          Contact Support
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-12'>
                <div className='card'>
                  <p className='pad-10'>
                    <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' /> Some
                    agent Ui settings are supported for the agent version 21.7+
                  </p>
                </div>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-12'>
                <div className='card deep-visibility'>
                  <div className='card-header bg-heading'>
                    <h6 className='white pad-10'>Deep Visibality</h6>
                  </div>
                  <div className='card-body pad-10'>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <h6>Deep Visibality configuration</h6>
                        <p>collect this deep Visibality data</p>
                      </div>
                      <div className='form-check form-switch'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='deepVisibility'
                          checked={deepVisibilityEnabled}
                          onChange={handleDeepVisibilityEnabled}
                        />
                        <label className='form-check-label' htmlFor='deepVisibility'>
                          Enable deep Visibility
                        </label>
                      </div>
                      <div
                        className={`float-right ${!deepVisibilityEnabled ? 'disabled-link' : ''}`}
                        onClick={() => {
                          if (deepVisibilityEnabled) {
                            handleEventTypeConfigurationClick()
                            handleShowModal() // Show the modal as well
                          }
                        }}
                      >
                        <span className='bi bi-gear link'></span>{' '}
                        <span className='link'>Event type configuration</span>
                      </div>

                      <EventTypeConfiguration
                        show={showModal}
                        policyData={policyData}
                        deepVisibilityEnabled={deepVisibilityEnabled}
                        isDefaultPolicy={isDefaultPolicy}
                        handleClose={handleCloseModal}
                        handleAction={handleAction}
                        onSuccess={handleResponseData}
                      />
                    </div>

                    <div className='d-flex flex-wrap'>
                      {[
                        {id: 'process', label: 'Process', key: 'process'},
                        {id: 'file', label: 'File', key: 'file'},
                        {id: 'url', label: 'URL', key: 'url'},
                        {id: 'dns', label: 'DNS', key: 'dns'},
                        {id: 'ip', label: 'IP', key: 'ip'},
                        {id: 'login', label: 'Login', key: 'login'},
                        {id: 'registryKeys', label: 'Registry Keys', key: 'registry'},
                        {id: 'scheduledTasks', label: 'Scheduled Tasks', key: 'scheduledTask'},
                        {
                          id: 'behavioralIndicators',
                          label: 'Behavioral Indicators',
                          key: 'behavioralIndicators',
                        },
                        {id: 'commandScripts', label: 'Command Scripts', key: 'commandScripts'},
                        {id: 'crossProcess', label: 'Cross Process', key: 'crossProcess'},
                        {id: 'driverLoad', label: 'Driver Load', key: 'driver'},
                        {id: 'dataMasking', label: 'Data Masking', key: 'dataMasking'},
                        {
                          id: 'fileMonitoring',
                          label: 'Focused File Monitoring',
                          key: 'smartFileMonitoring',
                        },
                      ]
                        .reduce((rows, item, index) => {
                          if (index % 2 === 0) rows.push([item])
                          else rows[rows.length - 1].push(item)
                          return rows
                        }, [])
                        .map((row, rowIndex) => (
                          <div className='d-flex w-100 mb-3' key={`row-${rowIndex}`}>
                            {row.map(({id, label, key}) => (
                              <div
                                className='d-flex align-items-center justify-content-between w-50'
                                style={{marginRight: 100}}
                                key={id}
                              >
                                <div className='form-check form-switch'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id={id}
                                    checked={policy?.dvAttributesPerEventType?.[key]?.isEnabled}
                                    disabled={!deepVisibilityEnabled}
                                    onChange={() => handleDvAttributeChange(key)}
                                  />
                                  <label className='form-check-label' htmlFor={id}>
                                    {label}
                                  </label>
                                </div>
                                <div className='ms-auto'>
                                  {policy?.dvAttributesPerEventType?.[key]?.count || ''}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>

                    <div>
                      <input
                        className=''
                        type='checkbox'
                        checked={policy?.iocAttributes?.autoInstallBrowserExtensions}
                        onChange={() =>
                          setPolicy((prevPolicy) => ({
                            ...prevPolicy,
                            iocAttributes: {
                              ...prevPolicy.iocAttributes,
                              autoInstallBrowserExtensions:
                                !prevPolicy.iocAttributes.autoInstallBrowserExtensions,
                            },
                          }))
                        }
                      />
                      <label>Automatically install Deep Visibility browser extensions</label>
                      <p>
                        <i className='fa fa-circle-exclamation incident-icon blue mg0right-5' />{' '}
                        Last Do not search if your organization uses Google Workspace(formerly G
                        Suite) to manage browser extensions
                      </p>
                      <p>
                        This overrides other browser extensions deployed Google Workspace. if your
                        organization uses Google Workspace to deploy browser extensions, This option
                        requires Windows Agent 4.7+{' '}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-12'>
                <div className='card'>
                  <div className='card-header bg-heading'>
                    <h6 className='white pad-10'>Binary Vault</h6>
                  </div>
                  <div className='card-body row pad-10'>
                    <div>
                      <span>
                        {' '}
                        <strong>Enable automatic File Upload</strong>
                      </span>
                      <span>
                        {' '}
                        <input
                          className=''
                          type='checkbox'
                          checked={policy?.autoFileUpload?.enabled}
                          onChange={handleAutoFileUploadChange}
                        />
                        <label>Enable automatic File Upload</label>
                      </span>
                    </div>
                    <div className='row'>
                      <div className='col-md-5'>
                        <p className='mt-1'>Exclude Path</p>
                        <p className='mt-2'>Exclude File Type</p>
                        <p className='mt-4'>Maximum file size Upload(Max 250MB)</p>
                        <p className='mt-2'>Total Upload per agent per day(Max 500MB)</p>
                        <p className='mt-5'>offline cache size(Max 2048MB)</p>
                      </div>
                      <div className='col-md-7'>
                        <p>
                          <input type='text' placeholder='New Path' />
                        </p>
                        <p>
                          <input type='text' placeholder='New File Type' />
                        </p>
                        <p>
                          <input
                            type='text'
                            value={policy?.autoFileUpload?.maxFileSize / (1024 * 1024) || ''} // Convert bytes to MB
                            placeholder='250 MB'
                            onChange={(e) =>
                              handleFileUploadFieldChange('maxFileSize', e.target.value)
                            }
                          />
                        </p>
                        <p>
                          <input
                            type='text'
                            value={policy?.autoFileUpload?.maxDailyFileUpload / (1024 * 1024) || ''} // Convert bytes to MB
                            placeholder='500 MB'
                            onChange={(e) =>
                              handleFileUploadFieldChange('maxDailyFileUpload', e.target.value)
                            }
                          />
                        </p>
                        <p>
                          <input
                            type='text'
                            value={policy?.autoFileUpload?.maxLocalDiskUsage / (1024 * 1024) || ''} // Convert bytes to MB
                            placeholder='2048 MB'
                            onChange={(e) =>
                              handleFileUploadFieldChange('maxLocalDiskUsage', e.target.value)
                            }
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-12'>
                <div className='card'>
                  <div className='card-header bg-heading'>
                    <h6 className='white pad-10'>More Options</h6>
                  </div>
                  <div className='card-body row pad-10'>
                    <div className='d-flex justify-content-start'>
                      <strong>Decommissioning</strong>
                      <div className='form-check form-switch'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='autoDecommission'
                          checked={policy?.autoDecommissionOn}
                          onChange={handleAutoDecommissionChange}
                        />
                        <label className='form-check-label' htmlFor='autoDecommission'>
                          Auto Decommission after {policy?.autoDecommissionDays} days offline
                        </label>
                      </div>
                    </div>
                    <div className='d-flex justify-content-start'>
                      <strong>Remote Shell</strong>
                      <div className='px-3'>
                        <input
                          className=''
                          type='checkbox'
                          checked={policy?.allowRemoteShell}
                          onChange={handleRemoteShellChange}
                        />
                        <label>Enable Remote Shell</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Policy
