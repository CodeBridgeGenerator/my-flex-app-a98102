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
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
const paymentMethodArray = ["Online Payment","Cash"];
const paymentMethodOptions = paymentMethodArray.map((x) => ({ name: x, value: x }));

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

const InvoicesCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [customerId, setCustomerId] = useState([])
const [vehicleId, setVehicleId] = useState([])

    useEffect(() => {
        let init  = {paymentStatus: false};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [customerId,vehicleId], setError);
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
            customerId: _entity?.customerId?._id,vehicleId: _entity?.vehicleId?._id,serviceDate: _entity?.serviceDate,totalAmount: _entity?.totalAmount,paymentStatus: _entity?.paymentStatus || false,paymentMethod: _entity?.paymentMethod,notes: _entity?.notes,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("invoices").create(_data);
        const eagerResult = await client
            .service("invoices")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "customerId",
                    service : "customers",
                    select:["firstName"]},{
                    path : "vehicleId",
                    service : "vehicles",
                    select:["licensePlate"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Invoices updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Invoices" });
        }
        setLoading(false);
    };

    

    

    useEffect(() => {
                    // on mount customers
                    client
                        .service("customers")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCustomersId } })
                        .then((res) => {
                            setCustomerId(res.data.map((e) => { return { name: e['firstName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Customers", type: "error", message: error.message || "Failed get customers" });
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

    const customerIdOptions = customerId.map((elem) => ({ name: elem.name, value: elem.value }));
const vehicleIdOptions = vehicleId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Invoices" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="invoices-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="customerId">Customer:</label>
                <Dropdown id="customerId" value={_entity?.customerId?._id} optionLabel="name" optionValue="value" options={customerIdOptions} onChange={(e) => setValByKey("customerId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["customerId"]) ? (
              <p className="m-0" key="error-customerId">
                {error["customerId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="vehicleId">VehicleID:</label>
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
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="totalAmount">Total Amount:</label>
                <InputNumber id="totalAmount" className="w-full mb-3" mode="currency" currency="MYR" locale="en-US" value={_entity?.totalAmount} onValueChange={(e) => setValByKey("totalAmount", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["totalAmount"]) ? (
              <p className="m-0" key="error-totalAmount">
                {error["totalAmount"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field flex">
            <span className="align-items-center">
                <label htmlFor="paymentStatus">Payment Status:</label>
                <Checkbox id="paymentStatus" className="ml-3" checked={_entity?.paymentStatus} onChange={ (e) => setValByKey("paymentStatus", e.checked)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["paymentStatus"]) ? (
              <p className="m-0" key="error-paymentStatus">
                {error["paymentStatus"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="paymentMethod">PaymentMethod:</label>
                <Dropdown id="paymentMethod" value={_entity?.paymentMethod} options={paymentMethodOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("paymentMethod", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["paymentMethod"]) ? (
              <p className="m-0" key="error-paymentMethod">
                {error["paymentMethod"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="notes">Notes:</label>
                <InputTextarea id="notes" rows={5} cols={30} value={_entity?.notes} onChange={ (e) => setValByKey("notes", e.target.value)} autoResize  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["notes"]) ? (
              <p className="m-0" key="error-notes">
                {error["notes"]}
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

export default connect(mapState, mapDispatch)(InvoicesCreateDialogComponent);
