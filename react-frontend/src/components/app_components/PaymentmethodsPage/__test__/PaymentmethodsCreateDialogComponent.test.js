import React from "react";
import { render, screen } from "@testing-library/react";

import PaymentmethodsCreateDialogComponent from "../PaymentmethodsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders paymentmethods create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PaymentmethodsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("paymentmethods-create-dialog-component")).toBeInTheDocument();
});
