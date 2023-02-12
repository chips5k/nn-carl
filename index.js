

const generateNN = () => {
    return [
        {
            layer: 'input',
            neurons: [
                { value: null },
                { value: null },
                { value: null },
                { value: null }
            ],
            processed: false
        },
        {
            layer: 'hidden-1',
            neurons: [
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 },
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 },
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 },
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 }
            ],
            processed: false
        },
        {
            layer: 'output',
            neurons: [
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 },
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 },
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 },
                { weights: [0, 0, 0, 0], bias: 0.1, value: null, threshold: 1 }
            ],
            processed: false
        }
    ]
};


const learn = (nn, inputs) => {
    //populate the input layet with inputs
    nn[0].neurons.forEach((n, i) => {   
        n.value = inputs[i];
    });

    nn[0].processed = true;

    
    //loop over each layer
    nn.forEach(layer => {
         // if layer already activated, skip it
         if(!layer.processed) {
            layer.forEach((neuron, i) => {
                console.log(neuron, i);
            });
        }
    });
}

const BOARD_MAX_X = 25;
const BOARD_MAX_Y = 10;


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const objectA = { label: 'A', x: 0, y: 0 };
const objectB = { label: 'B', x: 1, y: 0 };

objects = [objectA, objectB];

const reset = () => {
    objectA.x = 0;
    objectA.y = 0;
    objectB.x = 1;
    objectB.y = 0;
};

const render = () => {
    let string = ''
    for (y = 0; y <= BOARD_MAX_Y; y++) {
        for (x = 0; x <= BOARD_MAX_X; x++) {
            objectString = '-';
            for (object of objects) {
                if (object.x === x && object.y === y) {
                    objectString = object.label
                }
            }
            string += ' ' + objectString
        }
        string += '\n'
    }
    return string;
}

const colliding = (object, otherObjects) => {
    if (object.x <= 0 || object.x >= BOARD_MAX_X) {
        return true;
    }

    if (object.y <= 0 || object.y >= BOARD_MAX_Y) {
        return true;
    }

    for (oo in otherObjects) {
        if (oo.x === object.x && oo.y === object.y) {
            return true;
        }
    }
}

const update = () => {
    const aX = 1;
    const aY = 0;

    // if (colliding(objectA, [objectB])) {
    //     throw new Error('Collision detected');
    // }

    objectA.x += aX;
    objectA.y += aY


};

const end = Date.now() + 5 * 1000;

const loop = async () => {
    while (Date.now() <= end) {
        try {
            update();
        } catch (e) {
            reset();
        }
        console.clear();
        console.log('\n');
        console.log(render());
        await delay(100) /// waiting 1 second.
    }
}

loop();


