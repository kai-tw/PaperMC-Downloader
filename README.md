# PaperMC Downloader

This is a command-line tool that can download the specified jar file.

## Installation

```bash
#!/bin/bash
git clone https://github.com/kai-tw/PaperMC-Downloader.git
cd PaperMC-Downloader
npm install
```

## Command

```
node index.js OPERATIONS

  OPERATIONS:
    listBuild MC_VER                    List the all available builds of MC_VER.
      MC_VER                            The version of Minecraft.

    download  MC_VER BUILD_VER [dest]   Download the server file.
      MC_VER                            The version of Minecraft.
      BUILD_VER                         The version of a build.
      [dest]                            The file saving destination. (Optional)
```

Notes:
- In download operation, if `dest` did not provide, it would save the file to the `download` folder.
- In download operation, `BUILD_VER` could be `latest`, `latest-stable`, or `latest-experimental`.

## Environment

- Node.JS Version: v20.14.0
