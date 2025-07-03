import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const MaintenanceschedulesCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [vehicleId, setVehicleId] = useState([])
const [serviceId, setServiceId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount vehicles
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
                    //on mount services
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

    const onSave = async () => {
        let _data = {
            vehicleId: _entity?.vehicleId?._id,
serviceId: _entity?.serviceId?._id,
nextServiceDate: _entity?.nextServiceDate,
notes: _entity?.notes,
        };

        setLoading(true);
        try {
            
        await client.service("maintenanceschedules").patch(_entity._id, _data);
        const eagerResult = await client
            .service("maintenanceschedules")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "vehicleId",
                    service : "vehicles",
                    select:["licensePlate"]},{
                    path : "serviceId",
                    service : "services",
                    select:["serviceName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info maintenanceschedules updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

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
const serviceIdOptions = serviceId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Maintenanceschedules" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="maintenanceschedules-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="vehicleId">Vehicle:</label>
                <Dropdown id="vehicleId" value={_entity?.vehicleId?._id} optionLabel="name" optionValue="value" options={vehicleIdOptions} onChange={(e) => setValByKey("vehicleId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["vehicleId"]) && (
              <p className="m-0" key="error-vehicleId">
                {error["vehicleId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="serviceId">Service:</label>
                <Dropdown id="serviceId" value={_entity?.serviceId?._id} optionLabel="name" optionValue="value" options={serviceIdOptions} onChange={(e) => setValByKey("serviceId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["serviceId"]) && (
              <p className="m-0" key="error-serviceId">
                {error["serviceId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="nextServiceDate">Next Service Date:</label>
                <Calendar id="nextServiceDate" value={_entity?.nextServiceDate ? new Date(_entity?.nextServiceDate) : null} onChange={ (e) => setValByKey("nextServiceDate", new Date(e.target.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["nextServiceDate"]) && (
              <p className="m-0" key="error-nextServiceDate">
                {error["nextServiceDate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="notes">Notes:</label>
                <InputText id="notes" className="w-full mb-3 p-inputtext-sm" value={_entity?.notes} onChange={(e) => setValByKey("notes", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["notes"]) && (
              <p className="m-0" key="error-notes">
                {error["notes"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
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

export default connect(mapState, mapDispatch)(MaintenanceschedulesCreateDialogComponent);
