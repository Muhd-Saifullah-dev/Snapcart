import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'lat/lon required' },
        { status: 400 }
      );
    }

    const res = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          'accept-language': 'en',
        },
        headers: {
          // MUST be real
          'User-Agent': 'MyGroceryApp/1.0 (contact: myemail@gmail.com)',
        },
        timeout: 10000,
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(
      'Reverse geocode error:',
      error.response?.status,
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        error: 'Reverse geocoding failed',
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
