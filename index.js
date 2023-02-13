


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
                    if (pn.activated) {
                        return acc + pn.value * neuron.weights[pni];
                    }
                    return acc;
                }, neuron.bias);
                neuron.value = sum;
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

const colliding = (object, otherObjects) => {
    if (object.x < 0 || object.x > BOARD_MAX_X) {
        return true;
    }

    if (object.y < 0 || object.y > BOARD_MAX_Y) {
        return true;
    }

    for (oo of otherObjects) {
        if (oo.x === object.x && oo.y === object.y) {
            return true;
        }
    }
}

const update = (inputs) => {
    const aX = inputs[1] + -inputs[3];
    const aY = inputs[0] + -inputs[2];

    objectA.x += aX;
    objectA.y += aY
    
    if (colliding(objectA, [objectB])) {
        throw new Error('Collision detected');
    }

};

const end = Date.now() + 5 * 1000;

const nn = generateNN();


const determineInputs = () => {

    const forwardX = objectA.x + 1;
    const backwardX = objectA.x - 1;
    const forwardY = objectA.y + 1;
    const backwardY = objectA.y - 1;

    const inputs = [0, 0, 0, 0];

    if (backwardY <= 0) {
        inputs[0] = 1;
    }

    if (forwardX >= BOARD_MAX_X) {
        inputs[1] = 1;
    }

    if (forwardY >= BOARD_MAX_Y) {
        inputs[2] = 1
    }

    if (backwardX <= 0) {
        inputs[3] = 1;
    }

    return inputs;
}

const updateWeights = (value) => {
    nn.forEach(layer => {
        layer.neurons.forEach((neuron) => {
            if(neuron.weights && neuron.activated) {
                neuron.weights.forEach((_, i) => {
                    neuron.weights[i] += value;
                })

                neuron.activated = false;
                neuron.value = 0;
            }
        })
    })
}

const loop = async () => {
    
    reset();
    while (true) {
        console.clear();
        console.log('\n');
        console.log(render());
        try {
            const inputs = determineInputs();
            const outputs = determineOutputs(nn, inputs);
            const currentCoords = [objectA.x, objectA.y]
            console.log(outputs);
            update(outputs);
            const newCoords = [objectA.x, objectA.y];
            const finishCoords = [25, 10];
            const didMove = currentCoords[0] !== newCoords[0] || currentCoords[1] !== newCoords[1];
            const prevDistanceToFinish = finishCoords[0] + finishCoords[1] - currentCoords[0] + currentCoords[1];
            const newDistanceToFinish = finishCoords[0] + finishCoords[1] - newCoords[0] + newCoords[1];
            
            
            // TODO backprop based on which neurons should/shouldnt have triggered
            let updateWeight = 0;
            if(didMove) {
                updateWeight += 0.05;
            } 

           
            if(newDistanceToFinish < prevDistanceToFinish) {
                updateWeight += 0.05;
            }

            updateWeights(updateWeight);
            
        } catch (e) {
            updateWeights(-0.1);
            reset();
        }

       

        await delay(10) /// waiting 1 second.
    }
}

loop();


