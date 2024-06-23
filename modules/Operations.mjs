import { ApiClient } from "./ApiClient.mjs";
import { Utilities } from "./Utilities.mjs";

export const Operations = {
    /**
     * List all available builds
     * @returns void
     */
    listBuild: function (mcVer) {
        mcVer = mcVer ?? process.argv[3];

        if (!mcVer) {
            console.log("You should provide the version of Minecraft.");
            return;
        }

        console.log(`The available builds of ${mcVer}:`);

        ApiClient
            .getVersionData(mcVer)
            .then((json) => {
                let stableBuilds = 0, experimentalBuilds = 0;

                json["builds"].forEach((build) => {
                    const buildVer = build["build"].toString();
                    const channel = build["channel"] === "default" ? "stable" : build["channel"];

                    switch (build["channel"]) {
                        case "default":
                            stableBuilds++;
                            break;
                        case "experimental":
                            experimentalBuilds++;
                            break;
                    }

                    console.log(`- ${buildVer.padStart(3, " ")}\t${channel}`);
                });

                console.log("");
                console.log("Statistics:");
                console.log(`- Stable builds: ${stableBuilds} version(s)`);
                console.log(`- Experimental builds: ${experimentalBuilds} version(s)`);
            });
    },

    /**
     * Download the server file.
     * @returns void
     */
    download: function () {
        const mcVer = process.argv[3];
        const buildVer = process.argv[4];
        const destination = process.argv[5];

        if (typeof mcVer !== "string") {
            console.log("You should provide the version of Minecraft.");
            return;
        }

        ApiClient.getVersionData(mcVer)
            .then((json) => {
                let build;
                switch (buildVer) {
                    case "latest":
                        // Download the latest build.
                        build = Utilities.getLatestBuild(json["builds"]);

                        if (!build) {
                            console.log("There is not an available build.");
                            return Promise.reject();
                        }

                        return Promise.resolve(build);

                    case "latest-stable":
                        build = Utilities.getLatestBuild(json["builds"], "default");

                        if (!build) {
                            console.log("There is not an available stable build.");
                            return Promise.reject();
                        }

                        return Promise.resolve(build);

                    case "latest-experimental":
                        build = Utilities.getLatestBuild(json["builds"], "experimental");

                        if (!build) {
                            console.log("There is not an available experimental build.");
                            return Promise.reject();
                        }

                        return Promise.resolve(build);

                    default:
                        // Download the specified build.
                        const givenBuildVer = parseInt(buildVer);

                        if (typeof givenBuildVer !== "number") {
                            console.log("The given build version is an integer.");
                            return Promise.reject();
                        }

                        if (!json["builds"].some((data) => data["build"] === buildVer)) {
                            console.log("The given build version is not available.");
                            return Promise.reject();
                        }
                        return Promise.resolve(buildVer);
                }
            })
            .then((buildVer) => ApiClient.downloadFile(mcVer, buildVer, destination))
            .catch(() => { /** Do nothing */ });
    },
};

