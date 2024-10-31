import formatMessage from "sap/base/strings/formatMessage";

export default {
    formatMessage: formatMessage,

    /**
     * Determines the path of the image depending if it's a phone or not.
     * The smaller or larger image version is loaded based on the device type.
     *
     * @public
     * @param {boolean} bIsPhone - The value to be checked (whether it's a phone or not).
     * @param {string} sImagePath - The base path of the image.
     * @returns {string} Path to the image with appropriate size suffix.
     */
    srcImageValue(bIsPhone: boolean, sImagePath: string): string {
        if (bIsPhone) {
            sImagePath += "_small";
        }
        return sImagePath + ".jpg";
    }

};
