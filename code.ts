// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
const url =
  "https://www.wix-style-react.com/?path=/story/components-api-components--table";
const desc =
  "I could not find API letting to insert components Documentation Link";

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(256, 387); // 16px is the scrollbar

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
async function loadFont() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
}
loadFont();

figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.

  const cellData = msg.inputText
    .split("\n")
    .map((row: string) => row.split("\t"));

  if (msg.type === "create-table") {
    const nodes: SceneNode[] = [];
    const component = figma.createComponent();
    const width = 600;
    component.layoutMode = "VERTICAL";
    component.description = url;

    for (let i = 0; i < msg.countRows; i++) {
      const rowId = i;
      const row = figma.createFrame();
      const fontSize = 16;
      const lineHeight = 24;
      const verPadding = 12;
      const horPadding = 24;
      const gutter = 18;
      const rowHeight = lineHeight + 2 * verPadding;
      component.appendChild(row);
      component.resize(width, (i + 1) * rowHeight);
      row.name = "Table row";
      row.layoutMode = "HORIZONTAL";
      row.counterAxisSizingMode = "AUTO";
      row.counterAxisAlignItems = "CENTER";
      row.resize(width, row.height);
      row.layoutAlign = "STRETCH";
      row.itemSpacing = gutter;
      row.paddingLeft = horPadding;
      row.paddingRight = horPadding;
      row.paddingTop = verPadding;
      row.paddingBottom = verPadding;
      row.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
      if (i > 0) {
        row.effects = [
          {
            type: "INNER_SHADOW",
            radius: 0,
            offset: { y: 1, x: 0 },
            color: { r: 0, g: 0, b: 0, a: 1 },
            visible: true,
            blendMode: "NORMAL",
          },
        ];
      }

      for (let i = 0; i < msg.countCols; i++) {
        const colId = i;
        const cell = figma.createText();
        cell.layoutGrow = 1;
        if (cellData?.[rowId]?.[colId]) {
          cell.insertCharacters(0, cellData[rowId][colId]);
        } else {
          cell.insertCharacters(0, "");
        }
        cell.fontSize = fontSize;
        cell.lineHeight = { value: lineHeight, unit: "PIXELS" };
        row.insertChild(i, cell);
      }

      //      figma.currentPage.appendChild(row);
      nodes.push(component);
    }
    component.primaryAxisSizingMode = "AUTO";
    component.counterAxisSizingMode = "FIXED";
    //component.layoutGrow = 1;
    //component.layoutAlign = 'STRETCH';
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
