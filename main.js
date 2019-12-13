const fs = require("fs");
const child_process = require("child_process");
const core = require("@actions/core");
const github = require("@actions/github");

const msbuildProjectGenerator = "./TixFactory.MsBuildProjectGenerator/TixFactory.MsBuildProjectGenerator/TixFactory.MsBuildProjectGenerator.csproj";

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

		var dotnet = child_process.spawn("dotnet", ["run", msbuildProjectGenerator, directory, projectFile]);		
		dotnet.stdout.on("data", console.log);
		dotnet.stderr.on("data", exitWithError);

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
