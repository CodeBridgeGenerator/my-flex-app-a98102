import React from "react";
import { render, screen } from "@testing-library/react";

import OilchangerecordsPage from "../OilchangerecordsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders oilchangerecords page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <OilchangerecordsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("oilchangerecords-datatable")).toBeInTheDocument();
    expect(screen.getByRole("oilchangerecords-add-button")).toBeInTheDocument();
});
