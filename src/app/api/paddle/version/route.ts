export async function GET() {
    return Response.json({
        service: "Paddle Checkout API",
        version: "2026-03-27_02-17",
        status: "Running Latest Code",
        timestamp: new Date().toISOString()
    });
}
