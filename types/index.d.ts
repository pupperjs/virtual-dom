declare global {
    export { VirtualDOM };
}

namespace VirtualDOM {
    interface VHook {
        hook(node: Element, propertyName: string): void;
        unhook(node: Element, propertyName: string): void;
    }

    type EventHandler = (...args: any[]) => void;

    interface VProperties {
        attributes?: {[index: string]: string} | undefined;
        /**
        I would like to use {[index: string]: string}, but then we couldn't use an
        object literal when setting the styles, since TypeScript doesn't seem to
        infer that {'fontSize': string; 'fontWeight': string;} is actually quite
        assignable to the type { [index: string]: string; }
        */
        style?: any;
        /**
        The relaxation on `style` above is the reason why we need `any` as an option
        on the indexer type.
        */
        [index: string]: any | string | boolean | number | VHook | EventHandler | {[index: string]: string | boolean | number};
    }

    interface VNode {
        tagName: string;
        properties: VProperties;
        children: VTree[];
        key?: string | undefined;
        namespace?: string | undefined;
        count: number;
        hasWidgets: boolean;
        hasThunks: boolean;
        hooks: any[];
        descendantHooks: any[];
        version: string;
        type: string; // 'VirtualNode'
    }

    interface VNodeConstructor {
        new (tagName: string, properties: VProperties, children: VTree[], key?: string, namespace?: string): VNode;
    }

    interface VText {
        text: string;
        version: string;
        type: string; // 'VirtualText'
    }

    interface VTextConstructor {
        new (text: string): VText;
    }

    interface Widget {
        type: string; // 'Widget'
        init(): Element;
        update(previous: Widget, domNode: Element): void;
        destroy(node: Element): void;
    }

    interface Thunk {
        type: string; // 'Thunk'
        vnode: VTree;
        render(previous: VTree): VTree;
    }

    interface VCommentConstructor {
        new (comment: string): VComment;
    }

    interface VComment {
        type: string;
        comment: string;
    }

    type VTree = VText | VComment | VNode | Widget | Thunk;

    interface VPatch {
        vNode: VNode;
        patch: any;
        version: string;
        /**
        type is set to 'VirtualPatch' on the prototype, but overridden in the
        constructor with a number.
        */
        type: number;
    }

    type PatchFn<T extends Element> = (rootNode: T, patches: VPatch[], renderOptions: VPatchOptions<T>) => T;

    interface VPatchOptions<T extends Element> {
        patch?: PatchFn<T> | undefined;
    }

    interface createProperties extends VProperties {
        key?: string | undefined;
        namespace?: string | undefined;
    }

    type VChild = VTree[] | VTree | string[] | string;

    /**
     create() calls either document.createElement() or document.createElementNS(),
    for which the common denominator is Element (not HTMLElement).
    */
    function create(vnode: VText, opts?: {document?: Document | undefined; warn?: boolean | undefined}): Text;
    function create(vnode: VNode | Widget | Thunk, opts?: {document?: Document | undefined; warn?: boolean | undefined}): Element;
    function h(tagName: string, properties: createProperties, children: string | VChild[]): VNode;
    function h(tagName: string, children: string | VChild[]): VNode;

    /**
     * Creates a virtual comment node.
     * @param comment The comment contents.
     * @param properties The comment hooks.
     */
    declare function c(comment: string, properties?: createProperties): VComment;

    h.c = c;

    function diff(left: VTree, right: VTree): VPatch[];
    /**
     patch() usually just returns rootNode after doing stuff to it, so we want
    to preserve that type (though it will usually be just Element).
    */
    function patch<T extends Element>(rootNode: T, patches: VPatch[], renderOptions?: VPatchOptions<T>): T;

    function isVNode(vTree: VTree): vTree is VNode;
    function isVText(vTree: VTree): vTree is VText;
    function isWidget(vTree: VTree): vTree is Widget;
    function isThunk(vTree: VTree): vTree is Thunk;
}

declare module "virtual-dom/h" {
    import h = VirtualDOM.h;
    export = h;
}

declare module "virtual-dom/create-element" {
    import create = VirtualDOM.create;
    export = create;
}

declare module "virtual-dom/diff" {
    import diff = VirtualDOM.diff;
    export = diff;
}

declare module "virtual-dom/patch" {
    import patch = VirtualDOM.patch;
    export = patch;
}

declare module "virtual-dom" {
    export = VirtualDOM;
}

declare module "virtual-dom/vnode/vnode" {
    import VNodeConstructor = VirtualDOM.VNodeConstructor;
    const VNode: VNodeConstructor;
    export = VNode;
}

declare module "virtual-dom/vnode/vtext" {
    import VTextConstructor = VirtualDOM.VTextConstructor;
    const VText: VTextConstructor;
    export = VText;
}

declare module "virtual-dom/vnode/vcomment" {
    import VCommentConstructor = VirtualDOM.VCommentConstructor;
    const VComment: VCommentConstructor;
    export = VComment;
}

declare module "virtual-dom/vnode/is-vnode" {
    import isVNode = VirtualDOM.isVNode;
    export = isVNode;
}

declare module "virtual-dom/vnode/is-vtext" {
    import isVText = VirtualDOM.isVText;
    export = isVText;
}

declare module "virtual-dom/vnode/is-vcomment" {
    import isVComment = VirtualDOM.isVComment;
    export = isVComment;
}

declare module "virtual-dom/vnode/is-widget" {
    import isWidget = VirtualDOM.isWidget;
    export = isWidget;
}

declare module "virtual-dom/vnode/is-thunk" {
    import isThunk = VirtualDOM.isThunk;
    export = isThunk;
}