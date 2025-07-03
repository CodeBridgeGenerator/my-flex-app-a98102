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
import { InputNumber } from 'primereact/inputnumber';


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

const VehiclesCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [customerId, setCustomerId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount customers
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

    const onSave = async () => {
        let _data = {
            customerId: _entity?.customerId?._id,
make: _entity?.make,
model: _entity?.model,
year: _entity?.year,
licensePlate: _entity?.licensePlate,
vin: _entity?.vin,
        };

        setLoading(true);
        try {
            
        await client.service("vehicles").patch(_entity._id, _data);
        const eagerResult = await client
            .service("vehicles")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "customerId",
                    service : "customers",
                    select:["firstName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info vehicles updated successfully" });
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

    const customerIdOptions = customerId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Vehicles" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="vehicles-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="customerId">CustomerID:</label>
                <Dropdown id="customerId" value={_entity?.customerId?._id} optionLabel="name" optionValue="value" options={customerIdOptions} onChange={(e) => setValByKey("customerId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["customerId"]) && (
              <p className="m-0" key="error-customerId">
                {error["customerId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="make">Make:</label>
                <InputText id="make" className="w-full mb-3 p-inputtext-sm" value={_entity?.make} onChange={(e) => setValByKey("make", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["make"]) && (
              <p className="m-0" key="error-make">
                {error["make"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="model">Model:</label>
                <InputText id="model" className="w-full mb-3 p-inputtext-sm" value={_entity?.model} onChange={(e) => setValByKey("model", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["model"]) && (
              <p className="m-0" key="error-model">
                {error["model"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="year">Year:</label>
                <InputNumber id="year" className="w-full mb-3 p-inputtext-sm" value={_entity?.year} onChange={(e) => setValByKey("year", e.value)}  useGrouping={false}/>
            </span>
            <small className="p-error">
            {!_.isEmpty(error["year"]) && (
              <p className="m-0" key="error-year">
                {error["year"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="licensePlate">LicensePlate:</label>
                <InputText id="licensePlate" className="w-full mb-3 p-inputtext-sm" value={_entity?.licensePlate} onChange={(e) => setValByKey("licensePlate", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["licensePlate"]) && (
              <p className="m-0" key="error-licensePlate">
                {error["licensePlate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="vin">VIN:</label>
                <InputText id="vin" className="w-full mb-3 p-inputtext-sm" value={_entity?.vin} onChange={(e) => setValByKey("vin", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["vin"]) && (
              <p className="m-0" key="error-vin">
                {error["vin"]}
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

export default connect(mapState, mapDispatch)(VehiclesCreateDialogComponent);
