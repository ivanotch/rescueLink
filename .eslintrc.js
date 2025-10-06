module.exports = {
    root: true,
    extends: ["expo"],
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
                paths: ["."],
            },
            "babel-module": {}, // 👈 allows ESLint to read from Babel’s alias config
        },
    },
};
