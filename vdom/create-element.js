const document = require("global/document")

const applyProperties = require("./apply-properties")

const isVNode = require("../vnode/is-vnode.js")
const isVText = require("../vnode/is-vtext.js")
const isVComment = require("../vnode/is-vcomment.js")
const isWidget = require("../vnode/is-widget.js")
const handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    const doc = opts?.document || document;
    const warn = opts?.warn || null;

    vnode = handleThunk(vnode).a;

    if (isWidget(vnode)) {
        return vnode.init();
    } else
    if (isVText(vnode)) {
        return doc.createTextNode(vnode.text);
    } else
    if (isVComment(vnode)) {
        const comment = doc.createComment(vnode.comment);

        // Using apply properties to apply hooks
        applyProperties(comment, vnode.properties);

        return comment;
    } else
    if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }

        return null;
    }

    const node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName.toLowerCase()) :
        doc.createElementNS(vnode.namespace, vnode.tagName.toLowerCase())

    const props = vnode.properties;
    applyProperties(node, props);

    const children = vnode.children;

    for (let i = 0; i < children.length; i++) {
        const childNode = createElement(children[i], opts);
        
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node;
}
