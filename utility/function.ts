export type SingleDispatchHandler<I, O> = [new (...args: any[]) => I, (i: I) => O];

/**
 * Generated by single dispatch functions when no compatible handler is found
 * for the argument type
 */
export class UnimplementedHandlerError extends Error {

    type: Function;

    constructor(type: Function, message) {
        super(message);
        this.type = type;
    }

}

/**
 * Creates a function which defers execution to other functions depending on the type of its argument.
 * The created function only accepts one argument, therefore "single dispatch".
 * @param handlers 
 */
export function singleDispatch<I, O>(handlers: Iterable<SingleDispatchHandler<I, O>>): (i: I) => O {

    const typeToHandler = new Map<Function, (i: I) => O>(handlers);

    return (i: I) => {
        const type = i.constructor;
        const handler = typeToHandler.get(type);
        // If no handler is specified generate error
        if (handler === undefined) {
            throw new UnimplementedHandlerError(type, `Handler for type "${type.name}" not implemented.`);
        }
        return handler(i);
    }

}