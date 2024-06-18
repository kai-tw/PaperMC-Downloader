import { strict as assert } from "node:assert";

export const Utilities = {
    /**
     * Get the latest build (in specified channel)
     * @param {obj[]} buildList 
     * @param {string} channel 
     * @returns 
     */
    getLatestBuild: function (buildList, channel = undefined) {
        assert.deepEqual(typeof buildList, "object", "The type of buildList should be array");
        const list = channel ? buildList.filter((data) => data["channel"] === channel) : buildList;
        return list.at(-1) ? list.at(-1)["build"] : undefined;
    }
};