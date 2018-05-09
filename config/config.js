module.exports = {
    dev_host: "localhost",
    dev_port: 8091,
    favicon: './src/images/favicon.ico',
    commonname: "common",
    cssOutPath:"./css",
    cssPublicPath:"../",
    fontsOutPath:"./fonts",
    imageOutPath:"./img",
    entrys: [
        {
            title: "主程序",
            name: "main",
            entry: "./src/com/Main.ts",
            template: './src/htmls/index.html',
            filename: "./index.html"
        }
    ]
};