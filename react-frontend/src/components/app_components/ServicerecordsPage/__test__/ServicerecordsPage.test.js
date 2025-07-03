import React from "react";
import { render, screen } from "@testing-library/react";

import ServicerecordsPage from "../ServicerecordsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders servicerecords page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ServicerecordsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("servicerecords-datatable")).toBeInTheDocument();
    expect(screen.getByRole("servicerecords-add-button")).toBeInTheDocument();
});
