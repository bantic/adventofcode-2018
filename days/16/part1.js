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

for (let opcode of ['mulr', 'addi', 'seti']) {
  assert.deepEqual(
    OPCODES[opcode]({ a: 2, b: 1, c: 2 }, { 0: 3, 1: 2, 2: 1, 3: 1 }),
    {
      0: 3,
      1: 2,
      2: 2,
      3: 1
    }
  );
}

for (let opcode of Object.keys(OPCODES)) {
  if (['mulr', 'addi', 'seti'].includes(opcode)) {
    continue;
  }
  assert.notDeepEqual(
    OPCODES[opcode]({ a: 2, b: 1, c: 2 }, { 0: 3, 1: 2, 2: 1, 3: 1 }),
    {
      0: 3,
      1: 2,
      2: 2,
      3: 1
    }
  );
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

assert.ok(deepEqual({}, {}));
assert.ok(deepEqual({ a: 1 }, { a: 1 }));
assert.ok(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));
debugger;
assert.ok(!deepEqual({ a: 2, b: 2 }, { b: 2, a: 1 }));

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

  let hasThree = 0;
  let idx = 0;
  for (let { before, instruction, after } of opcodeExamples) {
    let count = 0;
    for (let opcode of Object.keys(OPCODES)) {
      let result = OPCODES[opcode](instruction, before);
      if (deepEqual(result, after)) {
        count++;
      }
      if (!deepEqual(result, after)) {
        console.log(
          idx,
          opcode,
          [before['0'], before['1'], before['2'], before['3']],
          {
            a: instruction.a,
            b: instruction.b,
            c: instruction.c
          },
          [after['0'], after['1'], after['2'], after['3']],
          [result['0'], result['1'], result['2'], result['3']]
        );
      }
    }
    if (count >= 3) {
      hasThree++;
    }
    idx++;
  }

  console.log(hasThree);
};
