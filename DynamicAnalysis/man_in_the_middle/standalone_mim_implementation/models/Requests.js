const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    endpoint: {
        type: String,
        required: true,
    },
    headers: {
        type: Object,
        required: true,
    },
    body: {
        type: Object,
        required: true,
    },
    query: {
        type: Object,
        required: true,
    },
    params: {
        type: Array,
        required: true,
    },
    response: {
        type: Object,
        required: true,
    },
    tag: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Request', requestSchema);