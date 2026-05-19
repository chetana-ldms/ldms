import React, {useState, useEffect, useCallback} from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import classnames from 'classnames'
import {notifyFail} from '../components/notification/Notification'

// ── Postman-style inner tab for API section ────────────────────────────────
const API_INNER_TABS = ['Params', 'Authorization', 'Headers', 'Body', 'Settings']

const RuleActionConfigurationModal = ({show, onClose, currentConfiguration, onSave}) => {
  const [activeTab, setActiveTab] = useState('api')
  const [apiInnerTab, setApiInnerTab] = useState('Params')

  // ── API Config State ───────────────────────────────────────────────────────
  const [apiConfig, setApiConfig] = useState({
    api: {method: 'GET', url: '', timeoutSeconds: 30, followRedirects: true, allowInsecureSSL: false},
    auth: {
      type: 'None',
      credentialRefId: '',
      apiKey: {keyName: '', keyValue: '', addTo: 'Header'},
      basic: {username: '', password: ''},
      bearer: {token: ''},
      oauth2: {tokenUrl: '', clientId: '', clientSecret: '', scope: ''},
    },
    request: {
      headers: [
        {name: 'Authorization', value: 'Bearer {{access_token}}', dynamic: true, sensitive: true, enabled: false},
        {name: 'Content-Type', value: 'application/json', dynamic: false, sensitive: false, enabled: false},
        {name: 'Accept', value: 'application/json', dynamic: false, sensitive: false, enabled: false},
        {name: 'X-Tenant-Id', value: '{{tenant_id}}', dynamic: true, sensitive: false, enabled: false},
      ],
      queryParams: [],   // array of {key, value, description, enabled}
      body: '',
      bodyType: 'raw',   // none | form-data | x-www-form-urlencoded | raw | binary
      contentType: 'application/json',
    },
    responseMapping: {successPath: '', dataPath: '', errorPath: '', fieldMappings: '{}'},
  })

  // ── SQL Config State ───────────────────────────────────────────────────────
  const [sqlConfig, setSqlConfig] = useState({
    connection: {connectionString: '', databaseType: 'MSSQL'},
    query: '',
    timeoutSeconds: 30,
  })

  // ── Script Config State ────────────────────────────────────────────────────
  const [scriptConfig, setScriptConfig] = useState({
    language: 'PowerShell',
    script: '',
    timeoutSeconds: 60,
  })

  const [rawJson, setRawJson] = useState('')

  // ── Parse incoming config ──────────────────────────────────────────────────
  const parseIncomingConfig = useCallback((jsonStr) => {
    try {
      if (!jsonStr) return
      const data = JSON.parse(jsonStr)
      if (data.api) {
        setActiveTab('api')
        let parsedHeaders = []
        if (data.request?.headers) {
          try {
            const h = JSON.parse(data.request.headers)
            parsedHeaders = Array.isArray(h)
              ? h
              : Object.entries(h).map(([name, value]) => ({
                  name,
                  value: String(value),
                  dynamic: String(value).includes('{{'),
                  sensitive: name.toLowerCase().includes('auth') || name.toLowerCase().includes('key'),
                  enabled: true,
                }))
          } catch {}
        }
        let parsedQP = []
        if (data.request?.queryParams) {
          try {
            const qp =
              typeof data.request.queryParams === 'string'
                ? JSON.parse(data.request.queryParams)
                : data.request.queryParams
            parsedQP = Array.isArray(qp)
              ? qp
              : Object.entries(qp).map(([key, value]) => ({key, value, description: '', enabled: true}))
          } catch {}
        }
        setApiConfig({
          api: {...apiConfig.api, ...data.api},
          auth: {...apiConfig.auth, ...data.auth},
          request: {
            ...data.request,
            headers: parsedHeaders,
            queryParams: parsedQP,
            body: data.request?.body || '',
            bodyType: data.request?.bodyType || 'raw',
            contentType: data.request?.contentType || 'application/json',
          },
          responseMapping: {
            ...data.responseMapping,
            fieldMappings: JSON.stringify(data.responseMapping?.fieldMappings || {}, null, 2),
          },
        })
      } else if (data.connection) {
        setActiveTab('sql')
        setSqlConfig(data)
      } else if (data.language) {
        setActiveTab('script')
        setScriptConfig(data)
      }
      setRawJson(JSON.stringify(data, null, 2))
    } catch {
      setRawJson(jsonStr)
    }
  }, [])

  useEffect(() => {
    if (show) parseIncomingConfig(currentConfiguration)
  }, [show, currentConfiguration, parseIncomingConfig])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const setApi = (patch) => setApiConfig((p) => ({...p, api: {...p.api, ...patch}}))
  const setAuth = (patch) => setApiConfig((p) => ({...p, auth: {...p.auth, ...patch}}))
  const setReq = (patch) => setApiConfig((p) => ({...p, request: {...p.request, ...patch}}))
  const setResp = (patch) => setApiConfig((p) => ({...p, responseMapping: {...p.responseMapping, ...patch}}))

  // ── Query Params ───────────────────────────────────────────────────────────
  const addQueryParam = () =>
    setReq({queryParams: [...apiConfig.request.queryParams, {key: '', value: '', description: '', enabled: true}]})

  const updateQueryParam = (idx, field, val) => {
    const updated = [...apiConfig.request.queryParams]
    updated[idx] = {...updated[idx], [field]: val}
    setReq({queryParams: updated})
  }

  const removeQueryParam = (idx) =>
    setReq({queryParams: apiConfig.request.queryParams.filter((_, i) => i !== idx)})

  // ── Headers ────────────────────────────────────────────────────────────────
  const addHeader = () =>
    setReq({headers: [...apiConfig.request.headers, {name: '', value: '', dynamic: false, sensitive: false, enabled: true}]})

  const updateHeader = (idx, field, val) => {
    const updated = [...apiConfig.request.headers]
    updated[idx] = {...updated[idx], [field]: val}
    setReq({headers: updated})
  }

  const removeHeader = (idx) =>
    setReq({headers: apiConfig.request.headers.filter((_, i) => i !== idx)})

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = () => {
    try {
      let finalData = {}
      if (activeTab === 'api') {
        finalData = {
          api: apiConfig.api,
          auth: {
            type: apiConfig.auth.type === 'None' ? undefined : apiConfig.auth.type,
            credentialRefId: String(apiConfig.auth.credentialRefId),
            ...(apiConfig.auth.type === 'ApiKey' && {apiKey: apiConfig.auth.apiKey}),
            ...(apiConfig.auth.type === 'Basic' && {basic: apiConfig.auth.basic}),
            ...(apiConfig.auth.type === 'Bearer' && {bearer: apiConfig.auth.bearer}),
            ...(apiConfig.auth.type === 'OAuth2' && {oauth2: apiConfig.auth.oauth2}),
          },
          request: {
            ...apiConfig.request,
            headers: JSON.stringify(apiConfig.request.headers),
            queryParams: apiConfig.request.queryParams.reduce((acc, p) => {
              if (p.key) acc[p.key] = p.value
              return acc
            }, {}),
          },
          responseMapping: {
            ...apiConfig.responseMapping,
            fieldMappings: JSON.parse(apiConfig.responseMapping.fieldMappings || '{}'),
          },
        }
      } else if (activeTab === 'sql') {
        finalData = sqlConfig
      } else if (activeTab === 'script') {
        finalData = scriptConfig
      }
      onSave(JSON.stringify(finalData, null, 2))
      onClose()
    } catch (error) {
      notifyFail('Invalid JSON format: ' + error.message)
    }
  }

  // ── Postman param/header row component ────────────────────────────────────
  const ParamRow = ({item, idx, onChange, onRemove, keyPlaceholder = 'Key'}) => (
    <tr>
      <td style={{width: 30, textAlign: 'center'}}>
        <Input
          type='checkbox'
          checked={item.enabled}
          onChange={(e) => onChange(idx, 'enabled', e.target.checked)}
          style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}}
        />
      </td>
      <td>
        <Input
          bsSize='sm'
          placeholder={keyPlaceholder}
          value={item.key ?? item.name ?? ''}
          onChange={(e) => onChange(idx, item.key !== undefined ? 'key' : 'name', e.target.value)}
          style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
        />
      </td>
      <td>
        <Input
          bsSize='sm'
          placeholder='Value'
          value={item.value}
          onChange={(e) => onChange(idx, 'value', e.target.value)}
          style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
        />
      </td>
      <td>
        <Input
          bsSize='sm'
          placeholder='Description'
          value={item.description || ''}
          onChange={(e) => onChange(idx, 'description', e.target.value)}
          style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
        />
      </td>
      <td style={{width: 36, textAlign: 'center'}}>
        <button
          type='button'
          onClick={() => onRemove(idx)}
          style={{background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer'}}
        >
          <i className='fa fa-times' />
        </button>
      </td>
    </tr>
  )

  // ── Empty ghost row (like postman) ─────────────────────────────────────────
  const GhostRow = ({placeholder = 'Key', onAdd}) => (
    <tr style={{opacity: 0.45}}>
      <td style={{width: 30}} />
      <td>
        <Input
          bsSize='sm'
          placeholder={placeholder}
          onFocus={onAdd}
          style={{border: 'none', background: 'transparent', boxShadow: 'none', cursor: 'text'}}
        />
      </td>
      <td>
        <Input
          bsSize='sm'
          placeholder='Value'
          style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
          readOnly
        />
      </td>
      <td>
        <Input
          bsSize='sm'
          placeholder='Description'
          style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
          readOnly
        />
      </td>
      <td style={{width: 36}} />
    </tr>
  )

  // ── Shared table style ─────────────────────────────────────────────────────
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: 13,
  }
  const thStyle = {
    background: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    padding: '6px 10px',
    fontWeight: 600,
    color: '#555',
  }
  const tdStyle = {
    borderBottom: '1px solid #f0f0f0',
    padding: '2px 4px',
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Modal isOpen={show} toggle={onClose} centered size='xl'>
      <ModalHeader toggle={onClose} style={{borderBottom: '1px solid #e5e5e5'}}>
        Rule Action Configuration
      </ModalHeader>

      <ModalBody style={{padding: 0, minHeight: 560}}>
        {/* ── Outer tabs: API / SQL / Script / Raw ── */}
        <div style={{borderBottom: '1px solid #e5e5e5', padding: '0 16px', background: '#fafafa'}}>
          <Nav tabs style={{border: 'none', marginBottom: 0}}>
            {['api', 'sql', 'script'].map((t) => (
              <NavItem key={t}>
                <NavLink
                  className={classnames({active: activeTab === t})}
                  onClick={() => setActiveTab(t)}
                  style={{cursor: 'pointer', textTransform: 'capitalize', padding: '10px 16px'}}
                >
                  {t === 'api' ? 'API Action' : t === 'sql' ? 'SQL Action' : 'Script Action'}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>

        <TabContent activeTab={activeTab}>
          {/* ════════════════════════════════════════════════════════════════
              API TAB — Postman Style
          ════════════════════════════════════════════════════════════════ */}
          <TabPane tabId='api' style={{padding: 0}}>

            {/* ── URL Bar ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                borderBottom: '1px solid #e5e5e5',
                background: '#fff',
              }}
            >
              {/* Method */}
              <Input
                type='select'
                bsSize='sm'
                value={apiConfig.api.method}
                onChange={(e) => setApi({method: e.target.value})}
                style={{
                  width: 110,
                  fontWeight: 700,
                  color:
                    apiConfig.api.method === 'GET'
                      ? '#16a34a'
                      : apiConfig.api.method === 'POST'
                      ? '#d97706'
                      : apiConfig.api.method === 'DELETE'
                      ? '#dc2626'
                      : '#2563eb',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  flexShrink: 0,
                }}
              >
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </Input>

              {/* URL */}
              <Input
                bsSize='sm'
                type='url'
                placeholder='https://api.example.com/endpoint'
                value={apiConfig.api.url}
                onChange={(e) => setApi({url: e.target.value})}
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {/* ── Inner Postman Tabs ── */}
            <div style={{background: '#fff'}}>
              <Nav
                tabs
                style={{
                  borderBottom: '1px solid #e5e5e5',
                  padding: '0 16px',
                  background: '#fafafa',
                  marginBottom: 0,
                }}
              >
                {API_INNER_TABS.map((t) => {
                  const count =
                    t === 'Headers'
                      ? apiConfig.request.headers.filter((h) => h.name || h.key).length
                      : t === 'Params'
                      ? apiConfig.request.queryParams.filter((p) => p.key).length
                      : null
                  return (
                    <NavItem key={t}>
                      <NavLink
                        className={classnames({active: apiInnerTab === t})}
                        onClick={() => setApiInnerTab(t)}
                        style={{cursor: 'pointer', padding: '8px 14px', fontSize: 13}}
                      >
                        {t}
                        {count > 0 && (
                          <span
                            style={{
                              marginLeft: 4,
                              background: '#e5e7eb',
                              borderRadius: 10,
                              padding: '1px 6px',
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#374151',
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </NavLink>
                    </NavItem>
                  )
                })}
              </Nav>

              <div style={{padding: '12px 16px'}}>
                {/* ── PARAMS TAB ── */}
                {apiInnerTab === 'Params' && (
                  <div>
                    <div style={{fontSize: 12, color: '#6b7280', marginBottom: 8}}>Query Params</div>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={{...thStyle, width: 30}} />
                          <th style={thStyle}>Key</th>
                          <th style={thStyle}>Value</th>
                          <th style={thStyle}>Description</th>
                          <th style={{...thStyle, width: 36}} />
                        </tr>
                      </thead>
                      <tbody>
                        {apiConfig.request.queryParams.map((p, i) => (
                          <tr key={i}>
                            <td style={{...tdStyle, textAlign: 'center', width: 30}}>
                              <Input
                                type='checkbox'
                                checked={p.enabled}
                                onChange={(e) => updateQueryParam(i, 'enabled', e.target.checked)}
                                style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}}
                              />
                            </td>
                            <td style={tdStyle}>
                              <Input
                                bsSize='sm'
                                placeholder='Key'
                                value={p.key}
                                onChange={(e) => updateQueryParam(i, 'key', e.target.value)}
                                style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
                              />
                            </td>
                            <td style={tdStyle}>
                              <Input
                                bsSize='sm'
                                placeholder='Value'
                                value={p.value}
                                onChange={(e) => updateQueryParam(i, 'value', e.target.value)}
                                style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
                              />
                            </td>
                            <td style={tdStyle}>
                              <Input
                                bsSize='sm'
                                placeholder='Description'
                                value={p.description}
                                onChange={(e) => updateQueryParam(i, 'description', e.target.value)}
                                style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
                              />
                            </td>
                            <td style={{...tdStyle, textAlign: 'center', width: 36}}>
                              <button
                                type='button'
                                onClick={() => removeQueryParam(i)}
                                style={{background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer'}}
                              >
                                <i className='fa fa-times' />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {/* Ghost row */}
                        <tr style={{opacity: 0.4}}>
                          <td style={{width: 30}} />
                          <td style={tdStyle}>
                            <Input
                              bsSize='sm'
                              placeholder='Key'
                              onFocus={addQueryParam}
                              style={{border: 'none', background: 'transparent', boxShadow: 'none', cursor: 'text'}}
                            />
                          </td>
                          <td style={tdStyle}>
                            <Input bsSize='sm' placeholder='Value' readOnly style={{border: 'none', background: 'transparent', boxShadow: 'none'}} />
                          </td>
                          <td style={tdStyle}>
                            <Input bsSize='sm' placeholder='Description' readOnly style={{border: 'none', background: 'transparent', boxShadow: 'none'}} />
                          </td>
                          <td style={{width: 36}} />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── AUTHORIZATION TAB ── */}
                {apiInnerTab === 'Authorization' && (
                  <div>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label style={{fontSize: 12, fontWeight: 600}}>Auth Type</Label>
                          <Input
                            type='select'
                            bsSize='sm'
                            value={apiConfig.auth.type}
                            onChange={(e) => setAuth({type: e.target.value})}
                          >
                            {['None', 'Bearer', 'ApiKey', 'Basic', 'OAuth2'].map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    {apiConfig.auth.type === 'None' && (
                      <p style={{color: '#6b7280', fontSize: 13}}>
                        This request does not use any authorization.
                      </p>
                    )}

                    {apiConfig.auth.type === 'Bearer' && (
                      <Row>
                        <Col md={8}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Token</Label>
                            <Input
                              bsSize='sm'
                              type='password'
                              placeholder='Bearer token...'
                              value={apiConfig.auth.bearer?.token || ''}
                              onChange={(e) => setAuth({bearer: {token: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Credential Ref ID</Label>
                            <Input
                              bsSize='sm'
                              type='text'
                              value={apiConfig.auth.credentialRefId}
                              onChange={(e) => setAuth({credentialRefId: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}

                    {apiConfig.auth.type === 'Basic' && (
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Username</Label>
                            <Input
                              bsSize='sm'
                              placeholder='Username'
                              value={apiConfig.auth.basic.username}
                              onChange={(e) => setAuth({basic: {...apiConfig.auth.basic, username: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Password</Label>
                            <Input
                              bsSize='sm'
                              type='password'
                              value={apiConfig.auth.basic.password}
                              onChange={(e) => setAuth({basic: {...apiConfig.auth.basic, password: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}

                    {apiConfig.auth.type === 'ApiKey' && (
                      <Row>
                        <Col md={3}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Key Name</Label>
                            <Input
                              bsSize='sm'
                              placeholder='x-api-key'
                              value={apiConfig.auth.apiKey.keyName}
                              onChange={(e) => setAuth({apiKey: {...apiConfig.auth.apiKey, keyName: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Key Value</Label>
                            <Input
                              bsSize='sm'
                              type='password'
                              value={apiConfig.auth.apiKey.keyValue}
                              onChange={(e) => setAuth({apiKey: {...apiConfig.auth.apiKey, keyValue: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Add To</Label>
                            <Input
                              type='select'
                              bsSize='sm'
                              value={apiConfig.auth.apiKey.addTo}
                              onChange={(e) => setAuth({apiKey: {...apiConfig.auth.apiKey, addTo: e.target.value}})}
                            >
                              <option>Header</option>
                              <option>QueryParam</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                    )}

                    {apiConfig.auth.type === 'OAuth2' && (
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Token URL</Label>
                            <Input
                              bsSize='sm'
                              placeholder='https://auth.example.com/token'
                              value={apiConfig.auth.oauth2.tokenUrl}
                              onChange={(e) => setAuth({oauth2: {...apiConfig.auth.oauth2, tokenUrl: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Client ID</Label>
                            <Input
                              bsSize='sm'
                              value={apiConfig.auth.oauth2.clientId}
                              onChange={(e) => setAuth({oauth2: {...apiConfig.auth.oauth2, clientId: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Client Secret</Label>
                            <Input
                              bsSize='sm'
                              type='password'
                              value={apiConfig.auth.oauth2.clientSecret}
                              onChange={(e) =>
                                setAuth({oauth2: {...apiConfig.auth.oauth2, clientSecret: e.target.value}})
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Scope</Label>
                            <Input
                              bsSize='sm'
                              value={apiConfig.auth.oauth2.scope}
                              onChange={(e) => setAuth({oauth2: {...apiConfig.auth.oauth2, scope: e.target.value}})}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label style={{fontSize: 12, fontWeight: 600}}>Credential Ref ID</Label>
                            <Input
                              bsSize='sm'
                            type='text'
                              value={apiConfig.auth.credentialRefId}
                              onChange={(e) => setAuth({credentialRefId: e.target.value})}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                  </div>
                )}

                {/* ── HEADERS TAB ── */}
                {apiInnerTab === 'Headers' && (
                  <div>
                    <div style={{fontSize: 12, color: '#6b7280', marginBottom: 8}}>Headers</div>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={{...thStyle, width: 30}} />
                          <th style={thStyle}>Header Name</th>
                          <th style={thStyle}>Value</th>
                          <th style={{...thStyle, width: 80, textAlign: 'center'}}>Dynamic</th>
                          <th style={{...thStyle, width: 80, textAlign: 'center'}}>Sensitive</th>
                          <th style={{...thStyle, width: 36}} />
                        </tr>
                      </thead>
                      <tbody>
                        {apiConfig.request.headers.map((h, i) => (
                          <tr key={i}>
                            <td style={{...tdStyle, textAlign: 'center', width: 30}}>
                              <Input
                                type='checkbox'
                                checked={h.enabled !== false}
                                onChange={(e) => updateHeader(i, 'enabled', e.target.checked)}
                                style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}}
                              />
                            </td>
                            <td style={tdStyle}>
                              <Input
                                bsSize='sm'
                                placeholder='Key'
                                value={h.name || h.key || ''}
                                onChange={(e) => updateHeader(i, 'name', e.target.value)}
                                style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
                              />
                            </td>
                            <td style={tdStyle}>
                              <Input
                                bsSize='sm'
                                placeholder='Value'
                                value={h.value}
                                onChange={(e) => updateHeader(i, 'value', e.target.value)}
                                style={{border: 'none', background: 'transparent', boxShadow: 'none'}}
                              />
                            </td>
                            <td style={tdStyle}>
                              <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Input
                                  type='checkbox'
                                  checked={!!h.dynamic}
                                  onChange={(e) => updateHeader(i, 'dynamic', e.target.checked)}
                                  style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}}
                                />
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Input
                                  type='checkbox'
                                  checked={!!h.sensitive}
                                  onChange={(e) => updateHeader(i, 'sensitive', e.target.checked)}
                                  style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}}
                                />
                              </div>
                            </td>
                            <td style={{...tdStyle, textAlign: 'center', width: 36}}>
                              <button
                                type='button'
                                onClick={() => removeHeader(i)}
                                style={{background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer'}}
                              >
                                <i className='fa fa-times' />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {/* Ghost row */}
                        <tr style={{opacity: 0.4}}>
                          <td style={{width: 30}} />
                          <td style={tdStyle}>
                            <Input
                              bsSize='sm'
                              placeholder='Header Name'
                              onFocus={addHeader}
                              style={{border: 'none', background: 'transparent', boxShadow: 'none', cursor: 'text'}}
                            />
                          </td>
                          <td style={tdStyle}>
                            <Input bsSize='sm' placeholder='Value' readOnly style={{border: 'none', background: 'transparent', boxShadow: 'none'}} />
                          </td>
                          <td style={{textAlign: 'center'}}><Input type='checkbox' disabled style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}} /></td>
                          <td style={{textAlign: 'center'}}><Input type='checkbox' disabled style={{margin: 0, position: 'static', marginTop: 0, marginLeft: 0}} /></td>
                          <td style={{width: 36}} />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── BODY TAB ── */}
                {apiInnerTab === 'Body' && (
                  <div>
                    <div style={{display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center'}}>
                      <Label style={{fontSize: 12, fontWeight: 600, marginBottom: 0}}>Content Type</Label>
                      <Input
                        type='select'
                        bsSize='sm'
                        value={apiConfig.request.contentType}
                        onChange={(e) => setReq({contentType: e.target.value})}
                        style={{width: 160}}
                      >
                        {['application/json', 'text/plain', 'text/html', 'application/xml', 'application/javascript'].map(
                          (ct) => <option key={ct}>{ct}</option>
                        )}
                      </Input>
                    </div>
                    <Input
                      type='textarea'
                      rows={12}
                      value={apiConfig.request.body}
                      onChange={(e) => setReq({body: e.target.value})}
                      style={{fontFamily: 'monospace', fontSize: 13, background: '#1e1e1e', color: '#d4d4d4', border: 'none', borderRadius: 6}}
                      placeholder={apiConfig.request.contentType === 'application/json' ? '{\n  "key": "value"\n}' : ''}
                    />
                  </div>
                )}

                {/* ── SETTINGS TAB ── */}
                {apiInnerTab === 'Settings' && (
                  <div>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label style={{fontSize: 12, fontWeight: 600}}>Timeout (seconds)</Label>
                          <Input
                            bsSize='sm'
                            type='number'
                            value={apiConfig.api.timeoutSeconds}
                            onChange={(e) => setApi({timeoutSeconds: Number(e.target.value)})}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup check style={{marginTop: 28}}>
                          <Label check style={{fontSize: 13}}>
                            <Input
                              type='checkbox'
                              checked={apiConfig.api.followRedirects}
                              onChange={(e) => setApi({followRedirects: e.target.checked})}
                              style={{position: 'static', marginTop: 0, marginLeft: 0}}
                            />{' '}
                            Follow Redirects
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup check style={{marginTop: 28}}>
                          <Label check style={{fontSize: 13}}>
                            <Input
                              type='checkbox'
                              checked={apiConfig.api.allowInsecureSSL}
                              onChange={(e) => setApi({allowInsecureSSL: e.target.checked})}
                              style={{position: 'static', marginTop: 0, marginLeft: 0}}
                            />{' '}
                            Allow Insecure SSL
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <hr />
                    <h6 style={{fontSize: 13, fontWeight: 700}}>Response Mapping</h6>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label style={{fontSize: 12, fontWeight: 600}}>Success Path</Label>
                          <Input
                            bsSize='sm'
                            placeholder='$.status'
                            value={apiConfig.responseMapping.successPath}
                            onChange={(e) => setResp({successPath: e.target.value})}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label style={{fontSize: 12, fontWeight: 600}}>Data Path</Label>
                          <Input
                            bsSize='sm'
                            placeholder='$.data'
                            value={apiConfig.responseMapping.dataPath}
                            onChange={(e) => setResp({dataPath: e.target.value})}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label style={{fontSize: 12, fontWeight: 600}}>Error Path</Label>
                          <Input
                            bsSize='sm'
                            placeholder='$.error.message'
                            value={apiConfig.responseMapping.errorPath}
                            onChange={(e) => setResp({errorPath: e.target.value})}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup>
                          <Label style={{fontSize: 12, fontWeight: 600}}>Field Mappings (JSON)</Label>
                          <Input
                            type='textarea'
                            rows={3}
                            style={{fontFamily: 'monospace', fontSize: 12}}
                            value={apiConfig.responseMapping.fieldMappings}
                            onChange={(e) => setResp({fieldMappings: e.target.value})}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>
          </TabPane>

          {/* ════════════════════════════════════════════════════════════════
              SQL TAB
          ════════════════════════════════════════════════════════════════ */}
          <TabPane tabId='sql' style={{padding: 16}}>
            <Row>
              <Col md={8}>
                <FormGroup>
                  <Label size='sm'>Connection String</Label>
                  <Input
                    type='text'
                    bsSize='sm'
                    placeholder='Server=...;Database=...;'
                    value={sqlConfig.connection.connectionString}
                    onChange={(e) =>
                      setSqlConfig({...sqlConfig, connection: {...sqlConfig.connection, connectionString: e.target.value}})
                    }
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label size='sm'>Database Type</Label>
                  <Input
                    type='select'
                    bsSize='sm'
                    value={sqlConfig.connection.databaseType}
                    onChange={(e) =>
                      setSqlConfig({...sqlConfig, connection: {...sqlConfig.connection, databaseType: e.target.value}})
                    }
                  >
                    {['MSSQL', 'MySQL', 'PostgreSQL', 'Oracle'].map((d) => <option key={d}>{d}</option>)}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label size='sm'>SQL Query</Label>
                  <Input
                    type='textarea'
                    rows={8}
                    style={{fontFamily: 'monospace'}}
                    placeholder='SELECT * FROM ...'
                    value={sqlConfig.query}
                    onChange={(e) => setSqlConfig({...sqlConfig, query: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label size='sm'>Timeout (Seconds)</Label>
                  <Input
                    type='number'
                    bsSize='sm'
                    value={sqlConfig.timeoutSeconds}
                    onChange={(e) => setSqlConfig({...sqlConfig, timeoutSeconds: Number(e.target.value)})}
                  />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>

          {/* ════════════════════════════════════════════════════════════════
              SCRIPT TAB
          ════════════════════════════════════════════════════════════════ */}
          <TabPane tabId='script' style={{padding: 16}}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label size='sm'>Language</Label>
                  <Input
                    type='select'
                    bsSize='sm'
                    value={scriptConfig.language}
                    onChange={(e) => setScriptConfig({...scriptConfig, language: e.target.value})}
                  >
                    {['PowerShell', 'Python', 'Bash'].map((l) => <option key={l}>{l}</option>)}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label size='sm'>Timeout (Seconds)</Label>
                  <Input
                    type='number'
                    bsSize='sm'
                    value={scriptConfig.timeoutSeconds}
                    onChange={(e) => setScriptConfig({...scriptConfig, timeoutSeconds: Number(e.target.value)})}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label size='sm'>Script Content</Label>
                  <Input
                    type='textarea'
                    rows={10}
                    style={{fontFamily: 'monospace'}}
                    value={scriptConfig.script}
                    onChange={(e) => setScriptConfig({...scriptConfig, script: e.target.value})}
                  />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </ModalBody>

      <ModalFooter style={{borderTop: '1px solid #e5e5e5'}}>
        <Button color='secondary' size='sm' onClick={onClose}>
          Cancel
        </Button>
        <Button color='primary' size='sm' onClick={handleSave}>
          Save Configuration
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default RuleActionConfigurationModal