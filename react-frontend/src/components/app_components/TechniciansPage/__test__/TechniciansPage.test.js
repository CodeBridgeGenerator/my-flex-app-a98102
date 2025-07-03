import React from "react";
import { render, screen } from "@testing-library/react";

import TechniciansPage from "../TechniciansPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders technicians page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TechniciansPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("technicians-datatable")).toBeInTheDocument();
    expect(screen.getByRole("technicians-add-button")).toBeInTheDocument();
});
