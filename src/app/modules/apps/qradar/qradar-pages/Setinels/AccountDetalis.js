import React, { useEffect, useState } from "react";
import { fetchAccountDetailsUrl } from "../../../../../api/SentinalApi";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { getCurrentTimeZone } from "../../../../../../utils/helper";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";

function AccountDetalis() {
  const [accountDetails, setAccountDetails] = useState([]);
  console.log(accountDetails, "accountDetails111");
  const [loading, setLoading] = useState(false);
  const orgId = Number(sessionStorage.getItem("orgId"));
  const fetchData = async () => {
    const data = {
      orgID: orgId,
    };
    try {
      setLoading(true);
      const response = await fetchAccountDetailsUrl(data);
      setAccountDetails(response[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="account-details">
      {loading && <UsersListLoading />}
      <div className="card">
        <div className="row card-body d-flex align-items-center">
          <div className="col-md-5">
            <div className="row mt2">
              <div className="col-md-1">
                <img
                  alt="Logo"
                  src={toAbsoluteUrl("/media/logos/default-small.png")}
                  className="h-20px"
                />
              </div>
              <div className="col-md-11">
                <p className="mb-0">{accountDetails.name}</p>
                <p className="gray">Account Id : {accountDetails.id}</p>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="row">
              <div className="col-md-3 text-center">
                <p className="gray mb-0">
                  <i className="fa fa-users mg-right-5" /> Total Agents
                </p>
                <p className="mb-0">{accountDetails?.agentsInCompleteSku}</p>
              </div>
              <div className="col-md-3 text-center">
                <p className="gray mb-0">
                  <i className="fa fa-user-circle mg-right-5" />
                  Creater
                </p>
                <p className="mb-0">{accountDetails?.creator}</p>
              </div>
              <div className="col-md-3 text-center">
                <p className="gray mb-0">
                  <i className="fa fa-calendar-check mg-right-5" /> Created At
                </p>
                <p className="mb-0">
                  {getCurrentTimeZone(accountDetails.createdAt)}
                </p>
              </div>
              <div className="col-md-3 text-center">
                <p className="gray mb-0">
                  <i className="fa fa-calendar-check mg0right-5" /> Expiration
                  Date
                </p>
                <p className="mb-0">
                  {getCurrentTimeZone(accountDetails.expiration)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="p-3 mt-5">Licenses</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card pad-10">
            <h6>Completed</h6>
            <div className="d-flex justify-content-between ">
              <span>
                {accountDetails?.licenses?.bundles[0]?.surfaces[0]?.name}
              </span>
              <span>
                {accountDetails?.licenses?.bundles[0]?.surfaces[0]?.count}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card pad-10">
            <h3>Add-ons</h3>
            <div className="d-flex justify-content-between ">
              {accountDetails?.licenses?.modules?.map((item) => {
                return (
                  <>
                    <p>{item.displayName}</p>
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card pad-10">
            <h3>Singularity Platform Settings</h3>

            {accountDetails?.licenses?.settings?.map((item) => {
              return (
                <>
                  <div className="row p-2">
                    <div className="col-md-7 gray">
                      {item.settingGroupDisplayName}
                    </div>
                    <div className="col-md-5 text-right bold">
                      {item.displayName}{" "}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetalis;
