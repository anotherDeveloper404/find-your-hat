const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const dir = [[0, 1], [0, -1], [1, 0], [-1, 0]];

class Field {
    constructor(field) {
        this._field = field;
        this._locationX = 0;
        this._locationY = 0;
        this._field[0][0] = pathCharacter;
    }

    runGame() {
        let playing = true;
        while (playing) {
            this.print();
            this.askQuestion();
            if (!this.isInBounds()) {
                console.log('Out of bounds instruction!');
                playing = false;
                break;
            } else if (this.isHole()) {
                console.log('Sorry, you fell down a hole!');
                playing = false;
                break;
            } else if (this.isHat()) {
                console.log('Congrats, you found your hat!');
                playing = false;
                break;
            }
            this._field[this._locationY][this._locationX] = pathCharacter;
        }
    }

    askQuestion() {
        const answer = prompt('Which way? ').toUpperCase();
        switch (answer) {
            case 'W':
                this._locationY -= 1;
                break;
            case 'S':
                this._locationY += 1;
                break;
            case 'A':
                this._locationX -= 1;
                break;
            case 'D':
                this._locationX += 1;
                break;
            default:
                console.log('Enter W, A, S or D.');
                this.askQuestion();
                break;
        }
    }

    isInBounds() {
        return (
            this._locationY >= 0 &&
            this._locationX >= 0 &&
            this._locationY < this._field.length &&
            this._locationX < this._field[0].length
        );
    }

    isHat() {
        return this._field[this._locationY][this._locationX] === hat;
    }

    isHole() {
        return this._field[this._locationY][this._locationX] === hole;
    }

    print() {
        // Iterate through each row and join the elements together.
        const displayString = this._field.map(row => {
            return row.join('');
        }).join('\n'); // Then join the rows on a newline to print on multiple lines.
        console.log(displayString);
    }

    static generateField(height, width, percentage = 0.1) {
        const field = new Array(height).fill(0).map(el => new Array(width));
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const prob = Math.random();
                field[y][x] = prob > percentage ? fieldCharacter : hole;
            }
        }
        // Set the "hat" location
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
        // Make sure the "hat" is not at the starting point
        while (hatLocation.x === 0 && hatLocation.y === 0) {
            hatLocation.x = Math.floor(Math.random() * width);
            hatLocation.y = Math.floor(Math.random() * height);
        }
        field[hatLocation.y][hatLocation.x] = hat;
        if(!this.validateField(field)) {
            console.log('Invalid field, generating new field...');
            return this.generateField(height, width, percentage);
        }
        console.log('Valid field!');
        return field;
    }

    // Validate the field to make sure there is a path from the starting point to the hat.
    static validateField(field) {
        const seen = [];
        const path = [];

        for (let i = 0; i < field.length; i++) {
            seen.push(new Array(field[0].length).fill(false));
        }

        this.walk(field, {x: 0, y: 0}, seen, path);
        console.log(path);
        return path.length !== 0;
    }

    // Walk the field using recursion.
    static walk(field, curr, seen, path) {
        if(curr.x < 0 || curr.y < 0 || curr.x >= field[0].length || curr.y >= field.length) {
            return false;
        } 
        
        if(field[curr.y][curr.x] === hole) {
            return false;
        }

        if(field[curr.y][curr.x] === hat) {
            path.push(curr);
            return true;
        }

        if(seen[curr.y][curr.x]) {
            return false;
        }

        // 3 steps of recursion
        // Pre - mark the current cell as seen and add it to the path
        seen[curr.y][curr.x] = true;
        path.push(curr);

        // Recursion - try all 4 directions
        for(let i = 0; i < dir.length; i++) {
            const [x, y] = dir[i];
            if(this.walk(field, {x: curr.x + x, y: curr.y + y}, seen, path)) {
                return true;
            }
        }

        // Post - Remove the current cell from the path.
        path.pop();
    }

}

// Create a new instance of the Field class, using the static method "generateField" to generate the field.
const myfield = new Field(Field.generateField(10, 10, 0.2));
// Call the "runGame" method on the new field instance.
myfield.runGame();
