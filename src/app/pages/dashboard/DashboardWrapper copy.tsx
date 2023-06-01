/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {ChartsWidget9} from '../../../_metronic/partials/widgets'
import {KTSVG} from '../../../_metronic/helpers'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
  StatisticsWidget5,
} from '../../../_metronic/partials/widgets'

const DashboardPage: FC = () => (
  <>
    {/* Header filter section */}
    <div className='header-filter row'>
      <div className='col-lg-3'>
        <div className='row'>
          <label className='form-label fw-normal col-lg-7 fs-12 lh-40 fc-gray'>
            <span>Show info for last:</span>
          </label>
          <div className='col-lg-5'>
            <select
              className='form-select form-select-solid bg-blue-light'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={'1'}
            >
              <option value='1'>Days</option>
              <option value='2'>30</option>
              <option value='3'>60</option>
              <option value='4'>90</option>
            </select>
          </div>
        </div>
      </div>
      <div className='col-lg-4'>
        <div className='row'>
          <label className='form-label fw-normal fs-12 col-lg-4 lh-40 fc-gray'>
            <span>Organization:</span>
          </label>
          <div className='col-lg-7'>
            <select
              className='form-select form-select-solid bg-blue-light'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              defaultValue={'1'}
            >
              <option value='1'>Organization1</option>
              <option value='2'>Organization2</option>
              <option value='3'>Organization3</option>
            </select>
          </div>
        </div>
      </div>
      <div className='col-lg-5 fs-11 lh-40 fc-gray text-right ds-reload'>
        Dashboard is automatically refreshing every 5 minutes{' '}
        <a href=''>
          <i className='fa fa-refresh' />
        </a>
      </div>
    </div>

    {/* begin::Row */}
    <div className='row py-lg-3'>
      <div className='col-lg-6'>
        <div className='row'>
          <div className='col-xl-3'>
            <div className='card bg-default py-5 text-center bg-secondary'>
              <h6 className='text-gray-800 text-hover-primary mb-1 fs-10 uppercase'>
                Unhandeled Incidents
              </h6>
              <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>1</span>
              <span className='span-red'>
                <i className='fa fa-arrow-down'></i> 67%
              </span>
            </div>
          </div>

          <div className='col-xl-3'>
            <div className='card bg-default py-5 text-center bg-light-warning'>
              <h6 className='text-gray-800 text-hover-primary mb-1 fs-10 uppercase'>
                Unhandeled Alerts
              </h6>
              <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>0</span>
              <span className='span-red'>
                <i className='fa fa-arrow-down'></i> 100%
              </span>
            </div>
          </div>

          <div className='col-xl-3'>
            <div className='card bg-default py-5 text-center bg-light-success'>
              <h6 className='text-gray-800 text-hover-primary mb-1 fs-10 uppercase'>
                False Positive Alerts
              </h6>
              <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>6</span>
              <span className='span-red'>
                <i className='v-hidden fa fa-arrow-down'></i>
              </span>
            </div>
          </div>

          <div className='col-xl-3'>
            <div className='card bg-default py-5 text-center bg-light-danger'>
              <h6 className='text-gray-800 text-hover-primary mb-1 fs-10 uppercase'>
                Mean Time to Resolve
              </h6>
              <span className='fc-gray fw-bold fs-40 mt-5 mb-5'>0</span>
              <span className='span-red'>
                <i className='fa fa-arrow-down'></i> 100%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-6'>
        <div className='card bg-default alert-chart'>
          <ChartsWidget9 className='card-xl-stretch mb-xl-8' />
        </div>
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row'>
      <div className='col-lg-6'>
        <div className='card bg-default'>
          <div className='card-body'>
            <div className='row'>
              <label className='form-label fw-normal fs-12 col-lg-5 lh-40 fc-gray'>
                <span>Incident by status and:</span>
              </label>
              <div className='col-lg-6'>
                <select
                  className='form-select form-select-solid bg-blue-light'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  defaultValue={'1'}
                >
                  <option value='1'>Priority</option>
                  <option value='2'>New</option>
                  <option value='3'>High</option>
                </select>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='bar-chart mt-8'>
                  <span className='text'>New</span>
                  <span className='bar'>1</span>
                  <span>1 Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-6'>
        <div className='card bg-default'>
          <div className='card-body'>
            <h6 className='uppercase text-center'>Most used tags</h6>
            <ul>
              <li className='mb-2 mt-3'>Credential Access</li>
              <li className='mb-2'>BruteForce</li>
              <li className='mb-1'>Authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row py-lg-3'>
      <div className='col-lg-6'>
        <div className='card bg-default'>
          <div className='card-body'>
            <h6 className='uppercase text-center'>Actions assigned to me</h6>
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-5 ds-table mt-2'>
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th>Sev</th>
                    <th>SLA</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <i className='fa fa-arrow-up' />
                    </td>
                    <td>
                      <span className='red'>-1d 3h 43m</span>
                    </td>
                    <td>0</td>
                    <td>
                      <i className='fa fa-circle-exclamation' />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i className='fa fa-arrow-down red' />
                    </td>
                    <td>
                      <span className='red'>-1d 3h 43m</span>
                    </td>
                    <td>0</td>
                    <td>
                      <i className='fa fa-circle-exclamation' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-6'>
        <div className='card bg-default'>
          <div className='card-body'>
            <h6 className='uppercase text-center'>My recent Incidents</h6>
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-5 ds-table mt-2'>
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th>Sev</th>
                    <th>SLA</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <i className='fa fa-arrow-up' />
                    </td>
                    <td>
                      <span className='red'>-1d 3h 43m</span>
                    </td>
                    <td>0</td>
                    <td>
                      <i className='fa fa-circle-exclamation' />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i className='fa fa-arrow-down red' />
                    </td>
                    <td>
                      <span className='red'>-1d 3h 43m</span>
                    </td>
                    <td>0</td>
                    <td>
                      <i className='fa fa-circle-exclamation' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* end::Row */}
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <div className='dashboard-wrapper'>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle> */}
      <DashboardPage />
    </div>
  )
}

export {DashboardWrapper}
