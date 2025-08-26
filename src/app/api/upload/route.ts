import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9_.-]/g, '_');

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Blob token is not configured' }, { status: 500 });
    }

    const blob = await put(`uploads/${fileName}`, file, {
      access: 'public',
      token,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
