declare function Xe(e: any): {
    directive(e: any, n: any): any;
    mount(e: any): {
        directive(e: any, n: any): any;
        mount(e: any): any;
        unmount(): void;
    };
    unmount(): void;
};
declare function me(e: any): any;
declare function te(e: any): any;
export { Xe as createApp, me as nextTick, te as reactive };
