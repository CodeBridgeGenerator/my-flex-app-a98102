import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import UploadFilesToS3 from "../../../services/UploadFilesToS3";
import { Dropdown } from "primereact/dropdown";


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

const LoyaltyprogramsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [supplierId, setSupplierId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [supplierId], setError);
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
            partId: _entity?.partId,partName: _entity?.partName,description: _entity?.description,quantityInStock: _entity?.quantityInStock,price: _entity?.price,supplierId: _entity?.supplierId?._id,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("loyaltyprograms").create(_data);
        const eagerResult = await client
            .service("loyaltyprograms")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "supplierId",
                    service : "suppliers",
                    select:["supplierName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Loyaltyprograms updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Loyaltyprograms" });
        }
        setLoading(false);
    };

    const onFileLoaded = (file, status) => {
    if (status)
      props.alert({
        title: "file uploader",
        type: "success",
        message: "file uploaded" + file.name
      });
    else
      props.alert({
        title: "file uploader",
        type: "error",
        message: "file uploader failed" + file.name
      });
  };

    const setId = (id) => { setValByKey("description", id);  };

    useEffect(() => {
                    // on mount suppliers
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
        <Dialog header="Create Loyaltyprograms" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="loyaltyprograms-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="partId">PartID:</label>
                <InputNumber id="partId" className="w-full mb-3 p-inputtext-sm" value={_entity?.partId} onChange={(e) => setValByKey("partId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["partId"]) ? (
              <p className="m-0" key="error-partId">
                {error["partId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="partName">Part Name:</label>
                <InputText id="partName" className="w-full mb-3 p-inputtext-sm" value={_entity?.partName} onChange={(e) => setValByKey("partName", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["partName"]) ? (
              <p className="m-0" key="error-partName">
                {error["partName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="description">Description:</label>
                    <UploadFilesToS3 type={'create'} user={props.user} id={urlParams.id} serviceName="loyaltyprograms" onUploadComplete={setId} onFileLoaded={onFileLoaded}/>
                </span>
                <small className="p-error">
                {!_.isEmpty(error["description"]) ? (
                  <p className="m-0" key="error-description">
                    {error["description"]}
                  </p>
                ) : null}
              </small>
                </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="quantityInStock">Quantity In Stock:</label>
                <InputNumber id="quantityInStock" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantityInStock} onChange={(e) => setValByKey("quantityInStock", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantityInStock"]) ? (
              <p className="m-0" key="error-quantityInStock">
                {error["quantityInStock"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="price">Price:</label>
                <InputNumber id="price" className="w-full mb-3 p-inputtext-sm" value={_entity?.price} onChange={(e) => setValByKey("price", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["price"]) ? (
              <p className="m-0" key="error-price">
                {error["price"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="supplierId">Supplier:</label>
                <Dropdown id="supplierId" value={_entity?.supplierId?._id} optionLabel="name" optionValue="value" options={supplierIdOptions} onChange={(e) => setValByKey("supplierId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["supplierId"]) ? (
              <p className="m-0" key="error-supplierId">
                {error["supplierId"]}
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

export default connect(mapState, mapDispatch)(LoyaltyprogramsCreateDialogComponent);
