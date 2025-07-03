import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

import OilchangerecordsPage from "../OilchangerecordsPage/OilchangerecordsPage";

const SingleServicerecordsPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    const [invoiceId, setInvoiceId] = useState([]);
const [serviceId, setServiceId] = useState([]);
const [vehicleId, setVehicleId] = useState([]);
const [technicianId, setTechnicianId] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("servicerecords")
            .get(urlParams.singleServicerecordsId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"invoiceId","serviceId","vehicleId","technicianId"] }})
            .then((res) => {
                set_entity(res || {});
                const invoiceId = Array.isArray(res.invoiceId)
            ? res.invoiceId.map((elem) => ({ _id: elem._id, serviceDate: elem.serviceDate }))
            : res.invoiceId
                ? [{ _id: res.invoiceId._id, serviceDate: res.invoiceId.serviceDate }]
                : [];
        setInvoiceId(invoiceId);
const serviceId = Array.isArray(res.serviceId)
            ? res.serviceId.map((elem) => ({ _id: elem._id, serviceName: elem.serviceName }))
            : res.serviceId
                ? [{ _id: res.serviceId._id, serviceName: res.serviceId.serviceName }]
                : [];
        setServiceId(serviceId);
const vehicleId = Array.isArray(res.vehicleId)
            ? res.vehicleId.map((elem) => ({ _id: elem._id, licensePlate: elem.licensePlate }))
            : res.vehicleId
                ? [{ _id: res.vehicleId._id, licensePlate: res.vehicleId.licensePlate }]
                : [];
        setVehicleId(vehicleId);
const technicianId = Array.isArray(res.technicianId)
            ? res.technicianId.map((elem) => ({ _id: elem._id, firstName: elem.firstName }))
            : res.technicianId
                ? [{ _id: res.technicianId._id, firstName: res.technicianId.firstName }]
                : [];
        setTechnicianId(technicianId);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Servicerecords", type: "error", message: error.message || "Failed get servicerecords" });
            });
    }, [props,urlParams.singleServicerecordsId]);


    const goBack = () => {
        navigate("/servicerecords");
    };

      const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

    const menuItems = [
        {
            label: "Copy link",
            icon: "pi pi-copy",
            command: () => copyPageLink(),
        },
        {
            label: "Help",
            icon: "pi pi-question-circle",
            command: () => toggleHelpSidebar(),
        },
    ];

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-12">
                <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Servicerecords</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>servicerecords/{urlParams.singleServicerecordsId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Service Date</label><p id="serviceDate" className="m-0 ml-3" >{_entity?.serviceDate}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Invoice</label>
                    {invoiceId.map((elem) => (
                        <Link key={elem._id} to={`/invoices/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.serviceDate}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Service</label>
                    {serviceId.map((elem) => (
                        <Link key={elem._id} to={`/services/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.serviceName}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Vehicle</label>
                    {vehicleId.map((elem) => (
                        <Link key={elem._id} to={`/vehicles/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.licensePlate}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Technician</label>
                    {technicianId.map((elem) => (
                        <Link key={elem._id} to={`/technicians/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.firstName}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        <div className="mt-2">
            <TabView>
                
                    <TabPanel header="true" leftIcon="pi pi-building-columns mr-2">
                    <OilchangerecordsPage/>
                    </TabPanel>
                    
            </TabView>
        </div>

      <CommentsSection
        recordId={urlParams.singleServicerecordsId}
        user={props.user}
        alert={props.alert}
        serviceName="servicerecords"
      />
      <div
        id="rightsidebar"
        className={classNames("overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out", { "hidden" : !isHelpSidebarVisible })}
        style={{ top: "60px", height: "calc(100% - 60px)" }}
      >
        <div className="flex flex-column h-full p-4">
          <span className="text-xl font-medium text-900 mb-3">Help bar</span>
          <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
        </div>
      </div>
      </div>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleServicerecordsPage);
