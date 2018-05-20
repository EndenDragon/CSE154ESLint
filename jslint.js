/*
    Jeremy Zhang
    16 May 2017
    Client side Javascript interacting with the ESLint API to validate the given
    JavaScript code. Validates the code on button click and display various cards
    depending on the severity of the problem. If there are no problems, then only
    the success card is displayed to the user.
*/

/* global ESLINT_OPTIONS, ace, require */

"use strict";
(function () {
    const ACE_PRINT_MARGIN = 100; // 100 lines of code line
    const DEFAULT_TAB_SIZE = 3; // Default selected tab size setting

    let linter = null; // ESLint linter object
    let aceEditor = null; // C9 ACE Editor object

    /**
     * Setup the click handler to run js linting process. Automatically runs
     * on page load if there are data in the box from referer. Initialize the global
     * linter object.
     */
    window.onload = function () {
        disableRunBtn(true, "Loading...");
        require(["eslint"], function(Linter) {
            disableRunBtn(false);
            linter = new Linter();
        });
        aceEditor = ace.edit("input");
        aceEditor.session.setMode("ace/mode/javascript");
        aceEditor.setPrintMarginColumn(ACE_PRINT_MARGIN);
        aceEditor.getSession().setUseWorker(false);
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
        return aceEditor.getValue() === "";
    }

    /**
     * Reads in the input and run it through the ESLint api
     */
    function run() {
        if (inputEmpty()) {
            return;
        }
        let input = aceEditor.getValue();
        let tabSize = document.getElementById("option-tab-size-select").value;
        input = untabify(input, parseInt(tabSize, 10));
        aceEditor.setValue(input);
        disableRunBtn(true);
        displayValidationCards("all", false);
        let linted = linter.verify(input, ESLINT_OPTIONS);
        populatePage(linted);
    }

    /**
     * Given the JSON response from the api, it reenables the run button
     * and populates the error cards
     * @param response {JSON} the api response
     */
    function populatePage(response) {
        if (response.length === 0) {
            displayValidationCards("success", true);
        } else {
            const SEVERITY_ERROR = 2;
            const SEVERITY_WARN = 1;
            let messages = {error: [], warn: []};
            for (let i = 0; i < response.length; i++) {
                let message = response[i];
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
            rowCol.dataset.row = message.line;
            rowCol.dataset.col = message.column;
            rowCol.onclick = jumpToLine;

            let reason = document.createTextNode(": " + message.message);
            li.appendChild(reason);

            let source = aceEditor.session.getLine(message.line - 1);
            if (source.trim().length > 0) {
                let br = document.createElement("br");
                li.appendChild(br);

                let pre = document.createElement("pre");
                let code = document.createElement("code");
                pre.appendChild(code);
                li.appendChild(pre);
                code.innerText = source + "\n";
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
    function disableRunBtn(disabled, text) {
        let run = document.getElementById("run");
        run.disabled = disabled;
        if (disabled) {
            run.innerText = text || "Linting...";
        } else {
            run.innerText = text || "Run JSLint";
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
     * Converts tabs to spaces. Totally not stolen from GradeIt's PHP source and
     * converted line by line to JavaScript alternative.
     * @param text {String} The text to convert tab to space
     * @param tabWidth {Number} The width of a tab
     * @return {String} The text with tabs converted to spaces
     */
    function untabify(text, tabWidth = DEFAULT_TAB_SIZE) {
        let lines = text.split(/\r?\n/);
        let newLines = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let newLine = "";
            for (let j = 0; j < line.length; j++) {
                let ch = line[j];
                if (ch === "\t") {
                    // replace tab with spaces
                    newLine += " ";
                    while (newLine.length % tabWidth !== 0) {
                        newLine += " ";
                    }
                } else {
                    newLine += ch;
                }
            }
            newLines.push(newLine);
        }
        return newLines.join("\n");
    }

    function jumpToLine() {
        let row = this.dataset.row;
        let col = this.dataset.col;
        window.scrollTo(0, 0);
        aceEditor.focus();
        aceEditor.gotoLine(row, col);
    }
})();