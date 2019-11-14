const devConfig = {
    Mongo_Url : "mongodb://localhost:/users"
};
const testConfig = {
    Mongo_Url : "mongodb://localhost:/users"
};
const prodConfig = {
    Mongo_Url : "mongodb://localhost:/users"
};
const defaultConfig = {
    PORT : process.env.PORT || 4200
};

function envConfig(env) {
    switch (env) {
      case "development":
        return devConfig;
        break;
      case "test":
        return testConfig;
        break;
      default:
        return prodConfig;
        break;
    }
  }
  
  export default {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV)
  };
  