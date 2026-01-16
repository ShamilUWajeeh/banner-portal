import { removeBackground } from '@imgly/background-removal-node';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // FIX: We must pass the file type (e.g. 'image/jpeg') so the AI knows what it is
    const blob = new Blob([arrayBuffer], { type: file.type });

    console.log(`Processing ${file.type} image locally...`);
    
    // Process the image
    const resultBlob = await removeBackground(blob);
    
    const buffer = Buffer.from(await resultBlob.arrayBuffer());
    
    return new NextResponse(buffer, {
    headers: { 'Content-Type': 'image/png' }
    });

} catch (error) {
    console.error("Background Removal Error:", error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
}
}