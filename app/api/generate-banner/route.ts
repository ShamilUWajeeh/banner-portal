import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';

// Force dynamic rendering - don't prerender this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const registerCustomFonts = () => {
  try {
    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    try { registerFont(path.join(fontsDir, 'FaizLahoriNastaleeq.ttf'), { family: 'Faiz Lahori Nastaleeq' }); } catch (e) { }
    try { registerFont(path.join(fontsDir, 'Barlow-ExtraBold.ttf'), { family: 'Barlow ExtraBold' }); } catch (e) { }
    try { registerFont(path.join(fontsDir, 'Montserrat-ExtraBold.ttf'), { family: 'Montserrat ExtraBold' }); } catch (e) { }
  } catch (e) { }
};

registerCustomFonts();

// Template 2 Generator Function
async function generateTemplate2(formData: FormData) {
  try {
    const SCALE = 3; // 1200×400 at 3x = 3600×1200
    const width = 1200 * SCALE;
    const height = 400 * SCALE;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Blue gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#3392d0');
    gradient.addColorStop(1, '#12499f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Load and draw 9 photos
    for (let i = 0; i < 9; i++) {
      const photoFile = formData.get(`photo${i}`) as File | null;
      const name = formData.get(`name${i}`) as string || '';
      const designation = formData.get(`designation${i}`) as string || '';
      const wardNumber = formData.get(`wardNumber${i}`) as string || `${i + 1}`;
      const positionX = parseFloat(formData.get(`positionX${i}`) as string) || 50;
      const positionY = parseFloat(formData.get(`positionY${i}`) as string) || 50;
      const zoom = parseFloat(formData.get(`zoom${i}`) as string) || 100;

      if (photoFile) {
        const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
        const photoImage = await loadImage(photoBuffer);

        // Calculate position in grid (4 top, 5 bottom)
        const isTopRow = i < 4;
        const indexInRow = isTopRow ? i : i - 4;
        const photosInRow = isTopRow ? 4 : 5;

        const photoWidth = 140 * SCALE;
        const photoHeight = 170 * SCALE;
        const startX = 250 * SCALE;
        const availableWidth = 700 * SCALE;
        const spacing = 0;
        const totalPhotoWidth = photosInRow * photoWidth + (photosInRow - 1) * spacing;
        const offsetX = (availableWidth - totalPhotoWidth) / 2;

        const x = startX + offsetX + indexInRow * (photoWidth + spacing);
        const y = isTopRow ? (height / 2 - photoHeight - 2 * SCALE) : (height / 2 + 2 * SCALE);

        // Draw photo - FIXED to show complete image with proper object-fit
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, photoWidth, photoHeight);
        ctx.clip();

        const zoomFactor = zoom / 100;
        const imgAspect = photoImage.width / photoImage.height;
        const containerAspect = photoWidth / photoHeight;

        let imgWidth, imgHeight;
        // Use object-fit: cover logic - fill container completely
        if (imgAspect > containerAspect) {
          // Image is wider - fit to height
          imgHeight = photoHeight * zoomFactor;
          imgWidth = imgHeight * imgAspect;
        } else {
          // Image is taller - fit to width  
          imgWidth = photoWidth * zoomFactor;
          imgHeight = imgWidth / imgAspect;
        }

        // Center the image based on position controls
        const imgX = x + (photoWidth / 2) - (imgWidth * (positionX / 100));
        const imgY = y + (photoHeight / 2) - (imgHeight * (positionY / 100));

        ctx.drawImage(photoImage, imgX, imgY, imgWidth, imgHeight);
        ctx.restore();

        // Add blue fade overlay on lower body
        const fadeGradient = ctx.createLinearGradient(0, y + photoHeight * 0.5, 0, y + photoHeight);
        fadeGradient.addColorStop(0, 'rgba(18, 73, 159, 0)');
        fadeGradient.addColorStop(1, 'rgba(18, 73, 159, 0.7)');
        ctx.fillStyle = fadeGradient;
        ctx.fillRect(x, y, photoWidth, photoHeight);

        // Add text overlay with Urdu content
        if (name || wardNumber) {
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4 * SCALE;

          // Name in Urdu
          ctx.font = `bold ${16 * SCALE}px Faiz Lahori Nastaleeq, serif`;
          ctx.fillText(name, x + photoWidth / 2, y + photoHeight - 45 * SCALE);

          // Designation
          ctx.font = `${11 * SCALE}px Faiz Lahori Nastaleeq, serif`;
          ctx.fillText(designation, x + photoWidth / 2, y + photoHeight - 28 * SCALE);

          // Ward number
          ctx.font = `bold ${12 * SCALE}px Arial`;
          ctx.fillText(`WARD ${wardNumber}`, x + photoWidth / 2, y + photoHeight - 12 * SCALE);

          ctx.shadowBlur = 0;
        }
      }
    }

    // Draw white background for right panel FIRST
    ctx.fillStyle = 'white';
    ctx.fillRect(950 * SCALE, 0, 250 * SCALE, height);

    // Load left panel elements
    try {
      const ucNumber = formData.get('ucNumber') as string || '91';
      const areaName = formData.get('areaName') as string || 'I-10/2';

      // Draw UC text at top
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = `bold ${56 * SCALE}px Barlow ExtraBold, sans-serif`;
      ctx.fillText(`UC-${ucNumber}`, 125 * SCALE, 60 * SCALE);

      ctx.fillStyle = '#FFEB3B';
      ctx.font = `bold ${28 * SCALE}px Barlow ExtraBold, sans-serif`;
      ctx.fillText(areaName, 125 * SCALE, 95 * SCALE);

      // Load and draw Tarazu logo - MOVED UP below UC block
      const tarazuPath = path.join(process.cwd(), 'public', 'tarazu logo.png');
      const tarazuLogo = await loadImage(tarazuPath);
      ctx.drawImage(tarazuLogo, 5 * SCALE, 110 * SCALE, 240 * SCALE, 240 * SCALE);

      // Add Tarazu Urdu text below logo - CORRECT SEQUENCE
      ctx.textAlign = 'center';
      ctx.font = `bold ${24 * SCALE}px Faiz Lahori Nastaleeq, serif`;
      ctx.fillStyle = 'white';

      // First line: انتخابی (Intikhabi)
      ctx.fillText('انتخابی', 125 * SCALE, 360 * SCALE);

      // Second line: نشان (Nishan)  
      ctx.fillText('نشان', 125 * SCALE, 385 * SCALE);

      // Third line: ترازو (Tarazu) - larger and yellow
      ctx.font = `bold ${40 * SCALE}px Faiz Lahori Nastaleeq, serif`;
      ctx.fillStyle = '#FFEB3B';
      ctx.fillText('ترازو', 125 * SCALE, 395 * SCALE);
    } catch (e) {
      console.error('Error loading left panel:', e);
    }

    // Load right panel static image - FIXED aspect ratio
    try {
      const rightPanelPath = path.join(process.cwd(), 'public', 'right-panel.png');
      const rightPanel = await loadImage(rightPanelPath);
      // Draw with proper aspect ratio - no squeezing
      ctx.drawImage(rightPanel, 950 * SCALE, 0, 250 * SCALE, height);
    } catch (e) {
      console.error('Error loading right panel:', e);
    }

    const pngBuffer = canvas.toBuffer('image/png');
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: { 'Content-Type': 'image/png', 'Content-Disposition': `attachment; filename="banner-template2.png"` },
    });
  } catch (error) {
    console.error('Template 2 Error:', error);
    return NextResponse.json({ error: 'Failed to generate Template 2' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const templateId = formData.get('templateId') as string || 'template1';
    const name = formData.get('name') as string;
    const designation = formData.get('designation') as string;
    const ucNumber = formData.get('ucNumber') as string;
    const areaName = formData.get('areaName') as string;
    const wardNumber = formData.get('wardNumber') as string;
    const imageFile = formData.get('image') as File | null;
    const positionX = parseFloat(formData.get('positionX') as string) || 50;
    const positionY = parseFloat(formData.get('positionY') as string) || 50;
    const zoom = parseFloat(formData.get('zoom') as string) || 100;


    // Handle different templates
    if (templateId === 'template2') {
      // Template 2: 9 photos in 4+5 grid layout
      return await generateTemplate2(formData);
    }

    // Template 1 generation (existing code below)


    const SCALE = 6;
    const width = 500 * SCALE;
    const height = 833 * SCALE;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // === BACKGROUND ===
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#3392d0');
    gradient.addColorStop(1, '#12499f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // === TOP WHITE BAR ===
    const topBarHeight = 96 * SCALE;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, topBarHeight);

    // === 1. BADLO NIZAM LOGO (BIGGER) ===
    try {
      const badloLogo = await loadImage(path.join(process.cwd(), 'public', 'badlo nizam logo.png'));

      // Increased to 1.15 (115% of bar height) to make it POP and fill whitespace
      const maxLogoHeight = topBarHeight * 3;
      const maxLogoWidth = width * 0.95;

      let finalHeight = maxLogoHeight;
      let finalWidth = (badloLogo.width / badloLogo.height) * finalHeight;

      if (finalWidth > maxLogoWidth) {
        finalWidth = maxLogoWidth;
        finalHeight = (badloLogo.height / badloLogo.width) * finalWidth;
      }

      const logoX = (width - finalWidth) / 2;
      const logoY = (topBarHeight - finalHeight) / 2;

      ctx.drawImage(badloLogo, logoX, logoY, finalWidth, finalHeight);
    } catch (e) { console.log('Badlo logo missing'); }

    // === CANDIDATE PHOTO ===
    if (imageFile) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const candidateImage = await loadImage(Buffer.from(arrayBuffer));

        const photoContainerTop = topBarHeight;
        const photoContainerHeight = height - photoContainerTop;
        const basePhotoHeight = photoContainerHeight * 0.92;
        const scaledPhotoHeight = basePhotoHeight * (zoom / 100);
        const photoWidth = (candidateImage.width / candidateImage.height) * scaledPhotoHeight;

        const photoX = (width * (positionX / 100)) - (photoWidth / 2);
        const startY = photoContainerTop + (photoContainerHeight * 0.5);
        const offsetY = (photoContainerHeight * (positionY - 50)) / 100;
        const photoY = startY + offsetY - (scaledPhotoHeight * 0.5);

        const tempCanvas = createCanvas(width, height);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(candidateImage, photoX, photoY, photoWidth, scaledPhotoHeight);

        const fadeStart = photoY + (scaledPhotoHeight * 0.50);
        const fadeEnd = photoY + (scaledPhotoHeight * 0.85);

        if (fadeEnd > fadeStart) {
          tempCtx.globalCompositeOperation = 'destination-out';
          const maskGradient = tempCtx.createLinearGradient(0, fadeStart, 0, fadeEnd);
          maskGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          maskGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
          tempCtx.fillStyle = maskGradient;
          tempCtx.fillRect(photoX, fadeStart, photoWidth, height - fadeStart);
        }
        ctx.drawImage(tempCanvas, 0, 0);
      } catch (e) { }
    }

    // === 2. TARAZU BLOCK (VISUAL CENTER FIX) ===
    try {
      const tarazuLogo = await loadImage(path.join(process.cwd(), 'public', 'tarazu logo.png'));

      const logoSize = 150 * SCALE;
      const logoX = 15 * SCALE;
      const logoY = 180 * SCALE;

      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      ctx.drawImage(tarazuLogo, logoX, logoY, logoSize, logoSize);
      ctx.shadowColor = 'transparent';

      // 🔧 move text LEFT under logo
      const textY = logoY + logoSize - (30 * SCALE);
      const textRight = logoX + (130 * SCALE); // <-- SHIFT LEFT

      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;

      let x = textRight;

      ctx.font = `bold ${22 * SCALE}px "Faiz Lahori Nastaleeq"`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('انتخابی', x, textY + (10 * SCALE));
      x -= ctx.measureText('انتخابی').width + (6 * SCALE);

      ctx.fillText('نشان', x, textY + (10 * SCALE));
      x -= ctx.measureText('نشان').width + (6 * SCALE);

      ctx.font = `bold ${45 * SCALE}px "Faiz Lahori Nastaleeq"`;
      ctx.fillStyle = '#FFEB3B';
      ctx.fillText('ترازو', x, textY);

      ctx.shadowColor = 'transparent';
    } catch (e) { }

    // === 3. UC INFO (TIGHTER STACK FIX) ===
    {
      const ucX = width - (80 * SCALE); // ← more LEFT
      let ucY = 170 * SCALE;           // ← more UP

      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 20;

      const fontSizeUC = 68 * SCALE;
      const fontSizeNum = 60 * SCALE;
      const fontSizeArea = 30 * SCALE;

      const gap = -15 * SCALE; // tighter vertical pull

      ctx.font = `800 ${fontSizeUC}px "Barlow ExtraBold"`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('UC', ucX, ucY);
      ucY += fontSizeUC + gap;

      ctx.font = `800 ${fontSizeNum}px "Barlow ExtraBold"`;
      ctx.fillText(ucNumber, ucX, ucY);
      ucY += fontSizeNum + gap;

      ctx.font = `800 ${fontSizeArea}px "Barlow ExtraBold"`;
      ctx.fillStyle = '#FFEB3B';
      ctx.fillText(areaName, ucX, ucY + (12 * SCALE));

      ctx.shadowColor = 'transparent';
    }
    // === BOTTOM TEXT ===
    const bottomMargin = 112 * SCALE;
    let textCursorY = height - bottomMargin;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const drawStyledText = (text: string, fontSize: number, font: string, y: number, color: string = '#FFFFFF') => {
      ctx.font = `${fontSize}px "${font}"`;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = color;
      ctx.fillText(text, width / 2, y);
      ctx.shadowColor = 'transparent';
    };

    drawStyledText(`WARD ${wardNumber}`, 30 * SCALE, 'Montserrat ExtraBold', textCursorY);
    textCursorY -= (40 * SCALE);
    drawStyledText(designation, 30 * SCALE, 'Faiz Lahori Nastaleeq', textCursorY);
    textCursorY -= (50 * SCALE);
    drawStyledText(name || 'سردار حنظلہ طارق', 96 * SCALE, 'Faiz Lahori Nastaleeq', textCursorY);

    // === FOOTER LOGO ===
    try {
      const jiisbLogo = await loadImage(path.join(process.cwd(), 'public', 'JIISB.png'));
      const logoHeight = 48 * SCALE;
      const logoWidth = (jiisbLogo.width / jiisbLogo.height) * logoHeight;
      const logoX = (width - logoWidth) / 2;
      const logoY = height - (32 * SCALE) - logoHeight;
      ctx.drawImage(jiisbLogo, logoX, logoY, logoWidth, logoHeight);
    } catch (e) { }


    const pngBuffer = canvas.toBuffer('image/png');
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: { 'Content-Type': 'image/png', 'Content-Disposition': `attachment; filename="banner.png"` },
    });


  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}