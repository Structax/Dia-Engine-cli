import { randomUUID } from "crypto";
export async function createContext(req) {
    const traceId = req.headers["x-trace-id"]?.toString() || randomUUID();
    const signal = req.signal || new AbortController().signal;
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer /, "");
    let user = null;
    // ✅ 開発用モード（Authorization: dev）
    if (authHeader === "dev") {
        user = {
            id: "dev-user",
            roles: ["user"],
            tenantId: "dev-tenant"
        };
    }
    else if (token) {
        user = decodeFakeJWT(token);
    }
    const userHeader = req.headers["x-dia-user"];
    if (userHeader === "dev") {
        user = {
            id: "u-dev",
            roles: ["user"],
            tenantId: "t-dev"
        };
    }
    return {
        user,
        session: user ? { expiresAt: new Date(Date.now() + 60 * 60 * 1000) } : null,
        signal,
        traceId,
        services: {},
    };
}
// 仮のJWTデコード関数（v0.1では実装省略）
function decodeFakeJWT(token) {
    // トークンをBase64としてパース（デモ用）
    try {
        const json = Buffer.from(token, "base64").toString("utf-8");
        return JSON.parse(json);
    }
    catch {
        return null;
    }
}
