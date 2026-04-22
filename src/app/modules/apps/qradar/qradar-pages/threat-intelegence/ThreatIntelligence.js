import React, {useEffect, useState} from 'react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {notify} from '../components/notification/Notification'

function ThreatIntelligence() {
  const [selectedType, setSelectedType] = useState('IP Address')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scanValue, setScanValue] = useState('91.223.236.248')
  const [showResult, setShowResult] = useState(false) // NEW FLAG

  const fileMap = {
    'IP Address': '/ldms/media/reports/ip.json',
    Domain: '/ldms/media/reports/domain.json',
  }
  const pdfMap = {
    'IP Address': '/ldms/media/reports/ip-threat-report.pdf',
    Domain: '/ldms/media/reports/domain-threat-report.pdf',
  }
  const handleGenerateReport = () => {
    const pdfPath = pdfMap[selectedType]
    window.open(pdfPath, '_blank') // opens PDF in new tab
  }

  // Load JSON only when scan button is clicked
  const handleScan = async () => {
    if (!selectedType || !scanValue) return

    setLoading(true)
    setShowResult(false)

    try {
      const response = await fetch(fileMap[selectedType])
      const json = await response.json()

      json.indicator = scanValue // Replace indicator dynamically

      setData(json)
      setShowResult(true) // Show UI only now
    } catch (err) {
      console.error('Failed to load JSON:', err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const renderSection = (title, content) => (
    <div style={styles.card}>
      <h4 style={styles.cardTitle}>{title}</h4>
      {content}
    </div>
  )

  const formatKey = (key) => key.replace(/([A-Z])/g, ' $1').trim()

  const renderKeyValue = (obj) => (
    <table style={styles.table}>
      <tbody>
        {Object.entries(obj).map(([key, value]) => (
          <tr key={key}>
            <td style={styles.key}>{formatKey(key)}</td>
            <td style={styles.value}>
              {Array.isArray(value) ? value.join(', ') : value?.toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className='card pad-10 config' style={{padding: 20}}>
      <ToastContainer />
      <div className='card-header no-pad'>
        <h3 className='card-title fw-bold fs-3 mb-3'>Threat Intelligence Report</h3>
        {showResult && !loading && data && (
          <button className='btn btn-sm btn-primary mb-2' onClick={handleGenerateReport}>
            Generate Report
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='row mt-2'>
        <div className='col-lg-12 header-filter d-flex align-items-center gap-3'>
          {/* Type Dropdown */}
          <div className='d-flex align-items-center col-lg-2 gap-3'>
            <div className='d-flex align-items-center'>
              <label className='me-4 fw-bold fs-6 mt-3'>Enter</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={styles.dropdown}
              >
                <option value='IP Address'>IP Address</option>
                <option value='Domain'>Domain</option>
              </select>
            </div>
          </div>

          {/* Input */}
          <input
            type='text'
            placeholder='Enter IP or Domain...'
            className='form-control'
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
          />
          <select style={styles.dropdown} defaultValue='Recorded Future'>
            <option value='Recorded Future'>Recorded Future</option>
          </select>

          {/* Scan Button */}
          <button className='btn btn-primary' onClick={handleScan}>
            Scan
          </button>
        </div>
      </div>

      <hr />

      {/* Show NOTHING until user clicks Scan */}
      {!showResult && !loading && (
        <div className='text-muted fs-6 mt-3'>
          Please select type, enter input and click <b>Scan</b>.
        </div>
      )}

      {loading && <div>Loading…</div>}
      {!loading && showResult && !data && <div>No Data Found</div>}

      {/* Render JSON UI ONLY after Scan */}
      {!loading && showResult && data && (
        <>
          {renderSection(
            'Indicator Summary',
            renderKeyValue({
              Indicator: data.indicator,
              Type: data.type,
              RiskScore: data.riskScore,
              RiskLevel: data.riskLevel,
              Confidence: data.confidence,
            })
          )}

          {data.whois && renderSection('WHOIS Information', renderKeyValue(data.whois))}

          {data.dns && renderSection('DNS Details', renderKeyValue(data.dns))}

          {data.categories &&
            renderSection(
              'Threat Categories',
              <ul>
                {data.categories.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}

          {data.associatedEntities &&
            renderSection(
              'Associated Entities',
              <>
                {data.associatedEntities.subdomains && (
                  <>
                    <b>Subdomains:</b>
                    <ul>
                      {data.associatedEntities.subdomains.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}

          {data.malwareAssociations &&
            renderSection(
              'Malware Associations',
              <ul>
                {data.malwareAssociations.map((m, i) => (
                  <li key={i}>
                    <b>{m.family}:</b> {m.activity}
                  </li>
                ))}
              </ul>
            )}

          {renderSection(
            'Threat Timeline',
            renderKeyValue({
              FirstSeen: data.firstSeen,
              LastSeen: data.lastSeen,
            })
          )}

          {data.evidenceSummary && renderSection('Evidence Summary', <p>{data.evidenceSummary}</p>)}

          {data.recommendation &&
            renderSection(
              'Recommendation',
              <div className='d-flex justify-content-between align-items-center'>
                <p className='m-0 fs-6'>{data.recommendation}</p>

                {/* Block List Button */}
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => notify('Successfully added to block list')}
                >
                  Add To Block List
                </button>
              </div>
            )}
        </>
      )}
    </div>
  )
}

const styles = {
  dropdown: {
    padding: '6px',
    fontSize: '14px',
    borderRadius: '5px',
  },
  card: {
    background: '#fff',
    padding: '18px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: '18px',
  },
  cardTitle: {
    marginBottom: '10px',
    color: '#283593',
  },
  table: {width: '100%'},
  key: {
    width: '30%',
    fontWeight: 'bold',
    padding: '6px 0',
  },
  value: {
    padding: '6px 0',
  },
}

export default ThreatIntelligence
