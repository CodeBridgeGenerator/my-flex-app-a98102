import React from "react";
import { render, screen } from "@testing-library/react";

import PartsinventoryPage from "../PartsinventoryPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders partsinventory page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PartsinventoryPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("partsinventory-datatable")).toBeInTheDocument();
    expect(screen.getByRole("partsinventory-add-button")).toBeInTheDocument();
});
