import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Prev',
    },
    {
      label: 'Next',
    }
  ],
  image: 'https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-1.png',
  post_url: 'https://a-frame-in-100-lines-jbreite.vercel.app/api/frame',
});

export const metadata: Metadata = {
  title: 'icberg.frame',
  description: '🧊🧊🧊',
  openGraph: {
    title: 'iceberg.frame',
    description: '🧊🧊🧊',
    images: ['https://a-frame-in-100-lines-jbreite.vercel.app/iceberg-option-1.png'],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Iceberg.Frame </h1>
    </>
  );
}
