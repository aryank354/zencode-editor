const fs = require('fs-extra');
const path = require('path');

// Template paths from your lib/template.ts
const templatePaths = {
  REACT: 'zencode-starters/react-ts',
//   NEXTJS: 'zencode-starters/nextjs-new',
//   EXPRESS: 'zencode-starters/express-simple',
//   VUE: 'zencode-starters/vue',
//   HONO: 'zencode-starters/hono-nodejs-starter',
//   ANGULAR: 'zencode-starters/angular',
};

// Dynamic import for ESM module
async function generateCache() {
  try {
    // Import the TypeScript ESM module - use .ts extension
    const pathToJsonModule = await import('../features/playground/libs/path-to-json.ts');
    const { saveTemplateStructureToJson } = pathToJsonModule;

    const outputDir = path.join(process.cwd(), 'template-cache');
    
    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    
    console.log('🚀 Generating template JSON cache...\n');
    
    for (const [key, templatePath] of Object.entries(templatePaths)) {
      try {
        const inputPath = path.join(process.cwd(), templatePath);
        const outputPath = path.join(outputDir, `${key}.json`);
        
        console.log(`📦 Processing ${key}...`);
        console.log(`   Input: ${inputPath}`);
        console.log(`   Output: ${outputPath}`);
        
        await saveTemplateStructureToJson(inputPath, outputPath);
        console.log(`✅ Generated ${key}.json\n`);
      } catch (error) {
        console.error(`❌ Failed to generate ${key}:`, error.message);
        console.error(error);
        process.exit(1);
      }
    }
    
    console.log('✨ All template cache files generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

generateCache();
