const config = require('./config');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const server = Hapi.server(config.server);
const prerun = require('./prerun');
const _ = require('lodash');

const sampleRoute = require('./samples/routes/sample-routes');
const customMappingRoute = require('./custom-mappings/routes/custom-mapping-routes');
const indicesRoute = require('./indices/routes/indices-routes');

const routesArray = [sampleRoute,customMappingRoute,indicesRoute];

// sampleRoute(server);
// customMappingRoute(server);
// indicesRoutes(server);
_.invokeMap(routesArray,_.call,null,server);

const init = async () => {

  prerun.run();

  const swaggerOptions = {
    info: {
      title: 'API Documentation',
      version: Pack.version,
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();