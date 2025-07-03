import React from "react";
import { render, screen } from "@testing-library/react";

import LoyaltyprogramsCreateDialogComponent from "../LoyaltyprogramsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders loyaltyprograms create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <LoyaltyprogramsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("loyaltyprograms-create-dialog-component")).toBeInTheDocument();
});
