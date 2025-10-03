import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // For now, return a simple response indicating OG image endpoint
        // The actual ImageResponse implementation would require proper JSX setup
        return NextResponse.json({
            message: `Dynamic OG image for blog: ${slug}`,
            url: `/api/og-image/${slug}`,
            size: { width: 1200, height: 630 }
        });
    } catch (error) {
        console.error('Error generating OG image:', error);
        return NextResponse.json({ error: 'Failed to generate OG image' }, { status: 500 });
    }
}