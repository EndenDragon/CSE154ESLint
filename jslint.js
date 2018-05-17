/*
    Jeremy Zhang
    16 May 2017
    Client side Javascript interacting with the ESLint API to validate the given
    JavaScript code. Validates the code on button click and display various cards
    depending on the severity of the problem. If there are no problems, then only
    the success card is displayed to the user.
*/

/* global fetch */

"use strict";
(function () {
    /**
     * Setup the click handler to run js linting process. Automatically runs
     * on page load if there are data in the box from referer.
     */
    window.onload = function () {
        document.getElementById("run").onclick = run;
        if (!inputEmpty()) {
            run();
        }
    };

    /**
     * Test if the textarea input is empty.
     * @return {Boolean} true if empty, else false
     */
    function inputEmpty() {
        return document.getElementById("input").value.trim() === "";
    }

    /**
     * Reads in the input and run it through the ESLint api
     */
    function run() {
        if (inputEmpty()) {
            return;
        }
        let input = document.getElementById("input").value;
        let postParams = new FormData();
        postParams.append("code", input);
        disableRunBtn(true);
        displayValidationCards("all", false);
        fetch("eslint.php", {method: "POST", body: postParams})
            .then(checkStatus)
            .then(JSON.parse)
            .then(populatePage)
            .catch(fetchError);
    }

    /**
     * Enables the run button and set the button text to an error message.
     */
    function fetchError() {
        disableRunBtn(false);
        let run = document.getElementById("run");
        run.innerText = "Error parsing the JavaScript source. Too large?";
    }

    /**
     * Given the JSON response from the api, it reenables the run button
     * and populates the error cards
     * @param response {JSON} the api response
     */
    function populatePage(response) {
        response = response[0];
        if (response.warningCount === 0 && response.errorCount === 0) {
            displayValidationCards("success", true);
        } else {
            const SEVERITY_ERROR = 2;
            const SEVERITY_WARN = 1;
            let messages = {error: [], warn: []};
            for (let i = 0; i < response.messages.length; i++) {
                let message = response.messages[i];
                if (message.severity === SEVERITY_ERROR) {
                    messages.error.push(message);
                } else if (message.severity === SEVERITY_WARN) {
                    messages.warn.push(message);
                }
            }
            populateCard("error", messages.error);
            populateCard("warn", messages.warn);
        }
        disableRunBtn(false);
    }

    /**
     * Given the card type and error json messages from the api, it populates
     * the given card and unhides it.
     * @param card {String} the given card to fill
     * @param messages {Array} list of all errors from the eslint api
     */
    function populateCard(card, messages) {
        let ul = document.querySelector("#" + card + "-card ul");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        if (messages.length === 0) {
            return;
        }

        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            let li = document.createElement("li");
            li.classList.add("list-group-item");

            let ruleId = document.createElement("span");
            ruleId.classList.add("badge", "badge-info", "badge-pill", "float-right");
            ruleId.innerText = message.ruleId;
            li.appendChild(ruleId);

            let rowCol = document.createElement("strong");
            rowCol.innerText = "line " + message.line + ", column " + message.column;
            li.appendChild(rowCol);

            let reason = document.createTextNode(": " + message.message);
            li.appendChild(reason);

            if (message.source.trim().length > 0) {
                let br = document.createElement("br");
                li.appendChild(br);

                let pre = document.createElement("pre");
                let code = document.createElement("code");
                pre.appendChild(code);
                li.appendChild(pre);
                code.innerText = message.source + "\n";
                for (let j = 1; j < message.column; j++) {
                    code.innerText += " ";
                }
                for (let j = message.column; j < message.endColumn; j++) {
                    code.innerText += "^";
                }
                li.appendChild(pre);
            }

            ul.appendChild(li);
        }
        displayValidationCards(card, true);
    }

    /**
     * Disables/enables the jslint run button.
     * @param disabled {Boolean} true to disable, else false
     */
    function disableRunBtn(disabled) {
        let run = document.getElementById("run");
        run.disabled = disabled;
        if (disabled) {
            run.innerText = "Linting...";
        } else {
            run.innerText = "Run JSLint";
        }
    }

    /**
     * Should the card be displayed or hidden.
     * @param card {String} the card type to change display, use "all" for all the cards
     * @param shown {Boolean} if the card should be shown or hidden
     */
    function displayValidationCards(card, shown) {
        if (card === "all") {
            card = ["success", "error", "warn"];
        } else {
            card = [card];
        }
        for (let i = 0; i < card.length; i++) {
            let thisCard = card[i] + "-card";
            thisCard = document.getElementById(thisCard);
            if (shown) {
                thisCard.style.display = "";
            } else {
                thisCard.style.display = "none";
            }
        }
    }

    /**
     * Function to check the status of an Ajax call, boiler plate code to include,
     * based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
     * @param the response text from the url call
     * @return did we succeed or not, so we know whether or not to continue with the handling of
     * this promise
     */
    function checkStatus(response) {
        const LOWER_OK_STATUS = 200;
        const HIGHER_OK_STATUS = 300;
        if (response.status >= LOWER_OK_STATUS && response.status < HIGHER_OK_STATUS) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status +
                                        ": " + response.statusText));
        }
    }
})();