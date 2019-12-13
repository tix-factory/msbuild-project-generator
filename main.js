const fs = require("fs");
const child_process = require("child_process");
const core = require("@actions/core");

const exitWithError = function(err) {
	console.error(err);
	process.exit(1);
};

const toAbsoluteFilePath = function(filePath) {
	var checkoutDirectory = process.env.GITHUB_WORKSPACE;
	if (!checkoutDirectory) {
		return filePath;
	}

	if (filePath.startsWith("./")) {
		return `${checkoutDirectory}${filePath.substring(1)}`;
	}

	return filePath;
};

const run = function() {
	let directory = core.getInput("directory", { required: true });
	let projectFile = core.getInput("projectFile", { required: true });

	directory = toAbsoluteFilePath(directory);
	projectFile = toAbsoluteFilePath(projectFile);

	console.log(`msbuild-project-generator\n\tdirectory: ${directory}\n\tprojectFile: ${projectFile}\n\tcurrent directory: ${process.cwd()}\n\t__dirname: ${__dirname}`);
	
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
