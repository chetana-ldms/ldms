import React, {useEffect, useState} from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from 'reactstrap'
import {fetchPolicyDeepVisiblityConfigurtionRefreshUrl} from '../../../../../api/SentinalApi'
import {notify, notifyFail} from '../components/notification/Notification'

const EventTypeConfiguration = ({
  show,
  handleClose,
  handleAction,
  policyData,
  deepVisibilityEnabled,
  isDefaultPolicy,
  onSuccess,
}) => {
  const toolId = Number(sessionStorage.getItem('toolID'))
  const [activeAccordion, setActiveAccordion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isProcessCreationChecked, setIsProcessCreationChecked] = useState(false)
  const [fileOptions, setFileOptions] = useState({
    fileCreation: false,
    fileDeletion: false,
    fileModification: false,
    fileRename: false,
    fileScan: false,
  })
  const [isURLChecked, setIsURLChecked] = useState(false)
  const [isDNSChecked, setIsDNSChecked] = useState(false)
  const [ipOptions, setIPOptions] = useState({
    ipConnect: false,
    ipListen: false,
  })
  const [loginOptions, setLoginOptions] = useState({
    login: false,
    logout: false,
  })
  const [registryOptions, setRegistryOptions] = useState({
    keyCreate: false,
    keyDelete: false,
    keyExport: false,
    keyImport: false,
    keyRename: false,
    valueCreate: false,
    valueDelete: false,
    valueModified: false,
  })
  const [taskOptions, setTaskOptions] = useState({
    taskDelete: false,
    taskRegister: false,
    taskStart: false,
    taskTrigger: false,
    taskUpdate: false,
  })
  const [isBehavioralIndicatorsChecked, setIsBehavioralIndicatorsChecked] = useState(false)
  const [isCommandScriptsChecked, setIsCommandScriptsChecked] = useState(false)
  const [crossProcessOptions, setCrossProcessOptions] = useState({
    duplicateProcessHandle: false,
    duplicateThreadHandle: false,
    openRemoteProcessHandle: false,
    remoteThreadCreation: false,
  })
  const [isDriverLoadChecked, setIsDriverLoadChecked] = useState(false)

  const toggleAccordion = (id) => {
    setActiveAccordion((prevState) => (prevState === id ? null : id))
  }

  const handleGenericCheckboxChange = (stateSetter) => (e) => {
    const {name, checked} = e.target
    stateSetter((prevState) => ({
      ...prevState,
      [name]: checked,
    }))
  }
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
  useEffect(() => {
    if (policyData) {
      setPolicy(policyData?.data)
    }
  }, [policyData])
  console.log(policy, 'policyEvent')
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.process?.dvEventTypeProcessCreation) {
      setIsProcessCreationChecked(
        policy.dvAttributesPerEventType.process.dvEventTypeProcessCreation
      )
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.url?.dvEventTypeUrl) {
      setIsURLChecked(policy?.dvAttributesPerEventType?.url?.dvEventTypeUrl)
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.dns?.dvEventTypeDns) {
      setIsDNSChecked(policy?.dvAttributesPerEventType?.dns?.dvEventTypeDns)
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.behavioralIndicators?.dvEventTypeBehavioralIndicators) {
      setIsBehavioralIndicatorsChecked(
        policy?.dvAttributesPerEventType?.behavioralIndicators?.dvEventTypeBehavioralIndicators
      )
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.commandScripts?.dvEventTypeCommandScripts) {
      setIsCommandScriptsChecked(
        policy?.dvAttributesPerEventType?.commandScripts?.dvEventTypeCommandScripts
      )
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.driver?.dvEventTypeDriverLoad) {
      setIsDriverLoadChecked(policy?.dvAttributesPerEventType?.driver?.dvEventTypeDriverLoad)
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.file) {
      setFileOptions({
        fileCreation: policy?.dvAttributesPerEventType?.file?.dvEventTypeFileCreation || false,
        fileDeletion: policy?.dvAttributesPerEventType?.file?.dvEventTypeFileDeletion || false,
        fileModification:
          policy?.dvAttributesPerEventType?.file?.dvEventTypeFileModification || false,
        fileRename: policy?.dvAttributesPerEventType?.file?.dvEventTypeFileRename || false,
        fileScan: policy?.dvAttributesPerEventType?.file?.fullDiskScan || false,
      })
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.ip) {
      setIPOptions({
        ipConnect: policy.dvAttributesPerEventType.ip.dvEventTypeIpConnect || false,
        ipListen: policy.dvAttributesPerEventType.ip.dvEventTypeIpListen || false,
      })
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.login) {
      setLoginOptions({
        login: policy.dvAttributesPerEventType.login.dvEventTypeLoginLoggedIn || false,
        logout: policy.dvAttributesPerEventType.login.dvEventTypeLoginLoggedOut || false,
      })
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.registry) {
      setRegistryOptions({
        keyCreate: policy.dvAttributesPerEventType.registry.dvEventTypeRegistryKeyCreated || false,
        keyDelete: policy.dvAttributesPerEventType.registry.dvEventTypeRegistryKeyDelete || false,
        keyExport: policy.dvAttributesPerEventType.registry.dvEventTypeRegistryKeyExport || false,
        keyImport: policy.dvAttributesPerEventType.registry.dvEventTypeRegistryKeyImport || false,
        keyRename: policy.dvAttributesPerEventType.registry.dvEventTypeRegistryKeyRename || false,
        valueCreate:
          policy.dvAttributesPerEventType.registry.dvEventTypeRegistryValueCreated || false,
        valueDelete:
          policy.dvAttributesPerEventType.registry.dvEventTypeRegistryValueDeleted || false,
        valueModified:
          policy.dvAttributesPerEventType.registry.dvEventTypeRegistryValueModified || false,
      })
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.scheduledTask) {
      setTaskOptions({
        taskDelete:
          policy.dvAttributesPerEventType.scheduledTask.dvEventTypeScheduledTaskDelete || false,
        taskRegister:
          policy.dvAttributesPerEventType.scheduledTask.dvEventTypeScheduledTaskRegister || false,
        taskStart:
          policy.dvAttributesPerEventType.scheduledTask.dvEventTypeScheduledTaskStart || false,
        taskTrigger:
          policy.dvAttributesPerEventType.scheduledTask.dvEventTypeScheduledTaskTrigger || false,
        taskUpdate:
          policy.dvAttributesPerEventType.scheduledTask.dvEventTypeScheduledTaskUpdate || false,
      })
    }
  }, [policy])
  useEffect(() => {
    if (policy?.dvAttributesPerEventType?.crossProcess) {
      setCrossProcessOptions({
        duplicateProcessHandle:
          policy.dvAttributesPerEventType.crossProcess.dvEventTypeCrossProcessDuplicateProcess ||
          false,
        duplicateThreadHandle:
          policy.dvAttributesPerEventType.crossProcess.dvEventTypeCrossProcessDuplicateThread ||
          false,
        openRemoteProcessHandle:
          policy.dvAttributesPerEventType.crossProcess.dvEventTypeCrossProcessOpenProcess || false,
        remoteThreadCreation:
          policy.dvAttributesPerEventType.crossProcess.dvEventTypeCrossProcessRemoteThread || false,
      })
    }
  }, [policy])

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const data = {
        toolID: toolId,
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
            isEnabled:
              policy?.dvAttributesPerEventType?.autoInstallBrowserExtensions?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.autoInstallBrowserExtensions?.count || '',
            autoInstallBrowserExtensions:
              policy?.dvAttributesPerEventType?.autoInstallBrowserExtensions
                ?.autoInstallBrowserExtensions || false,
          },
          behavioralIndicators: {
            isEnabled: policy?.dvAttributesPerEventType?.behavioralIndicators?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.behavioralIndicators?.count || '',
            dvEventTypeBehavioralIndicators: isBehavioralIndicatorsChecked || false,
          },
          commandScripts: {
            isEnabled: policy?.dvAttributesPerEventType?.commandScripts?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.commandScripts?.count || '',
            dvEventTypeCommandScripts: isCommandScriptsChecked || false,
          },
          crossProcess: {
            isEnabled: policy?.dvAttributesPerEventType?.crossProcess?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.crossProcess?.count || '',
            dvEventTypeCrossProcessDuplicateProcess: crossProcessOptions?.duplicateProcessHandle,
            dvEventTypeCrossProcessDuplicateThread: crossProcessOptions?.duplicateThreadHandle,
            dvEventTypeCrossProcessOpenProcess: crossProcessOptions?.openRemoteProcessHandle,
            dvEventTypeCrossProcessRemoteThread: crossProcessOptions?.remoteThreadCreation,
          },
          dataMasking: {
            isEnabled: policy?.dvAttributesPerEventType?.dataMasking?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.dataMasking?.count || '',
            dataMasking: policy?.dvAttributesPerEventType?.dataMasking?.dataMasking || false,
          },
          dllModuleLoad: {
            isEnabled: policy?.dvAttributesPerEventType?.dllModuleLoad?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.dllModuleLoad?.count || '',
            dvEventTypeDllModuleLoad:
              policy?.dvAttributesPerEventType?.dllModuleLoad?.dvEventTypeDllModuleLoad || false,
          },
          dns: {
            isEnabled: policy?.dvAttributesPerEventType?.dns?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.dns?.count || '',
            dvEventTypeDns: isDNSChecked || false,
          },
          driver: {
            isEnabled: policy?.dvAttributesPerEventType?.driver?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.driver?.count || '',
            dvEventTypeDriverLoad: isDriverLoadChecked || false,
          },
          file: {
            isEnabled: policy?.dvAttributesPerEventType?.file?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.file?.count || '',
            dvEventTypeFileCreation: fileOptions?.fileCreation,
            dvEventTypeFileDeletion: fileOptions?.fileDeletion,
            dvEventTypeFileModification: fileOptions?.fileModification,
            dvEventTypeFileRename: fileOptions?.fileRename,
            fullDiskScan: fileOptions?.fileScan,
          },
          ip: {
            isEnabled: policy?.dvAttributesPerEventType?.ip?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.ip?.count || '',
            dvEventTypeIpConnect: ipOptions?.ipConnect || false,
            dvEventTypeIpListen: ipOptions?.ipListen || false,
          },
          login: {
            isEnabled: policy?.dvAttributesPerEventType?.login?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.login?.count || '',
            dvEventTypeLoginLoggedIn: loginOptions?.login || false,
            dvEventTypeLoginLoggedOut: loginOptions?.logout || false,
          },
          namedPipe: {
            isEnabled: policy?.dvAttributesPerEventType?.namedPipe?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.namedPipe?.count || '',
            dvEventTypeNamedPipeConnection:
              policy?.dvAttributesPerEventType?.namedPipe?.dvEventTypeNamedPipeConnection || false,
            dvEventTypeNamedPipeCreation:
              policy?.dvAttributesPerEventType?.namedPipe?.dvEventTypeNamedPipeCreation || false,
          },
          namedPipeExtended: {
            isEnabled: policy?.dvAttributesPerEventType?.namedPipeExtended?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.namedPipeExtended?.count || '',
            namedPipeExtended:
              policy?.dvAttributesPerEventType?.namedPipeExtended?.namedPipeExtended || false,
          },
          process: {
            isEnabled: policy?.dvAttributesPerEventType?.process?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.process?.count || '',
            dvEventTypeProcessCreation: isProcessCreationChecked || false,
            // dvEventTypeProcessExit: true,
            // dvEventTypeProcessModification: true,
          },
          registry: {
            isEnabled: policy?.dvAttributesPerEventType?.registry?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.registry?.count || '',
            dvEventTypeRegistryKeyCreated: registryOptions?.keyCreate,
            dvEventTypeRegistryKeyDelete: registryOptions?.keyDelete,
            dvEventTypeRegistryKeyExport: registryOptions?.keyExport,
            dvEventTypeRegistryKeyImport: registryOptions?.keyImport,
            dvEventTypeRegistryKeyRename: registryOptions?.keyRename,
            // dvEventTypeRegistryKeySecurityChanged: registryOptions?.,
            dvEventTypeRegistryValueCreated: registryOptions?.valueCreate,
            dvEventTypeRegistryValueDeleted: registryOptions?.valueDelete,
            dvEventTypeRegistryValueModified: registryOptions?.valueModified,
          },
          scheduledTask: {
            isEnabled: policy?.dvAttributesPerEventType?.scheduledTask?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.scheduledTask?.count || '',
            dvEventTypeScheduledTaskDelete: taskOptions?.taskDelete || false,
            dvEventTypeScheduledTaskRegister: taskOptions?.taskRegister || false,
            dvEventTypeScheduledTaskStart: taskOptions?.taskStart || false,
            dvEventTypeScheduledTaskTrigger: taskOptions?.taskTrigger || false,
            dvEventTypeScheduledTaskUpdate: taskOptions?.taskUpdate || false,
          },
          smartFileMonitoring: {
            isEnabled: policy?.dvAttributesPerEventType?.smartFileMonitoring?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.smartFileMonitoring?.count || '',
            smartFileMonitoring:
              policy?.dvAttributesPerEventType?.smartFileMonitoring?.smartFileMonitoring ||
              false ||
              false,
          },
          url: {
            isEnabled: policy?.dvAttributesPerEventType?.url?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.url?.count || '',
            dvEventTypeUrl: isURLChecked || false,
          },
          windowsEventLogs: {
            isEnabled: policy?.dvAttributesPerEventType?.windowsEventLogs?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.windowsEventLogs?.count || '',
            dvEventTypeWindowsEventLogCreation:
              policy?.dvAttributesPerEventType?.windowsEventLogs
                ?.dvEventTypeWindowsEventLogCreation || false,
          },
          windowsEventLogsExtended: {
            isEnabled:
              policy?.dvAttributesPerEventType?.windowsEventLogsExtended?.isEnabled || false,
            count: policy?.dvAttributesPerEventType?.windowsEventLogsExtended?.count || '',
            windowsEventLogsExtended:
              policy?.dvAttributesPerEventType?.windowsEventLogsExtended
                ?.windowsEventLogsExtended || false,
          },
          //   openDirectoryActivity: {
          //     isEnabled: true,
          //     count: 'string',
          //     dvEventTypeOpenDirectoryAddAttributeValue: true,
          //     dvEventTypeOpenDirectoryDeleteGroup: true,
          //     dvEventTypeOpenDirectoryDeleteUser: true,
          //     dvEventTypeOpenDirectoryDisableUser: true,
          //     dvEventTypeOpenDirectorySetAttributeValues: true,
          //     dvEventTypeOpenDirectoryRemoveMemberFromGroup: true,
          //     dvEventTypeOpenDirectoryEnableUser: true,
          //     dvEventTypeOpenDirectoryModifyPassword: true,
          //     dvEventTypeOpenDirectoryCreateGroup: true,
          //     dvEventTypeOpenDirectoryRemoveAttributeValue: true,
          //     dvEventTypeOpenDirectoryCreateUser: true,
          //     dvEventTypeOpenDirectorySetMembersOfGroup: true,
          //     dvEventTypeOpenDirectoryAddMemberToGroup: true,
          //   },
          //   profileActivity: {
          //     isEnabled: true,
          //     count: 'string',
          //     dvEventTypeProfileRemoval: true,
          //     dvEventTypeProfileAddition: true,
          //   },
          //   userSubstitution: {
          //     isEnabled: true,
          //     count: 'string',
          //     dvEventTypeSudo: true,
          //     dvEventTypeSu: true,
          //   },
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
      }
      const response = await fetchPolicyDeepVisiblityConfigurtionRefreshUrl(data)
      const {isSuccess, message, data: responseData} = response
      if (isSuccess) {
        notify(message)
        onSuccess(responseData)
        handleClose()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      backdrop='static'
      keyboard={false}
      isOpen={show}
      toggle={handleClose}
      className='application-modal'
    >
      <ModalHeader toggle={handleClose} closeButton>
        Event Type Configuration
        <button
          type='button'
          className='application-modal-close btn btn-link text-danger p-0'
          aria-label='Close'
          onClick={handleClose}
        >
          <i className='fa fa-close' />
        </button>
      </ModalHeader>
      <ModalBody>
        <Accordion open={activeAccordion} toggle={toggleAccordion}>
          {/* Process */}
          <AccordionItem>
            <AccordionHeader targetId='process'>Process</AccordionHeader>
            <AccordionBody accordionId='process'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='processCreationCheckbox'
                  checked={isProcessCreationChecked}
                  onChange={(e) => setIsProcessCreationChecked(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='processCreationCheckbox'>
                  Process Creation
                </label>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* File */}
          <AccordionItem>
            <AccordionHeader targetId='file'>File</AccordionHeader>
            <AccordionBody accordionId='file'>
              <div className='d-flex flex-wrap'>
                {[
                  {label: 'File Creation', name: 'fileCreation'},
                  {label: 'File Deletion', name: 'fileDeletion'},
                  {label: 'File Modification', name: 'fileModification'},
                  {label: 'File Rename', name: 'fileRename'},
                  {label: 'File Scan', name: 'fileScan'},
                ].map((option) => (
                  <div className='form-check me-3 mb-2' key={option.name}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={option.name}
                      name={option.name}
                      checked={fileOptions[option.name]}
                      onChange={handleGenericCheckboxChange(setFileOptions)}
                    />
                    <label className='form-check-label' htmlFor={option.name}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* URL */}
          <AccordionItem>
            <AccordionHeader targetId='url'>URL</AccordionHeader>
            <AccordionBody accordionId='url'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='urlCheckbox'
                  checked={isURLChecked}
                  onChange={(e) => setIsURLChecked(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='urlCheckbox'>
                  URL
                </label>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* DNS */}
          <AccordionItem>
            <AccordionHeader targetId='dns'>DNS</AccordionHeader>
            <AccordionBody accordionId='dns'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='dnsCheckbox'
                  checked={isDNSChecked}
                  onChange={(e) => setIsDNSChecked(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='dnsCheckbox'>
                  DNS
                </label>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* IP */}
          <AccordionItem>
            <AccordionHeader targetId='ip'>IP</AccordionHeader>
            <AccordionBody accordionId='ip'>
              <div className='d-flex flex-wrap'>
                {[
                  {label: 'IP Connect', name: 'ipConnect'},
                  {label: 'IP Listen', name: 'ipListen'},
                ].map((option) => (
                  <div className='form-check me-3 mb-2' key={option.name}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={option.name}
                      name={option.name}
                      checked={ipOptions[option.name]}
                      onChange={handleGenericCheckboxChange(setIPOptions)}
                    />
                    <label className='form-check-label' htmlFor={option.name}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Login */}
          <AccordionItem>
            <AccordionHeader targetId='login'>Login</AccordionHeader>
            <AccordionBody accordionId='login'>
              <div className='d-flex flex-wrap'>
                {[
                  {label: 'Login', name: 'login'},
                  {label: 'Logout', name: 'logout'},
                ].map((option) => (
                  <div className='form-check me-3 mb-2' key={option.name}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={option.name}
                      name={option.name}
                      checked={loginOptions[option.name]}
                      onChange={handleGenericCheckboxChange(setLoginOptions)}
                    />
                    <label className='form-check-label' htmlFor={option.name}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Registry Keys */}
          <AccordionItem>
            <AccordionHeader targetId='registry'>Registry Keys</AccordionHeader>
            <AccordionBody accordionId='registry'>
              <div className='d-flex flex-wrap'>
                {[
                  {label: 'Registry Key Create', name: 'keyCreate'},
                  {label: 'Registry Key Delete', name: 'keyDelete'},
                  {label: 'Registry Key Export', name: 'keyExport'},
                  {label: 'Registry Key Import', name: 'keyImport'},
                  {label: 'Registry Key Rename', name: 'keyRename'},
                  {label: 'Registry Value Create', name: 'valueCreate'},
                  {label: 'Registry Value Delete', name: 'valueDelete'},
                  {label: 'Registry Value Modified', name: 'valueModified'},
                ].map((option) => (
                  <div className='form-check me-3 mb-2' key={option.name}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={option.name}
                      name={option.name}
                      checked={registryOptions[option.name]}
                      onChange={handleGenericCheckboxChange(setRegistryOptions)}
                    />
                    <label className='form-check-label' htmlFor={option.name}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Scheduled Tasks */}
          <AccordionItem>
            <AccordionHeader targetId='tasks'>Scheduled Tasks</AccordionHeader>
            <AccordionBody accordionId='tasks'>
              <div className='d-flex flex-wrap'>
                {[
                  {label: 'Task Delete', name: 'taskDelete'},
                  {label: 'Task Register', name: 'taskRegister'},
                  {label: 'Task Start', name: 'taskStart'},
                  {label: 'Task Trigger', name: 'taskTrigger'},
                  {label: 'Task Update', name: 'taskUpdate'},
                ].map((option) => (
                  <div className='form-check me-3 mb-2' key={option.name}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={option.name}
                      name={option.name}
                      checked={taskOptions[option.name]}
                      onChange={handleGenericCheckboxChange(setTaskOptions)}
                    />
                    <label className='form-check-label' htmlFor={option.name}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Behavioral Indicators */}
          <AccordionItem>
            <AccordionHeader targetId='behavioral'>Behavioral Indicators</AccordionHeader>
            <AccordionBody accordionId='behavioral'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='behavioralIndicatorsCheckbox'
                  checked={isBehavioralIndicatorsChecked}
                  onChange={(e) => setIsBehavioralIndicatorsChecked(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='behavioralIndicatorsCheckbox'>
                  Behavioral Indicators
                </label>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Command Scripts */}
          <AccordionItem>
            <AccordionHeader targetId='commands'>Command Scripts</AccordionHeader>
            <AccordionBody accordionId='commands'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='commandScriptsCheckbox'
                  checked={isCommandScriptsChecked}
                  onChange={(e) => setIsCommandScriptsChecked(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='commandScriptsCheckbox'>
                  Command Scripts
                </label>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Cross Process */}
          <AccordionItem>
            <AccordionHeader targetId='crossProcess'>Cross Process</AccordionHeader>
            <AccordionBody accordionId='crossProcess'>
              <div className='d-flex flex-wrap'>
                {[
                  {label: 'Duplicate Process Handle', name: 'duplicateProcessHandle'},
                  {label: 'Duplicate Thread Handle', name: 'duplicateThreadHandle'},
                  {label: 'Open Remote Process Handle', name: 'openRemoteProcessHandle'},
                  {label: 'Remote Thread Creation', name: 'remoteThreadCreation'},
                ].map((option) => (
                  <div className='form-check me-3 mb-2' key={option.name}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={option.name}
                      name={option.name}
                      checked={crossProcessOptions[option.name]}
                      onChange={handleGenericCheckboxChange(setCrossProcessOptions)}
                    />
                    <label className='form-check-label' htmlFor={option.name}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Driver Load */}
          <AccordionItem>
            <AccordionHeader targetId='driverLoad'>Driver Load</AccordionHeader>
            <AccordionBody accordionId='driverLoad'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='driverLoadCheckbox'
                  checked={isDriverLoadChecked}
                  onChange={(e) => setIsDriverLoadChecked(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='driverLoadCheckbox'>
                  Driver Load
                </label>
              </div>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={handleSaveChanges}>
          Confirm
        </Button>
        <Button color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EventTypeConfiguration
