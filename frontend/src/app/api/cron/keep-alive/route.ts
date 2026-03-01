import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Skip for now
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://spring-notification-engine.onrender.com';

    try {
        console.log(`[CRON] Pinging Spring Boot backend: ${backendUrl}/api/health`);
        const response = await fetch(`${backendUrl}/api/health`, { cache: 'no-store' });
        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: 'Spring Boot Backend Pinged Successfully',
            backend_status: data.status
        });
    } catch (error: any) {
        console.error('[CRON] Error pinging Spring Boot backend:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
