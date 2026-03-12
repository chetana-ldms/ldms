/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarMenuItem } from './SidebarMenuItem';
import { fetchFeaturesAuthorizedUrl } from '../../../../../app/api/Api';
import { toAbsoluteUrl } from '../../../../helpers';

const SidebarMenuMain = () => {
  const intl = useIntl();
  const orgId = Number(sessionStorage.getItem('orgId'));
  const toolId = Number(sessionStorage.getItem('toolID'));
  const login_toolID = Number(sessionStorage.getItem('login_toolID'));
  const roleId = Number(sessionStorage.getItem('roleID'));
  const isQA = process.env.REACT_APP_ENV === 'demo';
  const [features, setFeatures] = useState([]);
  const [mainFeatures, setMainFeatures] = useState([]);
  console.log(mainFeatures, "mainFeatures")
  const [subFeatureId, setSubFeatureId] = useState([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null); 
  console.log(selectedFeatureId, "selectedFeatureId")

  const reload = async () => {
    try {
      const data = {
        orgId: orgId,
        toolId: toolId,
        roleId: roleId,
        parentFeatureId: 0,
      };
      const response = await fetchFeaturesAuthorizedUrl(data);
      setFeatures(response.features);

      const subFeatureIds = response.features
        .filter(feature => feature.subfeatureExists === 1)
        .map(feature => feature.featureId);

      setSubFeatureId(subFeatureIds);

      const mainFeatures = response.features
        .filter(feature => feature.parentFeatureId === 0);

      setMainFeatures(mainFeatures);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reload();
  }, []);
  const handleItemClick = (feature) => { 
    sessionStorage.setItem('selectedFeatureId', feature.featureId);
    setSelectedFeatureId(feature.featureId);
    if(feature.toolId == 0){
      sessionStorage.setItem('toolID',login_toolID)
    }else{
      sessionStorage.setItem('toolID', feature.toolId.toString())
    }
  };
  const renderMenuItems = (features) => {
    return mainFeatures.map((feature) => {
      if (feature.featureUrl.startsWith("http")) {
        return (
          <div key={feature.featureId} className="d-flex align-items-center honeypot mt-1">
            <a
              href={feature.featureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="white"
            >
              <img
                alt={feature.featureDisplayName}
                src={toAbsoluteUrl(feature.featureImageUrl)}
                className="h-25px me-2 w-30px"
              />
              {feature.featureDisplayName}
            </a>
          </div>
        );
      } else if (feature.subfeatureExists === 1) {
        const subFeatures = features.filter(sub => sub.parentFeatureId === feature.featureId);
        return (
          <SidebarMenuItemWithSub
            key={feature.featureId}
            to="#"
            icon={feature.featureImageUrl}
            title={feature.featureDisplayName}
            onClick={() => handleItemClick(feature)}
          >
            {subFeatures.map(subFeature => (
              <SidebarMenuItem
                key={subFeature.featureId}
                hasBullet={true}
                to={subFeature.featureUrl}
                title={subFeature.featureDisplayName}
                onClick={() => handleItemClick(subFeature)}
              />
            ))}
          </SidebarMenuItemWithSub>
        );
      }
      return (
        <SidebarMenuItem
          key={feature.featureId}
          to={feature.featureUrl}
          icon={feature.featureImageUrl}
          title={feature.featureDisplayName}
          onClick={() => handleItemClick(feature)}
        />
      );
    });
  };
  
  
  return (
    <>
      {renderMenuItems(features)}
      {/* <SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/communication/com008.svg' title='Applications'>
  <SidebarMenuItem hasBullet={true} to='/qradar/application/risk' title='Risk' />
  <SidebarMenuItem hasBullet={true} to='/qradar/application/inventory' title='Inventory' />
  <SidebarMenuItem hasBullet={true} to='/qradar/application/policy' title='Policy' />
</SidebarMenuItemWithSub>
<SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/communication/com009.svg' title='Sentinels'>
  <SidebarMenuItem hasBullet={true} to='/qradar/setinels/endpoits' title='Endpoints' />
  <SidebarMenuItem hasBullet={true} to='/qradar/setinels/blockList' title='Blocklist' />
  <SidebarMenuItem hasBullet={true} to='/qradar/setinels/exclusions' title='Exclusions' />
  <SidebarMenuItem hasBullet={true} to='/qradar/setinels/policy' title='Policy' />
  <SidebarMenuItem hasBullet={true} to='/qradar/setinels/accountDetalis' title='Account Detalis' />
</SidebarMenuItemWithSub> */}
      	    {/* <SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/general/gen003.svg' title='Security'>
  <SidebarMenuItem hasBullet={true} to='/qradar/features/list' title='Features' />
  <SidebarMenuItem hasBullet={true} to='/qradar/featureaction/list' title='FeatureAction' />
  <SidebarMenuItem hasBullet={true} to='/qradar/rolebasedaccess/list' title='RoleBasedAccess' />
</SidebarMenuItemWithSub> */}
 {/* <SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/coding/cod001.svg' title='Settings'>
  <SidebarMenuItem hasBullet={true} to='/qradar/accounts/list' title='Accounts' />
  <SidebarMenuItem hasBullet={true} to='/qradar/sites/list' title='Sites' />
</SidebarMenuItemWithSub> */}
{/* <SidebarMenuItem
        to='/qradar/SentinelsReport'
        title='Sentinels Report'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/abstract/abs013.svg'
      ></SidebarMenuItem> */}
  
      {/* <div className="d-flex align-items-center honeypot mt-1">
      <a
        href="https://trial-7466868.okta.com/app/trial-7466868_sentinelone_1/exkpr18hyrpWmBuIi697/sso/saml"
        target="_blank"
        rel="noopener noreferrer"
        className="white"
      >
        <img
            alt='Logo'
            src={toAbsoluteUrl('/media/SentinelOne.png')}
            className='h-25px me-2 w-30px'
          />
        SentinelOne
      </a>
    </div> */}
   
    {/* <div className="d-flex align-items-center honeypot mt-1">
      <a
        href="https://login.microsoftonline.com/e525ecf1-01af-442d-8f79-3574ddee69f7/saml2?SAMLRequest=jZJPj9owEMXvfAqUe3Bs7GSxAIku%2FYNEF7TQHnpBJhnvWkrs1OOw7bevE9puV2pX9XE87zdvnmaOqqlbuerCo72Hrx1gGI3H35raohy%2BFknnrXQKDUqrGkAZSnlYfdxKNslk611wpauTF6LXNQoRfDDO9qLNepHs7t5ud%2B83d6eKiaLgZ32jCsbLs9KZUHoKNBdFTjNeFAxEXmW6F34Gj5GxSCJyACF2sLEYlA2xmDGRZtOUzo6US55Lzr%2F0Xeu4n7EqDMrHEFqUhNTuwdhJY0rv0OngbG0sTErXEBBMQKlpmlGlU85Zld7oYpZORcGrCiCf6YL0G7Mevv8ZxhtjK2MfXk%2FhfG1C%2BeF43Kf73eHYI1a%2Fsrl1FrsG%2FAH8xZTw6X777Fe1CDRlWUYnCDbuA7WLhi0E8gTn%2BG3IJY4gXWThdTuC6NLBKKF5LljBBI%2BJTnORiSlPlnH0eDzvG%2BQQpF%2F%2Bx7DIPOHV3ykewsVU4P%2BGn5M%2Fwc%2BjWnkXY9ms96425feh3r93zjcq%2FDs9OqFDxVSpHlplZ7GF0mgDVfIbs6pr93TrQQVYJMF3kIzJcjS6mnl58csf
&RelayState=https%3a%2f%2fapse1-2001.sentinelone.net%2fdashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="white"
      >
        <img
            alt='Logo'
            src={toAbsoluteUrl('/media/SentinelOne.png')}
            className='h-25px me-2 w-30px'
          />
        SentinelOne Azure
      </a>
    </div> */}
      {/* <div className="d-flex align-items-center honeypot mt-1">
      <a
        href="https://trial-7466868.okta.com/app/trial-7466868_freshdesk_1/exkq1zlt80XDkZhxN697/sso/saml"
        target="_blank"
        rel="noopener noreferrer"
        className="white"
      >
        <img
            alt='Logo'
            src={toAbsoluteUrl('/media/FreshDesk.png')}
            className='h-25px me-2 w-30px'
          />
        Freshdesk
      </a>
    </div>
    <div className="d-flex align-items-center honeypot mt-1">
      <a
        href="https://trial-7466868.okta.com/app/huntress/exkq22lzcue3n4ohQ697/sso/saml "
        target="_blank"
        rel="noopener noreferrer"
        className="white"
      >
        <img
            alt='Logo'
            src={toAbsoluteUrl('/media/Huntress.png')}
            className='h-25px me-2 w-30px'
          />
        Huntress
      </a>
    </div> */}

    </>
  );
};

export { SidebarMenuMain };
