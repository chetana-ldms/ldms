import React, {useCallback, useRef, useState} from 'react'

import {DiskFailurePlaybook} from './DiskFailurePlaybook'
import {MemorySpikePlaybook} from './MemorySpikePlaybook'
import {NetworkOutagePlaybook} from './NetworkOutagePlaybook'
import {LoginFailurePlaybook} from './LoginFailurePlaybook'
import {Form} from 'react-bootstrap'
import { PhishingPlaybook } from './PhishingPlaybook'

const DemoPlaybooks = () => {
  const [selectedOption, setSelectedOption] = useState('Login Failure')

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-3 px-3 pt-2'>
        <h2 className='mb-0'>PlayBook</h2>
        <Form.Group className='d-flex align-items-center' style={{gap: '10px'}}>
          <Form.Label className='mb-0'>Issue Type:</Form.Label>
          <Form.Select
            style={{width: '200px'}}
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value='Disk Failure'>Disk Failure</option>
            <option value='Memory Spike'>Memory Spike</option>
            <option value='Network Outage'>Network Outage</option>
            <option value='Login Failure'>Login Failure</option>
            <option value='Phishing'>Phishing</option>
          </Form.Select>
        </Form.Group>
      </div>

      {selectedOption === 'Disk Failure' && <DiskFailurePlaybook />}
      {selectedOption === 'Memory Spike' && <MemorySpikePlaybook />}
      {selectedOption === 'Network Outage' && <NetworkOutagePlaybook />}
      {selectedOption === 'Login Failure' && <LoginFailurePlaybook />}
      {selectedOption === 'Phishing' && <PhishingPlaybook />}
    </>
  )
}

export {DemoPlaybooks}
