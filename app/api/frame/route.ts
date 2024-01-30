import { getFrameAccountAddress } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

let counter = 1; // Initialize the counter

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // let accountAddress = '';
  // try {
  //   const body: { trustedData?: { messageBytes?: string } } = await req.json();
  //   accountAddress = await getFrameAccountAddress(body, { NEYNAR_API_KEY: 'NEYNAR_API_DOCS' });
  // } catch (err) {
  //   console.error(err);
  // }
  const postUrl = 'https://a-frame-in-100-lines-jbreite.vercel.app/api/frame';

  const baseImageUrl = 'https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-';
  let optionImageUrl = `${baseImageUrl}${counter}.png`;

  counter = counter >= 4 ? 1 : counter + 1;


  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${optionImageUrl}" />
    <meta property="fc:frame:button:1" content="Next" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
