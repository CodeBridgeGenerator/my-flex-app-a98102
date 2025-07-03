import React from "react";
import { render, screen } from "@testing-library/react";

import MaintenanceschedulesCreateDialogComponent from "../MaintenanceschedulesCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders maintenanceschedules create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MaintenanceschedulesCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("maintenanceschedules-create-dialog-component")).toBeInTheDocument();
});
