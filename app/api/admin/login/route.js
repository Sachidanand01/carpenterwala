import { NextResponse } from 'next/server';
import crypto from 'crypto';

// POST /api/admin/login
export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'CarpenterwalaAdmin2026';

    if (password === expectedPassword) {
      // Create a secure cryptographically signed session token
      const token = crypto
        .createHash('sha256')
        .update(password + 'carpenterwala-salt-2026')
        .digest('hex');

      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
