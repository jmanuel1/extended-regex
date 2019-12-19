class ExtendedRegex {

  constructor(seq) {
    this._seq = seq;
  }

  _match(seq) {
    let inMatch = false,
      matchStart;
    let posInPattern = 0;
    for (let i = 0, item = seq[i]; i < seq.length; ++i, item = seq[i]) {
      if (this._seq[posInPattern] instanceof this.constructor.Quantifer) {
        if (this._seq[posInPattern].type === 'zeroOrMore') {
          matchStart = i; // since we change i
          // TODO: in JS, this would give back as needed
          let match;
          while (match = this.constructor._submatch(
            this._seq[posInPattern].group,
            seq.slice(i)
          )) {
            console.log(match.length);
            i += match.length;
          }
          i--;
        }
      } else if (this._seq[posInPattern] === this.constructor.BOI) {
        if (i !== 0) {
          inMatch = false;
          posInPattern = 0;
          matchStart = undefined;
          continue;
        }
        i--;
      } else if (item !== this._seq[posInPattern]) {
        inMatch = false;
        posInPattern = 0;
        matchStart = undefined;
        continue;
      }
      inMatch = true;
      matchStart = (matchStart === undefined)
        ? i
        : matchStart;
      posInPattern++;
      if (posInPattern >= this._seq.length) {
        return {
          length: i - matchStart + 1
        };
      }
    }
    return false;
  }

  match(seq) {
    return !!this._match(seq);
  }
}

ExtendedRegex.Quantifer = class {
  constructor(group, char) {
    this.type = {
      '*': 'zeroOrMore'
    }[char];
    this.group = group;
  }
};

ExtendedRegex.BOI = Symbol('ExtendedRegex.BOI'); // beginning of input

ExtendedRegex._submatch = function (pattern, seq) {
  return new ExtendedRegex(pattern)._match(seq);
}

function makeRegex(regex) {
  if (typeof regex === 'string')
    return new RegExp(regex);
  return new ExtendedRegex(regex);
}

const sequence = [
  0,
  8,
  'fgf',
  5,
  7.9,
  Symbol.iterator
];

const simplePattern = [0, 8, 'fgf'];
const zeroOrMore = [
  5,
  new ExtendedRegex.Quantifer([6], '*'),
  7.9
];
const beginningOfInput = [ExtendedRegex.BOI, 5, 7.9]; // false
let regex;

console.log('simple pattern');
regex = makeRegex(simplePattern);
console.log(regex.match(sequence));

console.log('zero or more');
regex = makeRegex(zeroOrMore);
console.log(regex.match(sequence));

console.log('beginning of input');
regex = makeRegex(beginningOfInput);
console.log(regex.match(sequence));
