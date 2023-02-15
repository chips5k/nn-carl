


const generateNN = () => {

    return [
        {
            layer: 'input',
            neurons: [
                { value: 0, activated: true },
                { value: 0, activated: true },
                { value: 0, activated: true },
                { value: 0, activated: true }
            ],
            processed: false
        },
        {
            layer: 'hidden-1',
            neurons: [
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false },
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false },
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false },
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false }
            ],
            processed: false
        },
        {
            layer: 'output',
            neurons: [
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false },
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false },
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false },
                { weights: [Math.random(), Math.random(), Math.random(), Math.random()], bias: 0.1, value: 0, threshold: 1, activated: false }
            ],
            processed: false
        }
    ]
};


const determineOutputs = (nn, inputs) => {
    //populate the input layer with inputs
    nn[0].neurons.forEach((n, i) => {
        n.value = inputs[i];
        n.activated = true;
    });

    nn[0].processed = true;

    //loop over each layer
    nn.forEach((layer, layerIndex) => {
        if (!layer.processed) {
            const prevLayer = nn[layerIndex - 1];
            layer.neurons.forEach((neuron) => {
                const sum = prevLayer.neurons.reduce((acc, pn, pni) => {
                    //if (pn.activated) {
                        return acc + pn.value * neuron.weights[pni];
                    //}
                    return acc;
                }, neuron.bias);
                neuron.value = sum;
                console.log({ sum, threshold: neuron.threshold, active: neuron.value > neuron.threshold });
                neuron.activated = neuron.value > neuron.threshold
            });
        }
    });
    return nn[nn.length - 1].neurons.map(n => n.activated ? 1 : 0);
}

const BOARD_MAX_X = 25;
const BOARD_MAX_Y = 10;


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const objectA = { label: 'A', x: 0, y: 0 };
const objectB = { label: 'B', x: 0, y: 0 };

objects = [objectA, objectB];

const reset = () => {
    objectA.x = 0;
    objectA.y = 0;
    objectB.x = 8;
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

const getBoundaryCollisions = (object) => {


    const collisions = [
        false, // - y
        false, // - x
        false, // + y
        false // + x
    ];

    if (object[0] < 0) {
        collisions[1] = true;
    }

    if (object[0] > BOARD_MAX_X) {
        collisions[3] = true;
    }

    if (object[1] < 0) {
        collisions[0] = true;
    }

    if (object[1] > BOARD_MAX_Y) {
        collisions[2] = true;
    }

    return collisions;
}

const getObjectCollisions = (prevPosition, newPosition, object) => {

    const collisions = [
        false, // - y
        false, // - x
        false, // + y
        false // + x
    ];

    // First verify they are colliding with new positions
    if (newPosition[0] === object[0] && newPosition[1] === object[1]) {
        // Next determine what movement caused the collision

    }

    return collisions;
}

const nn = generateNN();

const determineInputs = () => {

    const forwardX = objectA.x + 1;
    const backwardX = objectA.x - 1;
    const forwardY = objectA.y + 1;
    const backwardY = objectA.y - 1;

    const inputs = [0, 0, 0, 0];

    if (backwardY >= 0) {
        inputs[0] = 1;
    }

    if (forwardX >= BOARD_MAX_X) {
        inputs[1] = 1;
    }

    if (forwardY <= BOARD_MAX_Y) {
        inputs[2] = 1
    }

    if (backwardX <= 0) {
        inputs[3] = 1;
    }

    return inputs;
}

const backProp = (weights) => {
    // input/output format = [
        //     0, // - y
        //     0, // - x
        //     0, // + y
        //     0 // + x
        // ];
    // iterate from bottom to top starting with the outputs
    nn[2].neurons.forEach((n, i) => {
        n.weights.forEach((w, wi) => {
            // TODO in future use the current neuron weights to determine how much they should each be modified 
            // rather than a blanket change
            //console.log(n.weights[wi], weights[i], weights[i] / 4)
            n.weights[wi] += (weights[i] / 4);
            //console.log(n.weights);
            n.value = 0;
            n.activated = false;
        });
    });

    // TODO propagate to the hidden layer.
}

const loop = async () => {

    reset();
    while (true) {
        console.clear();
        console.log('\n');
        console.log(render());

        // input/output format = [
        //     0, // - y
        //     0, // - x
        //     0, // + y
        //     0 // + x
        // ];

        const inputs = determineInputs();
        const outputs = determineOutputs(nn, inputs);
        const currentCoords = [objectA.x, objectA.y]
        console.log({ outputs })

        const aX = outputs[1] + -outputs[3];
        const aY = outputs[0] + -outputs[2];
        console.log({aX, aY});
        objectA.x += aX;
        objectA.y += aY
        console.log({objectA});
        const newCoords = [objectA.x, objectA.y];

        const weights = [0,0,0,0];
        const change = {
            x: newCoords[0] - currentCoords[0],
            y: newCoords[1] - currentCoords[1]
        };

        console.log({change});

        const direction = [
            change.x !== 0 ? change.x < 0 ? 'Backward' : 'Forward' : 'None',
            change.y !== 0 ? change.y > 0 ? 'Downward' : 'Upward' : 'None'
        ];
        
        console.log({direction});
        if (direction[0] === 'Backward') {
            weights[1] += 0.05
        }

        if(direction[0] === 'Forward') {
            weights[3] += 0.05
        }

        if(direction[1] === 'Downward') {
            weights[2] += 0.05;
        }

        if(direction[1] === 'Upward') {
            weights[0] += 0.05;
        }

        //handle cases where no movement - tie breaker
        if(outputs[0] === 0 && outputs[2] === 0) {
            const index = Math.round(Math.random()) ? 0 : 2;
            weights[index] += 0.05;
        }

        if(outputs[1] === 0 && outputs[3] === 0) {
            const index = Math.round(Math.random()) ? 1 : 3;
            weights[index] += 0.05;
        }

        //Handle cases where outputs are same for Y - tie breaker
        if(outputs[0] !== 0 && outputs[2] !== 0) {
            const index = Math.round(Math.random()) ? 0 : 2;
            weights[index] -= 0.05;
        }

        //Handle cases where outputs are same for X
        if(outputs[1] != 0 && outputs[3] != 0) {
            const index = Math.round(Math.random()) ? 1 : 3;
            weights[index] -= 0.05;
        }

        // Penalize for no movement
        // if(direction[0] === 'None' && direction[1] === 'None') {
        //     if (direction[0] === 'None') {
        //         weights[1] -= 0.01
        //         weights[3] -= 0.01
        //     }

        //     if(direction[1] === 'None') {
        //         weights[2] -= 0.01;
        //         weights[0] -= 0.01;
        //     }
        // }

          
        // TODO calculate where the collision occured, e.g was it caused by diagonal movement or a single axis
        const boundaryCollisions = getBoundaryCollisions(newCoords);

        weights.map((w, i) => {
            return w - (boundaryCollisions[i] ? -0.5 : 0)
        });

        const objectCollisions = getObjectCollisions(currentCoords, newCoords, [objectB.x, objectB.y]);

        
        // Next feed this back into the inputs
        const collided = boundaryCollisions.some(x => x === true);
        console.log({weights});
        console.log({collided, boundaryCollisions});
        backProp(weights);
        // console.log('[ backprop complete ]');
        // console.log(nn[2].neurons);
        await delay(100) /// waiting 1 second.
        
        if (collided) {
            reset();
        }
    }
}

loop();


