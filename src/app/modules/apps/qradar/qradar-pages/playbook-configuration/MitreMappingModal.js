import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {
  fetchResolverMitreMappingsUrl,
  fetchResolverMitreSetMappingUrl,
} from '../../../../../api/PlayBookConfigurationApi'
import {fetchTacticsUrl, fetchTechniquesByTacticUrl} from '../../../../../api/MitreApi'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {notify, notifyFail} from '../components/notification/Notification'

const MitreMappingModal = ({show, onClose, item}) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mitreMappings, setMitreMappings] = useState([])
  const [tactics, setTactics] = useState([])
  const [techniques, setTechniques] = useState([])
  const [selectedTactic, setSelectedTactic] = useState('')
  const [selectedTechnique, setSelectedTechnique] = useState('')

  const resolverId = item?.resolverId
  const resolverName = item?.resolverName
  const userId = Number(sessionStorage.getItem('userId'))

  useEffect(() => {
    const fetchMappings = async () => {
      if (show && resolverId && resolverId !== 0) {
        try {
          setLoading(true)
          const response = await fetchResolverMitreMappingsUrl(resolverId)
          if (response && response.isSuccess && Array.isArray(response.mappings)) {
            setMitreMappings(response.mappings)
          } else {
            setMitreMappings([])
          }
        } catch (error) {
          console.error('Error fetching MITRE mappings:', error)
          setMitreMappings([])
        } finally {
          setLoading(false)
        }
      }
    }
    fetchMappings()
  }, [show, resolverId])

  useEffect(() => {
    const loadTactics = async () => {
      if (show) {
        const data = await fetchTacticsUrl()
        setTactics(data || [])
      }
    }
    loadTactics()
  }, [show])

  useEffect(() => {
    const loadTechniques = async () => {
      if (selectedTactic) {
        const response = await fetchTechniquesByTacticUrl(selectedTactic)
        setTechniques(response?.data || [])
      } else {
        setTechniques([])
      }
      setSelectedTechnique('')
    }
    loadTechniques()
  }, [selectedTactic])

  const handleAddMapping = () => {
    if (!selectedTactic || !selectedTechnique) {
      notifyFail('Please select both Tactic and Technique')
      return
    }

    const exists = mitreMappings.some(
      (m) =>
        Number(m.tacticId) === Number(selectedTactic) &&
        Number(m.techniqueId) === Number(selectedTechnique)
    )

    if (exists) {
      notifyFail('This mapping is already added to the list')
      return
    }

    const tacticObj = tactics.find((t) => Number(t.tacticId) === Number(selectedTactic))
    const techniqueObj = techniques.find((te) => Number(te.techniqueId) === Number(selectedTechnique))

    const newEntry = {
      tacticId: Number(selectedTactic),
      tacticName: tacticObj?.tacticName || '',
      techniqueId: Number(selectedTechnique),
      techniqueName: techniqueObj?.techniqueName || '',
    }

    setMitreMappings([...mitreMappings, newEntry])
    setSelectedTactic('')
    setSelectedTechnique('')
  }

  const handleRemoveMapping = (index) => {
    const updated = [...mitreMappings]
    updated.splice(index, 1)
    setMitreMappings(updated)
  }

  const handleSaveMappings = async () => {
    // This logic ensures that if you started with 10, removed 3 (leaving 7),
    // and added 1 (totaling 8), the payload will contain exactly those 8 items.
    const payload = {
      resolverId: resolverId,
      mappings: mitreMappings.map((m) => ({
        // Ensure we send numeric IDs as required by the backend payload structure
        tacticId: m.tacticId ? Number(m.tacticId) : (m.tacticCode ? m.tacticCode : 0),
        techniqueId: m.techniqueId ? Number(m.techniqueId) : (m.techniqueCode ? m.techniqueCode : 0),
      })),
      userId: userId,
    }

    try {
      setSaving(true)
      const response = await fetchResolverMitreSetMappingUrl(payload)
      if (response?.isSuccess) {
        notify(response.message || 'Mappings saved successfully')
        onClose()
      } else {
        notifyFail(response?.message || 'Failed to save mappings')
      }
    } catch (error) {
      console.error('Error setting MITRE mapping:', error)
      notifyFail('An error occurred while saving the mappings')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setMitreMappings([])
    setTactics([])
    setTechniques([])
    setSelectedTactic('')
    setSelectedTechnique('')
    onClose()
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size='lg'
      backdrop='static'
      keyboard={false}
      className='application-modal'
    >
      <Modal.Header>
        <Modal.Title>MITRE Mapping - {resolverName || '...'}</Modal.Title>
        <button
          type='button'
          className='application-modal-close'
          aria-label='Close'
          onClick={handleClose}
        >
          <i className='fa fa-close' />
        </button>
      </Modal.Header>
      <Modal.Body style={{minHeight: '150px', position: 'relative'}}>
        <div className='row mb-5 align-items-end'>
          <div className='col-md-5'>
            <label className='form-label fw-bold small'>Tactic</label>
            <select
              className='form-select form-select-sm'
              value={selectedTactic}
              onChange={(e) => setSelectedTactic(e.target.value)}
            >
              <option value=''>Select Tactic</option>
              {tactics.map((t) => (
                <option key={t.tacticId} value={t.tacticId}>
                  {t.tacticName}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-5'>
            <label className='form-label fw-bold small'>Technique</label>
            <select
              className='form-select form-select-sm'
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
              disabled={!selectedTactic}
            >
              <option value=''>Select Technique</option>
              {techniques.map((te) => (
                <option key={te.techniqueId} value={te.techniqueId}>
                  {te.techniqueName}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-2'>
            <button
              type='button'
              className='btn btn-primary btn-sm w-100'
              onClick={handleAddMapping}
              disabled={!selectedTactic || !selectedTechnique}
            >
              <i className='fa fa-plus me-1'></i> Add
            </button>
          </div>
        </div>

        <div className='separator border-gray-200 mb-5'></div>

        {loading ? (
          <div className='d-flex justify-content-center align-items-center h-100'>
            <UsersListLoading />
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-row-dashed align-middle gs-0 gy-3'>
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='ps-4'>Tactic</th>
                  <th>Technique</th>
                  <th>Sub-Technique</th>
                  <th className='text-end pe-4'>Action</th>
                </tr>
              </thead>
              <tbody>
                {mitreMappings.length > 0 ? (
                  mitreMappings.map((mapping, idx) => (
                    <tr key={idx}>
                      <td className='ps-4'>{mapping.tacticName}</td>
                      <td>{mapping.techniqueName}</td>
                      <td>{mapping.subTechniqueName || '--'}</td>
                      <td className='text-end pe-4'>
                        <i
                          className='fa fa-times-circle text-danger cursor fs-3'
                          title='Clear Mapping'
                          onClick={() => handleRemoveMapping(idx)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className='border-0'>
                    <td colSpan='3' className='text-center py-10 text-muted'>
                      No MITRE mappings found for this resolver.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='primary'
          size='sm'
          onClick={handleSaveMappings}
          disabled={saving || loading}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant='secondary' size='sm' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MitreMappingModal