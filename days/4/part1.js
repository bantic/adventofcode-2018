function toEntry(line) {
  let timestampRegex = /\[(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})\]/;
  let match = timestampRegex.exec(line);
  if (!match) {
    throw new Error(`Failed to parse ${line}`);
  }
  let [, year, month, day, hour, minute] = match;
  [year, month, day, hour, minute] = [year, month, day, hour, minute].map(x =>
    parseInt(x, 10)
  );
  let guardId = null;
  let state = null;
  if (line.includes('Guard')) {
    let guardRegex = /Guard #(\d+)/;
    let match = guardRegex.exec(line);
    if (!match) {
      throw new Error(`Failed to parse guard id from ${line}`);
    }
    guardId = parseInt(match[1], 10);
    state = 'start';
  } else if (line.includes('falls asleep')) {
    state = 'sleep';
  } else if (line.includes('wakes up')) {
    state = 'wake';
  } else {
    throw new Error(`Could not determine state from ${line}`);
  }

  return {
    guardId,
    year,
    month,
    day,
    hour,
    minute,
    state
  };
}

function sortEntries(entries) {
  return entries.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year < b.year ? -1 : 1;
    } else if (a.month !== b.month) {
      return a.month < b.month ? -1 : 1;
    } else if (a.day !== b.day) {
      return a.day < b.day ? -1 : 1;
    } else if (a.hour !== b.hour) {
      return a.hour < b.hour ? -1 : 1;
    } else {
      return a.minute < b.minute ? -1 : a.minute > b.minute ? 1 : 0;
    }
  });
}

function timeBetween(a, b) {
  if (a.year !== b.year || a.month !== b.month || a.day !== b.day) {
    throw new Error(`Expected timeBetween to receive same day`);
  }
  if (b.minute < a.minute) {
    throw new Error(`Got negative time for timeBetween`);
  }
  return b.minute - a.minute;
}

function sleepPerGuard(entries) {
  let guards = {};
  let curGuardId;
  let sleepStart;

  entries.forEach(({ guardId, state, year, month, hour, day, minute }) => {
    if (guardId) {
      curGuardId = guardId;
      if (!guards[curGuardId]) {
        guards[curGuardId] = { total: 0, minutes: {} };
      }
    }
    if (state === 'sleep') {
      if (hour !== 0) {
        throw new Error(`Expected sleep to be during midnight`);
      }
      sleepStart = { year, month, hour, day, minute };
    } else if (state === 'wake') {
      guards[curGuardId].total += timeBetween(sleepStart, {
        year,
        month,
        hour,
        day,
        minute
      });
      for (let m = sleepStart.minute; m < minute; m++) {
        if (!guards[curGuardId].minutes[m]) {
          guards[curGuardId].minutes[m] = 0;
        }
        guards[curGuardId].minutes[m] += 1;
      }
    }
  });
  return guards;
}

module.exports = async function(lines) {
  let entries = lines.map(toEntry);
  entries = sortEntries(entries);
  let sleep = sleepPerGuard(entries);
  let maxSleepGuard = null;
  let maxSleepAmount = 0;
  Object.keys(sleep).forEach(guardId => {
    if (sleep[guardId].total > maxSleepAmount) {
      maxSleepGuard = guardId;
      maxSleepAmount = sleep[guardId].total;
    }
  });
  let minutes = sleep[maxSleepGuard].minutes;
  let maxMinute = null;
  let maxMinuteOccurrence = 0;
  Object.keys(minutes).forEach(minute => {
    let amount = minutes[minute];
    if (amount > maxMinuteOccurrence) {
      maxMinuteOccurrence = amount;
      maxMinute = minute;
    }
  });
  console.log(maxSleepGuard, maxSleepAmount, maxMinute, maxMinuteOccurrence);
};
