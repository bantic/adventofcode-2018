const assert = require('assert');

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

function toArray(registers) {
  return [
    registers[0],
    registers[1],
    registers[2],
    registers[3],
    registers[4],
    registers[5]
  ];
}

function step({ ip, ipRegisterIdx, instructions, registers }) {
  debugger;
  let inst = instructions[ip];
  if (!inst) {
    console.log(registers);
    throw 'No instruction';
  }
  let afterRegisters = OPCODES[inst.opcode](inst, registers);

  // console.log(
  //   `ip=${ip} [${toArray(registers).join(', ')}] ${inst.opcode} ${inst.a} ${
  //     inst.b
  //   } ${inst.c} [${toArray(afterRegisters).join(', ')}]`
  // );

  return {
    ip: registers[ipRegisterIdx],
    ipRegisterIdx,
    instructions,
    registers: afterRegisters
  };
}

module.exports = async function main(lines) {
  let ipRegisterIdx = 3;
  let ip = 0;
  let registers = {
    0: 1,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  lines.shift(); // eat the #ip 3
  let instructions = lines.map(line => {
    let [opcode, a, b, c] = line.split(' ');
    [a, b, c] = [a, b, c].map(x => parseInt(x, 10));
    return { opcode, a, b, c };
  });

  let vm = { ip, registers, instructions, ipRegisterIdx };

  while (true) {
    vm = step(vm);
    vm.ip = vm.registers[vm.ipRegisterIdx] + 1;
    vm.registers[vm.ipRegisterIdx] = vm.ip;
  }
};
