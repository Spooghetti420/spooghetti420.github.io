const instructions = {
    "add": {
        name: "Add",
        instruction: (value) => { accumulator(accumulator() + value) },
        info: "Adds the operand to the accumulator."
    },

    "sub": {
        name: "Subtract",
        instruction: (value) => { accumulator(accumulator() - value) },
        info: "Subtracts the operand from the accumulator."
        
    },
    "lda": {
        name: "Load",
        instruction: (value) => { accumulator(value) },
        info: "Loads the value in memory at the operand into the accumulator. Best used with immediate addressing (#)."
    },
    
    "sto": {
        name: "Store",
        instruction: (value) => { setMemory(value, accumulator())},
        info: "Stores the accumulator to the value in memory specified by the operand. Best used with immediate addressing (#)."
    },

    "lft": {
        name: "Left bit shift",
        instruction: (value) => { accumulator(accumulator() >> value)},
        info: "Shifts the binary representation of the accumulator to the left as many places as stated in the operand."
    },

    "rht": {
        name: "Right bit shift",
        instruction: (value) => { accumulator(accumulator() << value)},
        info: "Shifts the binary representation of the accumulator to the right as many places as stated in the operand."
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
    }
}

function accumulator(value)
{
    const acc = document.querySelector("#accumulator");
    if (value)
    {
        acc.textContent = value;
    } else
    {
        return parseInt(acc.textContent);
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