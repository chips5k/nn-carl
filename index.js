

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
    for(layer of nn.layers) {
        // if layer already activated, skip it

        for(n, ni of layer) {
            const sum = n.weights.reduce((acc, w, i) => {

                const inputValue = n.value !== null ? n.value : nn.layers[ni - 1]nn.layers[ni - 1].value
                return acc + inputs[i] * w + n.bias
            }, 0);
        
            if(sum > n.threshold) {
                n.activated = true;
            }
        }
    } 
}



// for(n of hidden) {
//     const sum = n.weights.reduce((acc, w, i) => {
//         return acc + inputs[i] * w + n.bias
//     }, 0);

//     if(sum > n.threshold) {
//         n.activated = true;
//     }
// } 





const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const objectA = [0, 0]
const objectB = [1, 0]

objects = [objectA, objectB];

const reset = () => {
    objectA[0] = 0;
    objectA[1] = 0;
    objectB[0] = 1;
    objectB[1] = 0;
};

const render = () => {
    let string = ''
    for (y = 0; y <= 10; y++) {
        for (x = 0; x <= 10; x++) {
            objectString = '0';
            for (object of objects) {
                if (object[0] === x && object[1] === y) {
                    objectString = 'X'
                }
            }
            string += ' ' + objectString
        }
        string += '\n'
    }
    return string;
}

const colliding = (object, otherObjects) => {
    if (object[0] <= 0 || object[0] >= 10) {
        return true;
    }

    if (object[1] <= 0 || object[1] >= 10) {
        return true;
    }

    for (oo in otherObjects) {
        if (oo[0] === object[0] && oo[1] === object[1]) {
            return true;
        }
    }
}

const update = () => {
    const aX = 1;
    const aY = 0;

    if (colliding(objectA, [objectB])) {
        throw new Error('Collision detected');
    }

    objectA[0] += aX;
    objectA[1] += aY


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


