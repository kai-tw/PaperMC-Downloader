import { ApiClient } from "./ApiClient.mjs";
import { Utilities } from "./Utilities.mjs";

export const Operations = {
    listBuild: function () {
        const mcVer = process.argv[3];

        if (!mcVer) {
            console.log("You should provide the version of Minecraft.");
            return;
        }

        console.log(`The available builds of ${mcVer}:`);
        ApiClient.getVersionData(mcVer)
            .then((json) => {
                console.log(json["builds"].join(", "));
            });
    },
    download: function () {
        const mcVer = process.argv[3];
        const buildVer = process.argv[4];
        const destination = process.argv[5];

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

