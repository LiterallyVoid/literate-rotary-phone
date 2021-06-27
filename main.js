class Letter extends HTMLElement {
    constructor(letter) {
        super();

        this.originalText = letter || '\u00a0';

        this.textContent = this.originalText;

        this.letter = letter;
        this.typed = null;
    }

    type(letter) {
        this.typed = letter;
        this.textContent = letter;
        if (this.typed === this.letter) {
            this.className = 'correct';
        } else {
            this.className = 'wrong';
        }
    }

    clear() {
        this.className = '';
        this.typed = null;
        this.textContent = this.originalText;
    }
}

class Word extends HTMLElement {
    constructor(text) {
        super();

        this.letters = [];
        for (const letter of text) {
            const el = new Letter(letter);
            this.letters.push(el);

            this.appendChild(el);
        }

        this.typed = 0;
    }

    forward(letter) {
        if (this.typed >= this.letters.length) {
            const el = new Letter(null);
            this.letters.push(el);
            this.appendChild(el);
        }

        this.letters[this.typed].type(letter);
        this.typed++;
    }

    back() {
        if (this.typed <= 0) return false;

        this.typed--;
        this.letters[this.typed].clear();
        if (this.letters[this.typed].letter === null) {
            this.removeChild(this.letters.pop());
        }

        return true;
    }

    focus() {
        this.className = 'typing';
    }

    complete() {
        this.className = 'complete';
    }

    clear() {
        this.className = '';
    }

    placeCursor(cursor) {
        if (this.typed < this.letters.length) {
            this.insertBefore(cursor, this.letters[this.typed]);
        } else {
            this.appendChild(cursor);
        }
    }
}

class InputBox extends HTMLElement {
    constructor() {
        super();

        this.oldScrollOffset = 0;
    }

    setup() {
        const computed = window.getComputedStyle(this);
        this.padding = parseInt(computed.getPropertyValue('padding-top'));
        this.lineHeight = parseInt(computed.getPropertyValue('line-height'));

        this.cursor = document.createElement('span');
        this.cursor.className = 'cursor';

        this.input = document.createElement('input');
        this.appendChild(this.input);
        this.input.className = 'hidden-input';

        this.wordsContainer = document.createElement('div');
        this.wordsContainer.className = 'words-container';
        this.appendChild(this.wordsContainer);

        this.addEventListener('focus', event => {
            this.cursor.className = 'cursor focus';
            this.input.focus();
        });

        this.input.addEventListener('blur', event => {
            this.cursor.className = 'cursor';
        });

        this.input.addEventListener('input', event => {
            this.type(event.target.value);
            event.target.value = '';
            this.scrollToCursor();
        });

        this.addEventListener('keydown', event => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }

            if (event.code == 'Backspace' || event.which == 8) {
                this.backspace();
                this.scrollToCursor();
            }
        });
    }

    scrollToCursor() {
        const cursor_rect = this.cursor.getBoundingClientRect();
        const words_rect = this.wordsContainer.getBoundingClientRect();

        const min = this.clientHeight - (this.padding * 2) - words_rect.height;

        let offset = (words_rect.top - cursor_rect.top) + this.lineHeight * 2 + 1;
        if (offset < min) {
            offset = min;
        }
        if (offset > 0) {
            offset = 0;
        }
        if (offset !== this.oldScrollOffset) {
            this.oldScrollOffset = offset;

            this.wordsContainer.style.marginTop = offset + 'px';
        }
    }

    setTarget(text) {
        while (this.wordsContainer.lastChild !== null) {
            this.wordsContainer.removeChild(this.wordsContainer.lastChild);
        }

        this.wordsContainer.appendChild(this.cursor);

        const words = text.split(' ');
        this.words = [];
        let i = 0;
        for (const word of words) {
            this.appendWord(word);

            i++;
        }
        this.currentWord = 0;

        this.words[this.currentWord].focus();
    }

    appendWord(text) {
        if (this.words.length > 0) {
            this.wordsContainer.appendChild(new Text(' '));
        }

        const el = new Word(text);
        this.wordsContainer.appendChild(el);
        this.words.push(el);
    }

    backspace() {
        if (!this.words[this.currentWord].back()) {
            if (this.currentWord > 0) {
                this.words[this.currentWord].clear();
                this.currentWord--;
                this.words[this.currentWord].focus();
            }
        }

        this.words[this.currentWord].placeCursor(this.cursor);
    }

    type(text) {
        for (const chr of text) {
            if (chr == ' ') {
                this.words[this.currentWord].complete();
                this.currentWord++;

                if (this.currentWord >= this.words.length) {
                    this.appendWord('');
                }

                this.words[this.currentWord].focus();
            } else {
                this.words[this.currentWord].forward(chr);
            }
        }

        this.words[this.currentWord].placeCursor(this.cursor);
    }
};

