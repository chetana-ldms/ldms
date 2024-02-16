import React, { useState } from 'react'

function OutScope({outScopeData}) {
  const [selectedOutScopeItem, setSelectedOutScopeItem] = useState(null)
  const toggleOutScopeAccordion = (item) => {
    if (selectedOutScopeItem === item) {
      setSelectedOutScopeItem(null)
    } else {
      setSelectedOutScopeItem(item)
    }
  }
  return (
    <div className='tab-pane fade show active' id='outScope'>
      <table className='table'>
        <tbody>
          {outScopeData?.map((item, index) => (
            <React.Fragment key={item.id}>
              <tr>
                <td>
                  <div className='checkbox'>
                    <input type='checkbox' />
                    <i className='fa fa-check-square' />
                  </div>
                </td>
                <td
                  key={index}
                  onClick={() => toggleOutScopeAccordion(item)}
                  data-bs-toggle='collapse'
                  data-bs-target={'#kt_accordion_1_body_' + index}
                  aria-expanded={selectedOutScopeItem === item ? 'true' : 'false'}
                  aria-controls={'kt_accordion_1_body_' + index}
                  style={{cursor: 'pointer'}}
                >
                  {item.description}
                </td>
                <td>
                  <div className='float-right right-icons'>
                    {item.icons.map((icon, iconIndex) => (
                      <i key={iconIndex} className={`fa ${icon}`} />
                    ))}
                  </div>
                </td>
              </tr>
              <tr
                id={'kt_accordion_1_body_' + index}
                className={
                  selectedOutScopeItem === item
                    ? 'accordion-collapse collapse show'
                    : 'accordion-collapse collapse'
                }
                aria-labelledby={'kt_accordion_1_header_' + index}
                data-bs-parent='#kt_accordion_1'
              >
                <td colSpan='12'>{item.description}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OutScope
