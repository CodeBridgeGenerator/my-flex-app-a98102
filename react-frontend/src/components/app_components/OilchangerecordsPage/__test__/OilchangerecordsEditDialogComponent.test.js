import React from "react";
import { render, screen } from "@testing-library/react";

import OilchangerecordsEditDialogComponent from "../OilchangerecordsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders oilchangerecords edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <OilchangerecordsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("oilchangerecords-edit-dialog-component")).toBeInTheDocument();
});
