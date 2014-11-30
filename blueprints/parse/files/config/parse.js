/* jshint node: true */

module.exports = function(environment) {
	var ENV = {
		"global": {
	        "parseVersion": "1.3.2"
	    },
	    "applications": {
	    	// "APPLICATION_NAME": {
	    	// 	"applicationId": "APP_ID",
	    	// 	"masterKey": "MASTER_KEY"
	    	// },
	    	// "_default": {
	     	// 	 "link": "APPLICATION_NAME"
	    	// }
	    }
	};

	if (environment === "development") {
		// ENV.applications = {
		//     "APP NAME": {
		//         "applicationId": "APP ID", 
		//         "masterKey": "MASTER KEY"
		//     }, 
		//     "_default": {
		//         "link": "APP NAME"
		//     }
		// }
	}

	if (environment === "test") {
		// NOTHING
	}
	
	// export PARSE_APP_NAME="Your Parse App Name"
	// export PARSE_APP_ID="APP_ID"
	// export PARSE_MASTER_KEY="MASTER_KEY"
	// ember parse deploy --environment=production
	if (environment === "production") {
		ENV.applications = {};
		ENV.applications[process.env.PARSE_APP_NAME] = {
	        "applicationId": process.env.PARSE_APP_ID, 
	        "masterKey": process.env.PARSE_MASTER_KEY
		};
		ENV.applications._default = {
        	"link": process.env.PARSE_APP_NAME
		};
	}

	return ENV;
};