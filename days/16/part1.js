function parseExampleInstruction(example) {
  return example
    .replace(']', '')
    .replace('[', '')
    .replace(/,/g, '')
    .split(' ')
    .map(i => parseInt(i, 10));
}

function parseRawInstruction(instruction) {
  instruction = instruction.split(' ').map(i => parseInt(i, 10));
  let [opcode, a, b, c] = instruction;
  return { opcode, a, b, c };
}

function parseOpcodeExample(before, instruction, after) {
  return {
    before: parseExampleInstruction(before.slice(before.indexOf('['))),
    instruction: parseRawInstruction(instruction),
    after: parseExampleInstruction(after.slice(after.indexOf('[')))
  };
}
module.exports = async function main(lines) {
  let opcodeExamples = [];
  let rawInstructions = [];

  while (lines.length) {
    let line = lines.shift();
    if (line.startsWith('Before')) {
      opcodeExamples.push(
        parseOpcodeExample(line, lines.shift(), lines.shift())
      );
      lines.shift(); // each newline
    } else if (line.trim() === '') {
      lines.shift(); // eat 1 more newlines
      while (lines.length) {
        rawInstructions.push(parseRawInstruction(lines.shift()));
      }
    }
  }

  debugger;
};
