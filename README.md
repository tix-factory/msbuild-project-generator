# tix-factory/msbuild-project-generator
generates a project file given a directory that can be built by dotnet msbuild with projects being built in parallel and deployable components and tests being separated out into their own targets

## Requirements
Requires dotnet to be available on the build agent.

## Input Parameters
| Parameter Name | Description |
| :------------- | :---------- |
| `directory`    | The directory to be scanned to generate the project file off of. |
| `projectFile`  | The output project file path. |

## Samples
### Download Release Asset
Downloads a release asset from another repository and saves it to a file.
```yml
    - name: Generate msbuild project file
      uses: tix-factory/msbuild-project-generator@v1
      with:
        directory: ./
        projectFile: ./build.project
```