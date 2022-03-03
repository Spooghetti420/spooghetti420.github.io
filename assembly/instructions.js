const instructions = {
    "add": {
        name: "Add",
        instruction: (value) => { accumulator(accumulator() + parseInt(getMemory(value))) },
        info: "Adds the operand to the accumulator."
    },

    "sub": {
        name: "Subtract",
        instruction: (value) => { accumulator(parseInt(accumulator()) - parseInt(getMemory(value))) },
        info: "Subtracts the operand from the accumulator."
        
    },
    "lda": {
        name: "Load",
        instruction: (value) => { accumulator(getMemory(value)) },
        info: "Loads the value in memory at the operand into the accumulator. Best used with immediate addressing (#)."
    },
    
    "sta": {
        name: "Store",
        instruction: (value) => { setMemory(value, accumulator())},
        info: "Stores the accumulator to the value in memory specified by the operand. Best used with immediate addressing (#)."
    },

    "inp": {
        name: "Input",
        instruction: () => { accumulator(parseInt(p = prompt("Enter a value: ")) ? parseInt(p) : showError() ?? 0)},
        info: "Prompts the user for a numerical input, storing it into the accumulator."
    },

    "out": {
        name: "Output",
        instruction: () => { log(accumulator())},
        info: "Outputs the value of the accumulator."
    },
    "bra": {
        name: "Branch always",
        instruction: (value) => { programCounter(value) },
        info: "Sets the value of the program counter to the input."
    },
    "brp": {
        name: "Branch if positive or zero",
        instruction: (value) => { if(accumulator() >= 0 ) { programCounter(value) } },
        info: "Sets the value of the program counter to the input, only if the accumulator is positive or zero."
    },
    "brz": {
        name: "Branch if zero",
        instruction: (value) => { if(accumulator() === 0 ) { programCounter(value) } },
        info: "Sets the value of the program counter to the input, only if the accumulator is zero."
    },
    "hlt": {
        name: "Halt",
        instruction: () => {},
        info: "Halts the CPU. Has no effect when used from the command prompt."
    }
    

}

function accumulator(value)
{
    const acc = document.querySelector("#accumulator");
    if (value || value === 0)
    {
        acc.textContent = value;
    } else
    {
        return parseInt(acc.textContent);
    }
}

function programCounter(value)
{
    const pc = document.querySelector("#programCounter");
    if (value || value === 0)
    {
        pc.textContent = value;
    } else
    {
        return parseInt(pc.textContent);
    }
}

function memCell(index)
{
    const tableWidth = document.querySelector("#memory").tBodies[0].children[0].children.length;
    let i = index % tableWidth;
    let j = Math.floor(index / tableWidth);
    return document.querySelector("#memory").tBodies[0].children[j].children[i];
}

function getMemory(index)
{
    return memCell(index).textContent;
}

function setMemory(index, value)
{
    memCell(index).innerText = value;
}

function log(something)
{
    const span = document.createElement("span");
    span.textContent = something;
    document.querySelector("#output").appendChild(span);
    document.querySelector("#output").appendChild(document.createElement("br"))

}

function showError()
{
    document.querySelector("#invalid").hidden = false;
}