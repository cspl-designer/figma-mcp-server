// test_parser.js
const { parseFigmaNode, getGenerationQueue } = require('../lib/parser');

// 1. Mock Data: This represents a "Calendar" frame containing a "DayCell" instance
const mockFigmaNode = {
    name: "Calendar",
    type: "FRAME",
    absoluteBoundingBox: { x: 0, y: 0, width: 300, height: 300 },
    layoutMode: "VERTICAL",
    children: [
        {
            name: "Header", // Just a frame
            type: "FRAME",
            children: [{ type: "TEXT", characters: "July 2024" }]
        },
        {
            name: "DayGrid", // Auto Layout Grid
            type: "FRAME",
            layoutMode: "HORIZONTAL",
            children: [
                {
                    name: "DayCell", // THIS IS THE KEY TEST
                    type: "INSTANCE",
                    mainComponent: { name: "DayCell", id: "123:456" },
                    componentProperties: { "State#1:1": { type: "VARIANT", value: "Selected" } }
                }
            ]
        }
    ]
};

console.log("--- RUNNING PARSER TEST ---");
const output = parseFigmaNode(mockFigmaNode);

console.log("\n1. STRUCTURED JSON OUTPUT:");
console.log(JSON.stringify(output, null, 2));

console.log("\n2. GENERATION QUEUE (Should contain 'DayCell'):");
console.log(getGenerationQueue());