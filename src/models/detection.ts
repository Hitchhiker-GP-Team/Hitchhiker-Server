const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    const model = await tf.loadGraphModel('C:/Users/zidan/Downloads/newwbest.tfjs/model.json');
    return model;
}

const model =  loadModel();
