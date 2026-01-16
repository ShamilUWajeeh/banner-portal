import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';

const registerCustomFonts = () => {
  try {
    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    try { registerFont(path.join(fontsDir, 'FaizLahoriNastaleeq.ttf'), { family: 'Faiz Lahori Nastaleeq' }); } catch (e) { }
    try { registerFont(path.join(fontsDir, 'Barlow-ExtraBold.ttf'), { family: 'Barlow ExtraBold' }); } catch (e) { }
    try { registerFont(path.join(fontsDir, 'Montserrat-ExtraBold.ttf'), { family: 'Montserrat ExtraBold' }); } catch (e) { }
  } catch (e) { }
};

registerCustomFonts();

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

    // For now, only template1 is implemented
    // Template2 will be added in next phase
    if (templateId !== 'template1') {
      return NextResponse.json({ error: 'Template not yet implemented' }, { status: 400 });
    }

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
    return new NextResponse(pngBuffer, {
      headers: { 'Content-Type': 'image/png', 'Content-Disposition': `attachment; filename="banner.png"` },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}