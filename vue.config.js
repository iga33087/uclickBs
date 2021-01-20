module.exports = {
  publicPath: "/uclickBs/",
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
};
