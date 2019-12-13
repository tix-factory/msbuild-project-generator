const fs = require("fs");
const child_process = require("child_process");
const core = require("@actions/core");

const exitWithError = function(err) {
	console.error(err);
	process.exit(1);
};

const run = function() {
	let directory = core.getInput("directory", { required: true });
	let projectFile = core.getInput("projectFile", { required: true });
	
	fs.stat(directory, function(err, stats) {
		if (err) {
			exitWithError(err);
			return;
		}

		if (!stats.isDirectory()) {
			exitWithError("'directory' expected to be directory path.");
			return;
		}

		var dotnet = child_process.spawn("dotnet", ["run", directory, projectFile], {
			cwd: "./TixFactory.MsBuildProjectGenerator/TixFactory.MsBuildProjectGenerator"
		});

		dotnet.stdout.on("data", (data) => {
			console.log(data.toString());
		});

		dotnet.stderr.on("data", (data) => {
			exitWithError(data.toString());
		});

		dotnet.on("close", function(code) {
			if (code === 0) {
				console.log("'dotnet run' finished.");
			} else {
				exitWithError(`'dotnet run' exited with error code: ${code}`);
			}
		});
	});
};

run();
