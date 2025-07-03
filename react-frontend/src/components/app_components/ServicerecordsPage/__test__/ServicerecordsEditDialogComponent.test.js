import React from "react";
import { render, screen } from "@testing-library/react";

import ServicerecordsEditDialogComponent from "../ServicerecordsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders servicerecords edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ServicerecordsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("servicerecords-edit-dialog-component")).toBeInTheDocument();
});
