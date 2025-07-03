import React from "react";
import { render, screen } from "@testing-library/react";

import PaymentmethodsEditDialogComponent from "../PaymentmethodsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders paymentmethods edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PaymentmethodsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("paymentmethods-edit-dialog-component")).toBeInTheDocument();
});
