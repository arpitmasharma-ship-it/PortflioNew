import { isCloudinaryConfigured, ensureCloudinary, pingCloudinary, uploadImageBuffer, deleteCloudinaryAsset } from '../services/uploadService.js';
import { env } from '../config/env.js';

async function main() {
  console.log('\n--- Checking Cloudinary Configuration ---\n');

  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is NOT configured in server/.env\n');
    console.log('To enable image uploads:');
    console.log('1. Create a free account at https://cloudinary.com');
    console.log('2. Copy your Cloud Name, API Key, and API Secret from your dashboard');
    console.log('3. Open server/.env and add:');
    console.log('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.log('   CLOUDINARY_API_KEY=your_api_key');
    console.log('   CLOUDINARY_API_SECRET=your_api_secret');
    console.log('\nOr alternatively:');
    console.log('   CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>\n');
    process.exit(1);
  }

  console.log('✓ Configuration variables found:');
  if (env.cloudinary.cloudName) {
    console.log(`  Cloud Name: ${env.cloudinary.cloudName}`);
    console.log(`  API Key:    ${env.cloudinary.apiKey ? '******' + env.cloudinary.apiKey.slice(-4) : '(empty)'}`);
    console.log(`  API Secret: ${env.cloudinary.apiSecret ? '********' : '(empty)'}`);
  } else if (process.env.CLOUDINARY_URL || env.cloudinary.url) {
    console.log('  Configured via CLOUDINARY_URL');
  }

  console.log('\nTesting connection to Cloudinary API...');
  try {
    ensureCloudinary();
    const ping = await pingCloudinary();
    console.log('✓ Connection verified:', ping.status);

    // Test a tiny 1x1 transparent PNG upload
    console.log('Testing image upload with test buffer...');
    const test1x1Png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const result = await uploadImageBuffer(test1x1Png, 'portfolio_test');
    console.log('✓ Test upload succeeded!');
    console.log(`  Uploaded URL: ${result.url}`);
    console.log(`  Public ID:    ${result.publicId}`);

    // Clean up test image
    console.log('Cleaning up test upload...');
    await deleteCloudinaryAsset(result.publicId);
    console.log('✓ Test image cleaned up successfully!');

    console.log('\n🎉 Cloudinary is 100% configured and working correctly!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Cloudinary error:', err.message);
    console.error('\nPlease double check your credentials in server/.env\n');
    process.exit(1);
  }
}

main();
