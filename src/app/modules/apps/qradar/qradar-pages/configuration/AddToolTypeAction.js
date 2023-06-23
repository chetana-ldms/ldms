import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { notify, notifyFail } from '../components/notification/Notification';

const AddToolTypeAction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toolTypes, setToolTypes] = useState([]);
  const toolTypeID = useRef();
  const toolAction = useRef();
  const errors = {};

  useEffect(() => {
    setLoading(true);
    var data_4 = JSON.stringify({
      maserDataType: 'Tool_Types',
    });
    var config_4 = {
      method: 'post',
      url: 'http://182.71.241.246:502/api/LDPlattform/v1/MasterData',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data_4,
    };
    axios(config_4)
      .then(function (response) {
        setToolTypes(response.data.masterData);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {
    setLoading(true);
    if (!toolAction.current.value) {
      errors.toolAction = 'Select Tool Action';
      setLoading(false);
      return errors;
    }
    if (!toolTypeID.current.value) {
      errors.toolTypeID = 'Select Tool Type';
      setLoading(false);
      return errors;
    }

    event.preventDefault();
    const createdUserId = Number(sessionStorage.getItem('userId'));
    const createdDate = new Date().toISOString();
    var data = JSON.stringify({
      toolTypeID: toolTypeID.current.value,
      toolAction: toolAction.current.value,
      createdDate,
      createdUserId
    });
    var config = {
      method: 'post',
      url: 'http://182.71.241.246:502/api/LDPlattform/v1/ToolTypeAction/Add',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
      data: data,
    };

    // setTimeout(() => {
      axios(config)
        .then(function (response) {
          const { isSuccess } = response.data;

          if (isSuccess) {
            notify('Data Saved');
            navigate('/qradar/tool-type-actions/list');
          } else {
            notifyFail('Failed to save data');
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    // }, 1000);
  };

  return (
    <div className='card'>
      {loading && <UsersListLoading />}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Configure New Tool Type Action</span>
        </h3>
        <div className='card-toolbar'>
          <div className='d-flex align-items-center gap-2 gap-lg-3'>
            <Link to='/qradar/tool-type-actions/list' className='btn btn-primary btn-small'>
              Back
            </Link>
          </div>
        </div>
      </div>
      <form>
        <div className='card-body border-top p-9'>
          <div className='row mb-6'>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolAction' className='form-label fs-6 fw-bolder mb-3'>
                  Enter Tool Type Action
                </label>
                <input
                  type='text'
                  required
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Ex: CreateTicket'
                  ref={toolAction}
                />
              </div>
            </div>
            <div className='col-lg-6 mb-4 mb-lg-0'>
              <div className='fv-row mb-0'>
                <label htmlFor='toolTypeID' className='form-label fs-6 fw-bolder mb-3'>
                  Select Tool Type
                </label>
                <select
                  className='form-select form-select-solid'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  id='toolTypeID'
                  ref={toolTypeID}
                  required
                >
                  <option value=''>Select Tool Type</option>
                  {toolTypes.map((item, index) => (
                    <option value={item.dataID} key={index}>
                      {item.dataValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='card-footer d-flex justify-content-end py-6 px-9'>
          <button
            type='submit'
            onClick={handleSubmit}
            className='btn btn-primary'
            disabled={loading}
          >
            {!loading && 'Save Changes'}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export { AddToolTypeAction };
