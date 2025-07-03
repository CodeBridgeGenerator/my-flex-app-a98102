import React from "react";
import { render, screen } from "@testing-library/react";

import PaymentmethodsPage from "../PaymentmethodsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders paymentmethods page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PaymentmethodsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("paymentmethods-datatable")).toBeInTheDocument();
    expect(screen.getByRole("paymentmethods-add-button")).toBeInTheDocument();
});
