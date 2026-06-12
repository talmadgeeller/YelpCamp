module.exports.getDuplicateField = err => {
    if (err.name === 'ValidationError') {
        return Object.keys(err.errors || {}).find(key => err.errors[key].kind === 'unique');
    }
    if (err.code === 11000) {
        return Object.keys(err.keyPattern || {})[0];
    }
    return null;
}
