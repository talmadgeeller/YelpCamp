module.exports = func => {
    // Returns a new function that
    return (req, res, next) => {
        // Calls the passed in function, catching errors
        // and passes them to next()
        Promise.resolve(func(req, res, next)).catch(next);
    };
};
