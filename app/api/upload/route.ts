import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedExt = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico'];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${allowedExt.join(', ')}` },
        { status: 400 }
      );
    }
    const maxBytes = 5 * 1024 * 1024; // 5MB
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Basic SVG sanitization
    if (ext === '.svg') {
      const text = buffer.toString('utf-8');
      if (text.toLowerCase().includes('<script') || text.toLowerCase().includes('javascript:') || text.toLowerCase().includes('onmouseover') || text.toLowerCase().includes('onclick')) {
        return NextResponse.json(
          { error: 'SVG contains potentially malicious content (scripts/handlers)' },
          { status: 400 }
        );
      }
    }

    if (buffer.length > maxBytes) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      );
    }

    // Create unique filename
    const filename = `${uuidv4()}${path.extname(file.name)}`;
    
    // Get optional folder param
    const folder = request.nextUrl.searchParams.get('folder') || '';
    // Sanitize folder name to prevent directory traversal
    const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '');
    
    const uploadDir = safeFolder 
      ? path.join(process.cwd(), 'public', 'uploads', safeFolder)
      : path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);
    
    // Debug logging
    try {
      const logMsg = `${new Date().toISOString()} - Uploading: ${filename} (${file.name}, ${buffer.length} bytes) to ${filepath}\n`;
      await writeFile(path.join(process.cwd(), 'public', 'uploads', 'upload-debug.log'), logMsg, { flag: 'a' });
    } catch (logErr) {
      console.error('Failed to write debug log', logErr);
    }

    await writeFile(filepath, buffer);

    const urlPath = safeFolder ? `/uploads/${safeFolder}/${filename}` : `/uploads/${filename}`;
    const url = urlPath;
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || '';
    const publicUrl = host ? `${proto}://${host}${url}` : url;

    return NextResponse.json({ url, publicUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const logMsg = `${new Date().toISOString()} - ERROR: ${error.message}\n`;
      await writeFile(path.join(uploadDir, 'upload-debug.log'), logMsg, { flag: 'a' });
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
