var debug = require('debug')('requester');


function get_env_param( fallback ) {

	var param = {};

	if(process.env.VCAP_APPLICATION){

		var appInfo = JSON.parse(process.env.VCAP_APPLICATION);
		param.app = appInfo;

	} else if(fallback && fallback.applcation){

		param.app = fallback.application;
	}

	if(process.env.VCAP_APP_HOST){
	
		param.host = process.env.VCAP_APP_HOST;
	
	} else if(fallback && fallback.host){
	
		param.host = fallback.host;
	
	}

	if(process.env.VCAP_APP_PORT){

		param.port = process.env.VCAP_APP_PORT;
	
	} else if(fallback && fallback.port){

		param.port = fallback.port;

	}

	if(process.env.VCAP_SERVICES){

		var services = JSON.parse(process.env.VCAP_SERVICES);
		param.services = services;

	} else if(fallback && fallback.services){

		param.services = fallback.services;

	}

	if(debug){
		debug("Env params:");
		debug_print(param);
	}

	return param;

}

function debug_print(object, indent){

	if(object){

		for(var key in object){

			if(object[key] instanceof Object){

				indent = indent ? indent : "";
				debug(indent + key + ":");
				debug_print(object[key], indent + "\t");

			} else {

				debug(indent + key + "=" + object[key]);

			}
		}
	}
}

module.exports = get_env_param;

module.exports.localhost = get_env_param({ host: "localhost", port: 3000});

/**

** Are there any other environment variables that I can use with my deployed applications? **

BlueMix supports the following environment variables for an application at staging time.

* Variables defined by the [Droplet Execution Agents (DEAs)](http://docs.cloudfoundry.org/concepts/architecture/execution-agent.html)
    * HOME - Root directory of the deployed application.
    * MEMORY_LIMIT - The maximum amount of memory that each instance of your applcation can use. You can specify the value in an application manifest manifest.yml file, or in the command line when pushing the application.
    * PORT - The port on the DEA for communication with the application. The DEA allocates a port to the application at staging time.
    * PWD - The present working directory where the buildpack is running.
    * TMPDIR - The directory where temporary and staging files are stored.
    * USER - The user ID under wich the DEA runs.
    * VCAP_APP_HOST - The IP address of the DEA host.
    * VCAP_APPLICATION - A JSON string that contains useful information about the deployed application. The information includes the application name, URIs, memory limits, timestamp at which the application acheived its current state, and so on.
    * VCAP_SERVICES - A JSON string that contains information of the service that is bound to the deployed application.
* Variables defined by Liberty Buildpack
    * JAVA_HOME - The location of Java SDK that runs the application.
    * JAVA_OPTS - The Java options to use when running the application.
    * JAVA_TOOL_OPTIONS - The Java options that are required to enable the Java buildpack to auto-configure services for a Java application that uses the Lift framework.
* Variables defined by Node.js Buildpack
    * BUILD_DIR - The directory of the Node.js runtime environment.
    * CACHE_DIR - The directory that the Node.js runtime environment uses for caching.
    * PATH - The system path that is used by Node.js runtime environment.

For more details of each environment variables, see [Cloud Foundry Environment Variables](http://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html).

**/