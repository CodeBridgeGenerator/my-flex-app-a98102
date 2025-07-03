import React from "react";
import { render, screen } from "@testing-library/react";

import MaintenanceschedulesEditDialogComponent from "../MaintenanceschedulesEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders maintenanceschedules edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MaintenanceschedulesEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("maintenanceschedules-edit-dialog-component")).toBeInTheDocument();
});
