import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const inputPath = path.join(process.cwd(), 'public', 'models', 'model.glb');
const outputPath = path.join(process.cwd(), 'public', 'models', 'model.compressed.glb');

async function compressModel() {
  try {
    console.log('Compressing model...');
    
    const command = `gltf-pipeline -i "${inputPath}" -o "${outputPath}" --draco.compressionLevel 7`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error('Compression error:', stderr);
      return;
    }
    
    console.log('Model compressed successfully!');
    console.log(stdout);
  } catch (error) {
    console.error('Failed to compress model:', error);
  }
}

compressModel();