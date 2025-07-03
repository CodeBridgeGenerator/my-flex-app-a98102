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
import { InputNumber } from "primereact/inputnumber";
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

const OilchangerecordsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [vehicleId, setVehicleId] = useState([])
const [serviceRecordId, setServiceRecordId] = useState([])
const [technicianId, setTechnicianId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [vehicleId,serviceRecordId,technicianId], setError);
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
            vehicleId: _entity?.vehicleId?._id,serviceRecordId: _entity?.serviceRecordId?._id,oilType: _entity?.oilType,mileage: _entity?.mileage,technicianId: _entity?.technicianId?._id,dateOfChange: _entity?.dateOfChange,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("oilchangerecords").create(_data);
        const eagerResult = await client
            .service("oilchangerecords")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "vehicleId",
                    service : "vehicles",
                    select:["licensePlate"]},{
                    path : "serviceRecordId",
                    service : "servicerecords",
                    select:["invoiceId"]},{
                    path : "technicianId",
                    service : "technicians",
                    select:["firstName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Oilchangerecords updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Oilchangerecords" });
        }
        setLoading(false);
    };

    

    

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
                    // on mount servicerecords
                    client
                        .service("servicerecords")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleServicerecordsId } })
                        .then((res) => {
                            setServiceRecordId(res.data.map((e) => { return { name: e['invoiceId'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Servicerecords", type: "error", message: error.message || "Failed get servicerecords" });
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

    const vehicleIdOptions = vehicleId.map((elem) => ({ name: elem.name, value: elem.value }));
const serviceRecordIdOptions = serviceRecordId.map((elem) => ({ name: elem.name, value: elem.value }));
const technicianIdOptions = technicianId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Oilchangerecords" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="oilchangerecords-create-dialog-component">
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
                <label htmlFor="serviceRecordId">Service Record:</label>
                <Dropdown id="serviceRecordId" value={_entity?.serviceRecordId?._id} optionLabel="name" optionValue="value" options={serviceRecordIdOptions} onChange={(e) => setValByKey("serviceRecordId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serviceRecordId"]) ? (
              <p className="m-0" key="error-serviceRecordId">
                {error["serviceRecordId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="oilType">Oil Type:</label>
                <InputText id="oilType" className="w-full mb-3 p-inputtext-sm" value={_entity?.oilType} onChange={(e) => setValByKey("oilType", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["oilType"]) ? (
              <p className="m-0" key="error-oilType">
                {error["oilType"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="mileage">Mileage:</label>
                <InputNumber id="mileage" className="w-full mb-3 p-inputtext-sm" value={_entity?.mileage} onChange={(e) => setValByKey("mileage", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["mileage"]) ? (
              <p className="m-0" key="error-mileage">
                {error["mileage"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="technicianId">TechnicianID:</label>
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
                <label htmlFor="dateOfChange">Date Of Change:</label>
                <Calendar id="dateOfChange"  value={_entity?.dateOfChange ? new Date(_entity?.dateOfChange) : null} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("dateOfChange", new Date(e.target.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["dateOfChange"]) ? (
              <p className="m-0" key="error-dateOfChange">
                {error["dateOfChange"]}
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

export default connect(mapState, mapDispatch)(OilchangerecordsCreateDialogComponent);