customElements.define('gz-inputbox', InputBox);
customElements.define('gz-word', Word);
customElements.define('gz-letter', Letter);

const words = [
    'allow',
    'array',
    'acquiesce',
    'acquire',
    'affect',
    'able',
    'apple',
    'artist',
    'arrest',
    'believe',
    'before',
    'between',
    'berry',
    'beneath',
    'back',
    'bear',
    'brew',
    'complete',
    'carry',
    'cascade',
    'carpet',
    'check',
    'concede',
    'concept',
    'create',
    'catch',
    'done',
    'door',
    'drain',
    'dimension',
    'diaspora',
    'dessicant',
    'disease',
    'desire',
    'define',
    'dormant',
    'effect',
    'epoxy',
    'ear',
    'element',
    'epilepsy',
    'eminent',
    'end',
    'front',
    'free',
    'forest',
    'foghorn',
    'fewer',
    'fender',
    'faster',
    'font',
    'fern',
    'graphic',
    'gone',
    'general',
    'generic',
    'gap',
    'gear',
    'grown',
    'great',
    'generate',
    'gyrate',
    'hare',
    'heat',
    'honest',
    'how',
    'here',
    'hollow',
    'home',
    'house',
    'insect',
    'irate',
    'integrate',
    'is',
    'iridescent',
    'iris',
    'jarring',
    'joke',
    'joking',
    'jam',
    'kestrel',
    'knife',
    'known',
    'knowledge',
    'knight',
    'knot',
    'knee',
    'lost',
    'lease',
    'lean',
    'lasting',
    'lever',
    'lore',
    'lull',
    'letter',
    'least',
    'log',
    'maintenance',
    'mast',
    'meat',
    'manner',
    'mop',
    'more',
    'mow',
    'mock',
    'meek',
    'mere',
    'main',
    'map',
    'nowhere',
    'none',
    'nesting',
    'neat',
    'near',
    'next',
    'oxygen',
    'onset',
    'ore',
    'open',
    'often',
    'periscope',
    'perigee',
    'pear',
    'pair',
    'pore',
    'pose',
    'post',
    'pester',
    'pan',
    'pen',
    'pencil',
    'quest',
    'question',
    'restore',
    'revive',
    'resurrect',
    'reappear',
    'rest',
    'rent',
    'raise',
    'raze',
    'roll',
    'rope',
    'sad',
    'shard',
    'seep',
    'shore',
    'sea',
    'swamp',
    'terrain',
    'trove',
    'treasure',
    'thesarus',
    'tome',
    'tear',
    'torn',
    'trip',
    'under',
    'unassuming',
    'unsent',
    'upwards',
    'victorious',
    'vent',
    'vest',
    'vole',
    'when',
    'weather',
    'wheat',
    'west',
    'wane',
    'wax',
    'yes',
    'yesterday',
    'zebra',
    'zest',
    'zeal',
];

function main() {
    const box = document.querySelector('#box');
    box.setup();
    const text = [];
    for (let i = 0; i < 500; i++) {
        text.push(words[Math.floor(Math.random() * words.length)]);
    }
    box.setTarget(text.join(' ') + ' you win!');
}
