import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

const BASE_IMAGE_URL = 'https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-';
const POST_URL = 'https://a-frame-in-100-lines-jbreite.vercel.app/api/frame';
const MAX_OPTION = 4;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let optionImageUrl: string = '';
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);
  let currentOption;

  if (isValid) {
    
    const currentOptionParam = req.nextUrl.searchParams.get('currentOption');
    
    currentOption = currentOptionParam ? parseInt(currentOptionParam, 10) : 1; // Default to 1 if not found
    
    // Adjust the current option based on the buttonIndex
    if (message.buttonIndex === 1) { // "Prev" button
      currentOption = currentOption > 1 ? currentOption - 1 : MAX_OPTION;
    } else if (message.buttonIndex === 2) { // "Next" button
      currentOption = currentOption < MAX_OPTION ? currentOption + 1 : 1;
    }

    optionImageUrl = `${BASE_IMAGE_URL}${currentOption}.png`;
  } else {
    // Handle invalid message case
    optionImageUrl = `${BASE_IMAGE_URL}error.png`;
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${optionImageUrl}" />
    <meta property="fc:frame:button:1" content="Prev" />
    <meta property="fc:frame:button:2" content="Next" />
    <meta property="fc:frame:post_url" content="${POST_URL}?currentOption=${currentOption}" />
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';