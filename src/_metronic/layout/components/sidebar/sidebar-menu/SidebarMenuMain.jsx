/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarMenuItem } from './SidebarMenuItem';
import { fetchFeaturesAuthorizedUrl } from '../../../../../app/api/Api';

const SidebarMenuMain = () => {
  const intl = useIntl();
  const orgId = Number(sessionStorage.getItem('orgId'));
  const toolId = Number(sessionStorage.getItem('toolID'));
  const roleId = Number(sessionStorage.getItem('roleID'));
  const globalAdminRole = Number(sessionStorage.getItem("globalAdminRole"));
  const clientAdminRole = Number(sessionStorage.getItem("clientAdminRole"));
  const isQA = process.env.REACT_APP_ENV === 'demo';
  const [features, setFeatures] = useState([]);
  const [mainFeatures, setMainFeatures] = useState([]);
  const [subFeatureId, setSubFeatureId] = useState([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null); 
  console.log(selectedFeatureId, "selectedFeatureId")

  const handleFeature = () => {
    sessionStorage.setItem('Naveen', "true");
  };

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
  const handleItemClick = (featureId) => {
    setSelectedFeatureId(featureId);
    sessionStorage.setItem('selectedFeatureId', featureId); 
  };

  const renderMenuItems = (features) => {
    return mainFeatures.map((feature) => {
      if (feature.subfeatureExists === 1) {
        const subFeatures = features.filter(sub => sub.parentFeatureId === feature.featureId);
        return (
          <SidebarMenuItemWithSub
            key={feature.featureId}
            to='#'
            icon={feature.featureImageUrl}
            title={feature.featureDisplayName}
            onClick={() => handleItemClick(feature.featureId)} // Attach click handler
          >
            {subFeatures.map(subFeature => (
              <SidebarMenuItem
                key={subFeature.featureId}
                hasBullet={true}
                to={subFeature.featureUrl}
                title={subFeature.featureDisplayName}
                onClick={() => handleItemClick(subFeature.featureId)} // Attach click handler
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
          onClick={() => {
            handleFeature();
            handleItemClick(feature.featureId); 
          }}
        />
      );
    });
  };

  return (
    <>
      {renderMenuItems(features)}

      {/* {isQA && (
        <SidebarMenuItemWithSub to='#' icon='/media/icons/duotune/general/gen003.svg' title='Playbook'>
          <SidebarMenuItem hasBullet={true} to='/qradar/demo/v1' title='Alert Types' onClick={() => handleItemClick('playbook-alert-types')} />
          <SidebarMenuItem hasBullet={true} to='/qradar/demoalert/updated' title='Playbook Alert' onClick={() => handleItemClick('playbook-alert')} />
          <SidebarMenuItem hasBullet={true} to='/qradar/incidentsDemo' title='Incidents' onClick={() => handleItemClick('playbook-incidents')} />
          <SidebarMenuItem hasBullet={true} to='/qradar/demoplaybooks' title='Alert Playbooks' onClick={() => handleItemClick('playbook-alert-playbooks')} />
        </SidebarMenuItemWithSub>
      )} */}
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

    </>
  );
};

export { SidebarMenuMain };
