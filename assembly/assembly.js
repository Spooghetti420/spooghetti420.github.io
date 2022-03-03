const argumentInstructionPattern = new RegExp("(" + Object.keys(instructions).join("|") + ") +(#?\\d+)", "i");
const argumentlessInstructionPattern = new RegExp("(" + Object.keys(instructions).join("|") + ")", "i")
function interpretAssembly()
{
    const command = document.querySelector("#prompt").value;
    let match = argumentInstructionPattern.exec(command) ?? argumentlessInstructionPattern.exec(command);
    if (!match)
    {
        showError();
        return;
    }
    
    const opcode = match[1].toLowerCase();

    document.querySelector("#invalid").hidden = true;
    if (match[2])
    {
        // All instructions that take an argument
        if (instructions[opcode].instruction.length !== 1)
        {
            showError();
            return;
        }
        const operand = parseInt(match[2].startsWith("#") ? match[2].slice(1) : getMemory(match[2]));
        instructions[opcode].instruction(operand); // Run the correct instruction with the operand given
    } else {
        // All instructions that don't take an argument
        if (instructions[opcode].instruction.length !== 0)
        {
            showError();
            return;
        }
        instructions[opcode].instruction();
    }

    document.querySelector("#prompt").value = "";
    return false;

}

function nextInstruction() {
    const pc = programCounter();
    programCounter(pc + 1);
    const instruction = getMemory(pc);
    const opcodeNumeric = parseInt(instruction.slice(0, 1));
    const operand = instruction.slice(1, 3);
    const operations = ["hlt", "add", "sub", "sta", "nop", "lda", "bra", "brz", "brp"];
    const opcode = (opcodeNumeric < 9) ? operations[opcodeNumeric] : ((operand === "01") ? "inp" : "out");
    instructions[opcode].instruction(parseInt(operand));
    return opcode === "hlt";
}

function runProgram() 
{
    programCounter(0);
    document.querySelector("#output").innerHTML = "";
    let halt = false;
    while (!halt) {
        halt = nextInstruction();
    }
}

function assembleProgram()
{
    const textarea = document.querySelector("#assemblyBox");
    const sourceCode = textarea.value;
    const variablePattern = /(\w+)\s+dat(\s+\d+)?/gi;
    const variables = {};
    do {
        m = variablePattern.exec(sourceCode);
        if (m) {
            const index = 99-Object.keys(variables).length;
            variables[m[1]] = index;
            setMemory(index, (m[2]?.replace(/\s/, "") ?? "000").padStart(3, "0"));
        }
    } while (m);
    const instructionSource = sourceCode.replace(variablePattern, ""); // Removes all variable declarations from the source

    const instructionPattern = /(add|sub|lda|sta|brp|brz|bra)\s+(#?[\d\w]+)|(hlt|inp|out)|(\w+)/gi;
    const program = [];
    const labels = {};
    do {
        m = instructionPattern.exec(instructionSource);
        if (m) {
            program.push(m);
        }
    } while (m);

    const machineCode = [];

    function resolveVariableOrValue(value) {
        if (variables.hasOwnProperty(value)) {
            return variables[value].toString().padStart(2, "0");
        } else {
            return value;
        }
    }

    function resolveBranch(label) {
        if (labels.hasOwnProperty(label))
        {
            return labels[label].toString().padStart(2, "0");
        }
        return false;
    }

    let i = 0;
    for (const item of program)
    {
        switch(item[1]?.toLowerCase())
        {
            case "brp":
                if (resolveBranch(item[2]))
                    setMemory(i, "8" + resolveBranch(item[2]));
                else
                    setMemory(i, "8 " + item[2]);
                break;
            case "brz":
                if (resolveBranch(item[2]))
                    setMemory(i, "7" + resolveBranch(item[2]));
                else
                    setMemory(i, "7 " + item[2]);
                break;
            case "bra":
                if (resolveBranch(item[2]))
                    setMemory(i, "6" + resolveBranch(item[2]));
                else
                    setMemory(i, "6 " + item[2]); 
                break;
            case "add":
                setMemory(i, "1" + resolveVariableOrValue(item[2]));
                break;
            case "sub":
                setMemory(i, "2" + resolveVariableOrValue(item[2]));
                break;
            case "sta":
                setMemory(i, "3" + resolveVariableOrValue(item[2]));
                break;
            case "lda":
                setMemory(i, "5" + resolveVariableOrValue(item[2]));
                break;
            default:
                break;
        }
        switch (item[3]?.toLowerCase())
        {
            case "inp":
                setMemory(i, "901");
                break;
            case "out":
                setMemory(i, "902");
                break;
            case "hlt":
                setMemory(i, "000");
                break;
            default:
                break;
        }
        if (item[4]) {
            labels[item[4]] = i;
        } else {
            i++;
        }
    }
    for (let i = 0; i < 100; i++) {
        const cell = getMemory(i).split(" ");
        if (labels.hasOwnProperty(cell[1]))
        {
            setMemory(i, cell[0] + labels[cell[1]])
        }
    }
}