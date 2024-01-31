import { getFrameAccountAddress, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { kv } from "@vercel/kv";

// Assume `store` is an initialized client for your key-value store

const BASE_IMAGE_URL = 'https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-';
const POST_URL = 'https://a-frame-in-100-lines-jbreite.vercel.app/api/frame';
const MAX_OPTION = 4;
const KEY = 'imageOption'; // Key used in the store to track the current image option

// interface FrameData {
//   fid: number;
//   url: string;
//   messageHash: string | undefined;
//   timestamp: number;
//   network: number;
//   buttonIndex: number;
//   castId: {
//     fid: number;
//     hash: string; // or string, if you're not working directly with Node.js Buffer objects
//   };
// }

// // Define the structure of the response from getFrameMessage
// interface FrameValidationResponse {
//   isValid: boolean;
//   message: FrameData;
// }


async function getResponse(req: NextRequest): Promise<NextResponse> {
  let optionImageUrl: string;

  try {
    const body = await req.json();
    // Cast the result of getFrameMessage directly to FrameValidationResponse
    const result = await getFrameMessage(body);
    
    if (!result.isValid) {
      throw new Error('Message is not valid');
    }
    
    const message = result.message;

    // Retrieve the current option from the store
    const keyValue = await kv.get<string>(KEY); // This may return 'string' or 'null'
    let currentOption = keyValue ? parseInt(keyValue, 10) : 1; // If keyValue is null, default to 1
    
    if (message.buttonIndex === 1) { // Prev button
      currentOption = currentOption > 1 ? currentOption - 1 : MAX_OPTION;
    } else if (message.buttonIndex === 2) { // Next button
      currentOption = currentOption < MAX_OPTION ? currentOption + 1 : 1;
    }

    // Update the store with the new option
    await kv.set(KEY, currentOption.toString());

    optionImageUrl = `${BASE_IMAGE_URL}${currentOption}.png`;
  } catch (err) {
    console.error(err);
    // Fallback image or error handling strategy
    optionImageUrl = `${BASE_IMAGE_URL}error.png`; // Replace with your actual error image URL
  }

  // Return a response in all cases
  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${optionImageUrl}" />
    <meta property="fc:frame:button:1" content="Prev" />
    <meta property="fc:frame:button:2" content="Next" />
    <meta property="fc:frame:post_url" content="${POST_URL}" />
  </head></html>`);
}

export default async function handler(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';


// let counter = 1; // Initialize the counter

// async function getResponse(req: NextRequest): Promise<NextResponse> {
//   const postUrl = 'https://a-frame-in-100-lines-jbreite.vercel.app/api/frame';

//   const baseImageUrl = 'https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-';
//   let optionImageUrl = `${baseImageUrl}${counter}.png`;

//   counter = counter >= 4 ? 1 : counter + 1;

//   let accountAddress: string | undefined;
//   let messageBytes: string | undefined;
//   try {
//     const body = await req.json();
//     const validatedMessage = await getFrameMessage(body);

//     console.log('Validated message is', validatedMessage);
    
//   } catch (err) {
//     console.error(err);
//     return new NextResponse(`<!DOCTYPE html><html><head>
//     <meta property="fc:frame" content="vNext" />
//     <meta property="fc:frame:image" content="${optionImageUrl}" />
//     <meta property="fc:frame:button:1" content="Prev" />
//     <meta property="fc:frame:button:2" content="Next" />
//     <meta property="fc:frame:post_url" content="${postUrl}" />
//   </head></html>`);
//   }    

//   return new NextResponse(`<!DOCTYPE html><html><head>
//     <meta property="fc:frame" content="vNext" />
//     <meta property="fc:frame:image" content="${optionImageUrl}" />
//     <meta property="fc:frame:button:1" content="Prev" />
//     <meta property="fc:frame:button:2" content="Next" />
//     <meta property="fc:frame:post_url" content="${postUrl}" />
//   </head></html>`);
// }

// export async function POST(req: NextRequest): Promise<Response> {
//   return getResponse(req);
// }

// export const dynamic = 'force-dynamic';

