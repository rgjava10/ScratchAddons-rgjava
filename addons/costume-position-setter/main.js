export default async function ({ addon, console }) {
    // Create the input element for setting the X position
    const input = document.createElement("input");
    input.type = "number"; // Ensure the input accepts only numbers
    input.placeholder = "Set X Position"; // Placeholder text
    input.style.margin = "5px";
    input.style.padding = "5px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "3px";
    input.style.width = "120px";

    // Add an event listener for when the user changes the input value
    input.addEventListener("change", async () => {
        const xPos = parseFloat(input.value);
        if (!isNaN(xPos)) {
            // Use Scratch's internal VM to update the X position of the selected sprite
            const result = await addon.tab.runJavaScript(`
                (() => {
                    const vm = window.vm;
                    const target = vm.editingTarget;
                    if (target) {
                        target.x = ${xPos};
                        vm.runtime.requestRedraw();
                        return true;
                    }
                    return false;
                })();
            `);
            if (result) {
                console.log("X position updated to:", xPos);
            } else {
                console.error("No sprite selected or failed to update X position.");
            }
        } else {
            console.error("Invalid input for X position:", input.value);
        }
    });

    // Wait for the green flag to appear, then append the input box to the UI
    while (true) {
        await addon.tab.waitForElement("[class^='green-flag']", { markAsSeen: true });
        addon.tab.appendToSharedSpace({ space: "afterGreenFlag", element: input, order: 0 });
    }
}
