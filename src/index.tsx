import * as React from "react";
import * as ReactDOM from "react-dom";

import { FastBet } from "./components/fast-bet";
import { Hello } from "./components/Hello";

const date = new Date();

export function fastBet({date: forDate}: {date: Date}) {
    renderFastBet(forDate);
}

function renderFastBet(date: Date) {
    ReactDOM.render(
        <FastBet date={date} />,
        document.getElementById("example")
    );
}

renderFastBet(date);