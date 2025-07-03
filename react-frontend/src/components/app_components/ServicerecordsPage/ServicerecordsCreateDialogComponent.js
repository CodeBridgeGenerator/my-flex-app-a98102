import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const ServicerecordsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [invoiceId, setInvoiceId] = useState([])
const [serviceId, setServiceId] = useState([])
const [vehicleId, setVehicleId] = useState([])
const [technicianId, setTechnicianId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [invoiceId,serviceId,vehicleId,technicianId], setError);
        }
        set_entity({...init});
        setError({});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            invoiceId: _entity?.invoiceId?._id,serviceId: _entity?.serviceId?._id,vehicleId: _entity?.vehicleId?._id,technicianId: _entity?.technicianId?._id,serviceDate: _entity?.serviceDate,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("servicerecords").create(_data);
        const eagerResult = await client
            .service("servicerecords")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "invoiceId",
                    service : "invoices",
                    select:["serviceDate"]},{
                    path : "serviceId",
                    service : "services",
                    select:["serviceName"]},{
                    path : "vehicleId",
                    service : "vehicles",
                    select:["licensePlate"]},{
                    path : "technicianId",
                    service : "technicians",
                    select:["firstName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Servicerecords updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Servicerecords" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount invoices
                    client
                        .service("invoices")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleInvoicesId } })
                        .then((res) => {
                            setInvoiceId(res.data.map((e) => { return { name: e['serviceDate'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Invoices", type: "error", message: error.message || "Failed get invoices" });
                        });
                }, []);

useEffect(() => {
                    // on mount services
                    client
                        .service("services")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleServicesId } })
                        .then((res) => {
                            setServiceId(res.data.map((e) => { return { name: e['serviceName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Services", type: "error", message: error.message || "Failed get services" });
                        });
                }, []);

useEffect(() => {
                    // on mount vehicles
                    client
                        .service("vehicles")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleVehiclesId } })
                        .then((res) => {
                            setVehicleId(res.data.map((e) => { return { name: e['licensePlate'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Vehicles", type: "error", message: error.message || "Failed get vehicles" });
                        });
                }, []);

useEffect(() => {
                    // on mount technicians
                    client
                        .service("technicians")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleTechniciansId } })
                        .then((res) => {
                            setTechnicianId(res.data.map((e) => { return { name: e['firstName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Technicians", type: "error", message: error.message || "Failed get technicians" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const invoiceIdOptions = invoiceId.map((elem) => ({ name: elem.name, value: elem.value }));
const serviceIdOptions = serviceId.map((elem) => ({ name: elem.name, value: elem.value }));
const vehicleIdOptions = vehicleId.map((elem) => ({ name: elem.name, value: elem.value }));
const technicianIdOptions = technicianId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Servicerecords" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="servicerecords-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="invoiceId">Invoice:</label>
                <Dropdown id="invoiceId" value={_entity?.invoiceId?._id} optionLabel="name" optionValue="value" options={invoiceIdOptions} onChange={(e) => setValByKey("invoiceId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["invoiceId"]) ? (
              <p className="m-0" key="error-invoiceId">
                {error["invoiceId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="serviceId">Service:</label>
                <Dropdown id="serviceId" value={_entity?.serviceId?._id} optionLabel="name" optionValue="value" options={serviceIdOptions} onChange={(e) => setValByKey("serviceId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serviceId"]) ? (
              <p className="m-0" key="error-serviceId">
                {error["serviceId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="vehicleId">Vehicle:</label>
                <Dropdown id="vehicleId" value={_entity?.vehicleId?._id} optionLabel="name" optionValue="value" options={vehicleIdOptions} onChange={(e) => setValByKey("vehicleId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["vehicleId"]) ? (
              <p className="m-0" key="error-vehicleId">
                {error["vehicleId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="technicianId">Technician:</label>
                <Dropdown id="technicianId" value={_entity?.technicianId?._id} optionLabel="name" optionValue="value" options={technicianIdOptions} onChange={(e) => setValByKey("technicianId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["technicianId"]) ? (
              <p className="m-0" key="error-technicianId">
                {error["technicianId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="serviceDate">Service Date:</label>
                <Calendar id="serviceDate"  value={_entity?.serviceDate ? new Date(_entity?.serviceDate) : null} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("serviceDate", new Date(e.target.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serviceDate"]) ? (
              <p className="m-0" key="error-serviceDate">
                {error["serviceDate"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(ServicerecordsCreateDialogComponent);
