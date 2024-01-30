import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: ['Prev', 'Next'],
  image: 'https://a-frame-in-100-lines-eaj8rw720-jbreite.vercel.app/iceberg-option-1',
  post_url: 'https://a-frame-in-100-lines-eaj8rw720-jbreite.vercel.app/api/frame',
});

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: ['https://a-frame-in-100-lines-eaj8rw720-jbreite.vercel.app/iceberg-option-1'],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Testing Frames...</h1>
    </>
  );
}
