var version = require("./version")

var noProperties = {};

/**
 * Creates a new virtual comment.
 * @param {string} comment The text inside the comment.
 */
class VirtualComment {
    constructor(comment, properties) {
        this.comment = String(comment);
        this.properties = properties || noProperties;
    }
}

VirtualComment.prototype.version = version;
VirtualComment.prototype.type = "VirtualComment";

module.exports = VirtualComment