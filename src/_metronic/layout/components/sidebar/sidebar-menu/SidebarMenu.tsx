import { SidebarMenuMainCompiance } from '../../../../../compliance/SidebarCompliance'
import {SidebarMenuMain} from './SidebarMenuMain'

const SidebarMenu = () => {
  
  const compliance = sessionStorage.getItem('compliance');
  return (
    <div className='app-sidebar-menu scroll-y'>
      <div
        id='kt_app_sidebar_menu_wrapper'
        className='app-sidebar-wrapper hover-scroll-overlay-y my-5'
        data-kt-scroll='true'
        data-kt-scroll-activate='true'
        data-kt-scroll-height='auto'
        data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
        data-kt-scroll-wrappers='#kt_app_sidebar_menu'
        data-kt-scroll-offset='5px'
        data-kt-scroll-save-state='true'
      >
        <div
          className='menu menu-column menu-rounded menu-sub-indention px-3'
          id='#kt_app_sidebar_menu'
          data-kt-menu='true'
          data-kt-menu-expand='false'
        >
          {/* <SidebarMenuMain />
          <SidebarMenuMainCompiance /> */}
          {/* {
              !compliance && <SidebarMenuMain />
             }
             {
              compliance && <SidebarMenuMainCompiance /> 
             } */}
               {compliance === 'true' ? <SidebarMenuMainCompiance /> : <SidebarMenuMain />}
        </div>
      </div>
    </div>
  )
}

export {SidebarMenu}
