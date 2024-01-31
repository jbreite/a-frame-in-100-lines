import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Assume `store` is an initialized client for your key-value store

const BASE_IMAGE_URL = 'https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-';
const POST_URL = 'https://a-frame-in-100-lines-jbreite.vercel.app/api/frame';
const MAX_OPTION = 4;
const KEY = 'imageOption'; // Key used in the store to track the current image option

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // let accountAddress: string | undefined = '';
  let optionImageUrl: string | undefined = '';
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);
  if (isValid) {
    try {
      // accountAddress = await getFrameAccountAddress(message, { NEYNAR_API_KEY: 'NEYNAR_API_DOCS' });
      const keyValue = await kv.get<string>(KEY); // This may return 'string' or 'null'
      let currentOption = keyValue ? parseInt(keyValue, 10) : 1; // If keyValue is null, default to 1

      if (message.buttonIndex === 1) {
        // Prev button
        currentOption = currentOption > 1 ? currentOption - 1 : MAX_OPTION;
      } else if (message.buttonIndex === 2) {
        // Next button
        currentOption = currentOption < MAX_OPTION ? currentOption + 1 : 1;
      }

      // Update the store with the new option
      await kv.set(KEY, currentOption.toString());

      optionImageUrl = `${BASE_IMAGE_URL}${currentOption}.png`;
    } catch (err) {
      console.error(err);
    }
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${optionImageUrl}" />
  <meta property="fc:frame:button:1" content="Prev" />
  <meta property="fc:frame:button:2" content="Next" />
  <meta property="fc:frame:post_url" content="${POST_URL}" />
</head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';