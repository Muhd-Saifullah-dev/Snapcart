import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
    }

    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
      {
        headers: {
          'User-Agent': 'groceries/1.0(your-email@example.com)',
          'Referer': 'http://localhost:3000',
        },
        timeout:10000,
      }
    );
    const result=await res.data
    return NextResponse.json(result);
  } catch (error: any) {
    console.log('Reverse geocode error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
