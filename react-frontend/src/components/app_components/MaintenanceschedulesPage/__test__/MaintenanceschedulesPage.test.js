import React from "react";
import { render, screen } from "@testing-library/react";

import MaintenanceschedulesPage from "../MaintenanceschedulesPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders maintenanceschedules page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MaintenanceschedulesPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("maintenanceschedules-datatable")).toBeInTheDocument();
    expect(screen.getByRole("maintenanceschedules-add-button")).toBeInTheDocument();
});
