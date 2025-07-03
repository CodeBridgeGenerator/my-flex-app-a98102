import React from "react";
import { render, screen } from "@testing-library/react";

import SuppliersPage from "../SuppliersPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders suppliers page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SuppliersPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("suppliers-datatable")).toBeInTheDocument();
    expect(screen.getByRole("suppliers-add-button")).toBeInTheDocument();
});
