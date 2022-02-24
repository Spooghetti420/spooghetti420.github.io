const argumentInstructionPattern = new RegExp("(" + Object.keys(instructions).join("|") + ") +(#?\\d+)", "i");
const argumentlessInstructionPattern = new RegExp("(" + Object.keys(instructions).join("|") + ")")
function parseAssembly()
{
    const command = document.querySelector("#prompt").value;
    let match = argumentInstructionPattern.exec(command) ?? argumentlessInstructionPattern.exec(command);
    if (!match)
    {
        showError();
        return;
    }
    
    const opcode = match[1];

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
