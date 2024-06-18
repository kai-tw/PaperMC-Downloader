import https from "node:https";
import fs from "node:fs";

import XMLHttpRequest from "../node_modules/xhr2/lib/xhr2.js";

export const ApiClient = {
    /**
     * Get the json data from the specified url.
     * @param {string} url 
     * @returns {Promise<object>}
     */
    request: function (url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== "string") {
                console.log("You should provide the url.");
                return reject();
            }

            const httpRequest = new XMLHttpRequest;
            httpRequest.addEventListener("load", () => {
                if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                    resolve(JSON.parse(httpRequest.responseText ?? "{}"));
                } else {
                    reject(httpRequest.status);
                }
            });
            httpRequest.open("GET", url);
            httpRequest.send();
        })
    },

    /**
     * Get the version data from PaperMC api.
     * @param {string} mcVer Minecraft version
     * @returns {Promise<object>}
     */
    getVersionData: function (mcVer) {
        if (typeof mcVer !== "string") {
            console.log("You should provide the version of Minecraft.");
            return Promise.reject();
        }

        return this.request(`https://api.papermc.io/v2/projects/paper/versions/${mcVer}/builds`);
    },

    /**
     * Download the jar file.
     * @param {string} mcVer Minecraft version
     * @param {number} buildVer Build version
     * @param {string} destination The destination that file will be saved.
     * @returns {Promse<void>}
     */
    downloadFile: function (mcVer, buildVer, destination = "./download") {
        return new Promise((resolve, reject) => {
            if (typeof mcVer !== "string") {
                console.log("You should provide the version of Minecraft.");
                return reject();
            }

            if (!Number.isSafeInteger(buildVer)) {
                console.log("The given build version is not an integer.");
                return reject();
            }

            const jarDestination = `${destination}/paper-${mcVer}-${buildVer}.jar`;
            const file = fs.createWriteStream(jarDestination);
            const fileUrl = `https://api.papermc.io/v2/projects/paper/versions/${mcVer}/builds/${buildVer}/downloads/paper-${mcVer}-${buildVer}.jar`;

            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }

            https.get(fileUrl, (response) => {
                response.pipe(file);
                file.on("finish", () => {
                    file.close(() => resolve());
                });
            })
                .on("error", (err) => {
                    fs.unlink(jarDestination, () => reject(err));
                });
        });
    },
}