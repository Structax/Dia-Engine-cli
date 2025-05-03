export async function runEffect(label, fn, ctx) {
    if (ctx.signal.aborted) {
        throw new Error(`[${label}] aborted before start`);
    }
    return new Promise((resolve, reject) => {
        const onAbort = () => {
            reject(new Error(`[${label}] aborted via signal`));
        };
        ctx.signal.addEventListener('abort', onAbort);
        fn(ctx)
            .then((result) => {
            console.log(`[${ctx.traceId}] ✅ ${label} succeeded`);
            resolve(result);
        })
            .catch((err) => {
            console.error(`[${ctx.traceId}] ❌ ${label} failed`, err);
            reject(err);
        })
            .finally(() => {
            ctx.signal.removeEventListener('abort', onAbort);
        });
    });
}
