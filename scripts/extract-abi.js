const fs = require('fs');
const path = require('path');

async function extractABI() {
  const artifactsDir = path.join(__dirname, '../artifacts/contracts');
  const outputDir = path.join(__dirname, '../frontend/src/contracts');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Extract Chat ABI (try both Chat and ChatSepolia)
  let chatPath = path.join(artifactsDir, 'Chat.sol/Chat.json');
  if (!fs.existsSync(chatPath)) {
    chatPath = path.join(artifactsDir, 'ChatSepolia.sol/ChatSepolia.json');
  }
  if (fs.existsSync(chatPath)) {
    const chatArtifact = JSON.parse(fs.readFileSync(chatPath, 'utf8'));
    fs.writeFileSync(
      path.join(outputDir, 'Chat.json'),
      JSON.stringify(chatArtifact.abi, null, 2)
    );
  }

  // Extract Aggregation ABI (try both Aggregation and AggregationSepolia)
  let aggregationPath = path.join(artifactsDir, 'Aggregation.sol/Aggregation.json');
  if (!fs.existsSync(aggregationPath)) {
    aggregationPath = path.join(artifactsDir, 'AggregationSepolia.sol/AggregationSepolia.json');
  }
  if (fs.existsSync(aggregationPath)) {
    const aggregationArtifact = JSON.parse(fs.readFileSync(aggregationPath, 'utf8'));
    fs.writeFileSync(
      path.join(outputDir, 'Aggregation.json'),
      JSON.stringify(aggregationArtifact.abi, null, 2)
    );
  }

  console.log('ABIs extracted successfully!');
}

extractABI().catch(console.error);

