import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const pinataFormData = new FormData();
    pinataFormData.append('file', file);
    
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'project-cover'
      }
    });
    pinataFormData.append('pinataMetadata', metadata);

    const options = JSON.stringify({ cidVersion: 1 });
    pinataFormData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Pinata error:', error);
      return NextResponse.json({ 
        error: error.error?.details || error.error?.reason || 'Pinata upload failed' 
      }, { status: response.status });
    }

    const { IpfsHash } = await response.json();
    return NextResponse.json({ 
      cid: IpfsHash,
      gatewayUrl: `${process.env.PINATA_GATEWAY}/ipfs/${IpfsHash}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
}