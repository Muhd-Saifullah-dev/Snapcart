import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Query missing' }, { status: 400 });
    }

    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            q
        )}&format=json&accept-language=en`,
        {
            headers: {
                // Nominatim requires this
                'User-Agent': 'checkout-map-app/1.0',
            },
        }
    );

    const data = await res.json();
    return NextResponse.json(data);
}
