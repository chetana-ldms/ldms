import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import clsx from "clsx";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAuthenticate,
  fetchForgatePassword,
  fetchOrganizations,
} from "../../../api/Api";
import { ToastContainer } from "react-toastify";
import {
  notify,
  notifyFail,
} from "../../apps/qradar/qradar-pages/components/notification/Notification";
import "react-toastify/dist/ReactToastify.css";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Minimum 3 symbols")
    .required("Username is required"),
  org: Yup.string()
    .notOneOf(["0"], "Please select an organisation")
    .required("Organisation is required"),
});

const initialValues = {
  username: "",
  org: 0,
};

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [organisation, setOrganisation] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations()
      .then((orgRes) => {
        setOrganisation(orgRes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const createdDate = new Date().toISOString();
        const authData = await fetchForgatePassword(
          values.username,
          Number(values.org),
          createdDate
        );
        console.log(authData, "authData");
        const { isSuccess, message } = authData;
        setMessage(message);
        if (isSuccess) {
          // notify(message)
          // setTimeout(() => {
          //   navigate('/auth')
          // }, 6000)
        } else {
          // notifyFail(message)
          // setTimeout(() => {
          //   navigate("/auth");
          // }, 6000);
        }
      } catch (error) {
        console.error(error);
        setStatus("Given details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div className="card pad-20">
      <ToastContainer />

      <form
        className="form w-100 login-form"
        onSubmit={formik.handleSubmit}
        noValidate
        id="kt_login_signin_form"
      >
        <div className="text-center mb-5">
          <h1 className="text-dark fw-bolder mb-3">
            <img
              src={toAbsoluteUrl("/media/misc/lancesoft_logo.png")}
              className="h-80px me-3"
            />
          </h1>
          <div className="text-blue-500 fw-semibold fs-20 login-subtxt">
            Defence Centre
          </div>
        </div>
        <h1 className="text-blue">Forgot Password</h1>
        <hr />
        {message && (
          <div className="alert alert-success mb-5">
            <i className="fa fa-exclamation-circle green" /> {message}
          </div>
        )}
        <div className="fv-row mb-8">
          <label className="form-label fs-6 fw-bolder text-dark">
            Username
          </label>
          <input
            placeholder="username"
            {...formik.getFieldProps("username")}
            className={clsx(
              "form-control bg-transparent",
              {
                "is-invalid": formik.touched.username && formik.errors.username,
              },
              {
                "is-valid": formik.touched.username && !formik.errors.username,
              }
            )}
            type="text"
            name="username"
            autoComplete="off"
          />
          {formik.touched.username && formik.errors.username && (
            <div className="fv-plugins-message-container">
              <span className="red" role="alert">
                {formik.errors.username}
              </span>
            </div>
          )}
        </div>
        <div className="fv-row mb-8">
          <label className="form-label fs-6 fw-bolder text-dark">
            Organisation Name
          </label>
          <div>
            {organisation === null && (
              <select
                placeholder="Organisation"
                {...formik.getFieldProps("org")}
                className={clsx(
                  "form-select form-control bg-transparent",
                  { "is-invalid": formik.touched.org && formik.errors.org },
                  { "is-valid": formik.touched.org && !formik.errors.org }
                )}
                autoComplete="off"
              >
                <option value="">Select</option>
              </select>
            )}
            {organisation !== null && (
              <select
                placeholder="Organisation"
                {...formik.getFieldProps("org")}
                className={clsx(
                  "form-select form-control bg-transparent",
                  { "is-invalid": formik.touched.org && formik.errors.org },
                  { "is-valid": formik.touched.org && !formik.errors.org }
                )}
                autoComplete="off"
              >
                <option value="">Select organisation</option>
                {organisation.length >= 0 &&
                  organisation.map((user) => (
                    <option key={user.orgID} value={user.orgID}>
                      {user.orgName}
                    </option>
                  ))}
              </select>
            )}
          </div>
          {formik.touched.org && formik.errors.org && (
            <div className="fv-plugins-message-container">
              <span className="red" role="alert">
                {formik.errors.org}
              </span>
            </div>
          )}
        </div>
        <div className="d-grid mb-5">
          <button
            type="submit"
            id="kt_sign_in_submit"
            className="btn btn-login"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            <span className="indicator-label">Submit</span>
          </button>
        </div>
      </form>

      <p className="fs-13 text-right">
        Click here to{" "}
        <Link to="/auth">
          <span className="link pointer text-underline">Login</span>
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
