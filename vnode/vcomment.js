var version = require("./version")

module.exports = VirtualComment

/**
 * Creates a new virtual comment.
 * @param {string} comment The text inside the comment.
 */
function VirtualComment(comment) {
    this.comment = String(comment);
}

VirtualComment.prototype.version = version
VirtualComment.prototype.type = "VirtualComment"