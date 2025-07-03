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
import { InputNumber } from 'primereact/inputnumber';
import UploadFilesToS3 from "../../../services/UploadFilesToS3";
import { Dropdown } from 'primereact/dropdown';


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

const LoyaltyprogramsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [supplierId, setSupplierId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount suppliers
                    client
                        .service("suppliers")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleSuppliersId } })
                        .then((res) => {
                            setSupplierId(res.data.map((e) => { return { name: e['supplierName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Suppliers", type: "error", message: error.message || "Failed get suppliers" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            partId: _entity?.partId,
partName: _entity?.partName,
description: _entity?.description,
quantityInStock: _entity?.quantityInStock,
price: _entity?.price,
supplierId: _entity?.supplierId?._id,
        };

        setLoading(true);
        try {
            
        await client.service("loyaltyprograms").patch(_entity._id, _data);
        const eagerResult = await client
            .service("loyaltyprograms")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "supplierId",
                    service : "suppliers",
                    select:["supplierName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info loyaltyprograms updated successfully" });
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

    const supplierIdOptions = supplierId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Loyaltyprograms" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="loyaltyprograms-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="partId">PartID:</label>
                <InputNumber id="partId" className="w-full mb-3 p-inputtext-sm" value={_entity?.partId} onChange={(e) => setValByKey("partId", e.value)}  useGrouping={false}/>
            </span>
            <small className="p-error">
            {!_.isEmpty(error["partId"]) && (
              <p className="m-0" key="error-partId">
                {error["partId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="partName">Part Name:</label>
                <InputText id="partName" className="w-full mb-3 p-inputtext-sm" value={_entity?.partName} onChange={(e) => setValByKey("partName", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["partName"]) && (
              <p className="m-0" key="error-partName">
                {error["partName"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="description">Description:</label>
                    <UploadFilesToS3 type={'edit'} setValByKey={setValByKey} onSave={onSave} id={urlParams.singleLoyaltyprogramsId} serviceName="loyaltyprograms" />
                </span>
                <small className="p-error">
                {!_.isEmpty(error["description"]) && (
                  <p className="m-0" key="error-description">
                    {error["description"]}
                  </p>
                )}
              </small>
                </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="quantityInStock">Quantity In Stock:</label>
                <InputNumber id="quantityInStock" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantityInStock} onChange={(e) => setValByKey("quantityInStock", e.value)}  useGrouping={false}/>
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantityInStock"]) && (
              <p className="m-0" key="error-quantityInStock">
                {error["quantityInStock"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="price">Price:</label>
                <InputNumber id="price" className="w-full mb-3 p-inputtext-sm" value={_entity?.price} onChange={(e) => setValByKey("price", e.value)}  useGrouping={false}/>
            </span>
            <small className="p-error">
            {!_.isEmpty(error["price"]) && (
              <p className="m-0" key="error-price">
                {error["price"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="supplierId">Supplier:</label>
                <Dropdown id="supplierId" value={_entity?.supplierId?._id} optionLabel="name" optionValue="value" options={supplierIdOptions} onChange={(e) => setValByKey("supplierId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["supplierId"]) && (
              <p className="m-0" key="error-supplierId">
                {error["supplierId"]}
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

export default connect(mapState, mapDispatch)(LoyaltyprogramsCreateDialogComponent);
