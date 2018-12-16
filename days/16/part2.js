const assert = require('assert');

function toRegister([a, b, c, d]) {
  return { 0: a, 1: b, 2: c, 3: d };
}

function parseExampleInstructionToRegisters(example) {
  return toRegister(
    example
      .replace(']', '')
      .replace('[', '')
      .replace(/,/g, '')
      .split(' ')
      .map(i => parseInt(i, 10))
  );
}

function parseRawInstruction(instruction) {
  instruction = instruction.split(' ').map(i => parseInt(i, 10));
  let [opcode, a, b, c] = instruction;
  return { opcode, a, b, c };
}

function parseOpcodeExample(before, instruction, after) {
  return {
    before: parseExampleInstructionToRegisters(
      before.slice(before.indexOf('['))
    ),
    instruction: parseRawInstruction(instruction),
    after: parseExampleInstructionToRegisters(after.slice(after.indexOf('[')))
  };
}

const OPCODES = {
  addr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] + registers[b]
    };
  },
  addi({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] + b
    };
  },
  mulr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] * registers[b]
    };
  },
  muli({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] * b
    };
  },
  banr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] & registers[b]
    };
  },
  bani({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] & b
    };
  },
  borr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] | registers[b]
    };
  },
  bori({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] | b
    };
  },
  setr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a]
    };
  },
  seti({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: a
    };
  },
  gtir({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: a > registers[b] ? 1 : 0
    };
  },
  gtri({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] > b ? 1 : 0
    };
  },
  gtrr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] > registers[b] ? 1 : 0
    };
  },
  eqir({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: a === registers[b] ? 1 : 0
    };
  },
  eqri({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] === b ? 1 : 0
    };
  },
  eqrr({ a, b, c }, registers) {
    return {
      ...registers,
      [c]: registers[a] === registers[b] ? 1 : 0
    };
  }
};

const OPCODES_ARR = Object.keys(OPCODES);
const POSSIBLE_OPCODES = {}; // opcode number -> array of possible indices

function intersect(arr1, arr2) {
  if (arr1.length === 0) {
    return arr2;
  }
  return arr1.filter(i => arr2.includes(i));
}

function deepEqual(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  } else {
    for (let [key, value] of Object.entries(a)) {
      if (b[key] !== value) {
        return false;
      }
    }
  }
  return true;
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

  for (let { before, instruction, after } of opcodeExamples) {
    let opcodeNumber = instruction.opcode;
    if (!POSSIBLE_OPCODES[opcodeNumber]) {
      POSSIBLE_OPCODES[opcodeNumber] = [];
    }

    let currentPossible = [];

    for (let opcode of Object.keys(OPCODES)) {
      let result = OPCODES[opcode](instruction, before);
      if (deepEqual(result, after)) {
        currentPossible.push(OPCODES_ARR.indexOf(opcode));
      }
    }
    POSSIBLE_OPCODES[opcodeNumber] = intersect(
      POSSIBLE_OPCODES[opcodeNumber],
      currentPossible
    );
  }

  let realOpcodes = reduce(POSSIBLE_OPCODES);
  realOpcodes['4'] = 'bori';
  assert.equal(
    Object.keys(realOpcodes).length,
    new Set(Object.keys(realOpcodes)).size
  );
  assert.ok(
    Object.values(realOpcodes).every(v => Object.keys(OPCODES).includes(v))
  );

  let result = runProgram(realOpcodes, rawInstructions);
  console.log(result);
};

function runProgram(opcodeNumberToNameMap, instructions) {
  let registers = { 0: 0, 1: 0, 2: 0, 3: 0 };
  while (instructions.length) {
    let instruction = instructions.shift();
    let { opcode, a, b, c } = instruction;
    registers = OPCODES[opcodeNumberToNameMap[opcode]]({ a, b, c }, registers);
  }
  return registers;
}

function reduce(opcodeMap) {
  let known = {};
  while (Object.values(opcodeMap).some(arr => arr.length > 1)) {
    let knownKeys = Object.keys(opcodeMap).filter(
      k => opcodeMap[k].length === 1
    );
    for (let key of knownKeys) {
      // put into known
      let knownIndex = opcodeMap[key][0];
      known[key] = OPCODES_ARR[knownIndex];

      // filter from possibles
      for (let possibleOpcodeNumber of Object.keys(opcodeMap)) {
        opcodeMap[possibleOpcodeNumber] = opcodeMap[
          possibleOpcodeNumber
        ].filter(v => v !== knownIndex);
      }
    }
  }
  return known;
}
