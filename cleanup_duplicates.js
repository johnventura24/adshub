const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Files to potentially remove (duplicates)
const duplicateFiles = [
  'App.js',
  'App.css',
  'LiveMetrics-simple.tsx',
  'RevenueTracker-simple.tsx',
  'EnhancedDashboard.jsx',
  'MainApp.jsx',
  'CSVUpload.jsx',
  'UploadForm.jsx'
];

// Files to keep and their reasons
const filesToKeep = {
  'App.jsx': 'Main React application entry point',
  'DataUpload.tsx': 'Primary upload component (TypeScript)',
  'LiveMetrics.tsx': 'Full-featured metrics component',
  'RevenueTracker.tsx': 'Full-featured revenue tracker',
  'styles.css': 'Main stylesheet',
  'index.css': 'Root styling',
  'index.html': 'Main HTML entry point'
};

console.log(`${colors.blue}==========================================`);
console.log(`  Duplicate File Cleanup Script`);
console.log(`==========================================${colors.reset}\n`);

// Check which files exist
console.log(`${colors.yellow}📋 Scanning for duplicate files...${colors.reset}\n`);

const existingDuplicates = [];
duplicateFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    const size = (stats.size / 1024).toFixed(2);
    existingDuplicates.push({ file, size });
    console.log(`${colors.red}❌ Found: ${file} (${size} KB)${colors.reset}`);
  }
});

if (existingDuplicates.length === 0) {
  console.log(`${colors.green}✅ No duplicate files found!${colors.reset}`);
  process.exit(0);
}

console.log(`\n${colors.magenta}📦 Files recommended to keep:${colors.reset}\n`);
Object.entries(filesToKeep).forEach(([file, reason]) => {
  const exists = fs.existsSync(file);
  const icon = exists ? '✅' : '⚠️';
  const color = exists ? colors.green : colors.yellow;
  console.log(`${color}${icon} ${file} - ${reason}${colors.reset}`);
});

// Create backup directory
const backupDir = 'backup_duplicates';
console.log(`\n${colors.blue}📁 Creating backup directory: ${backupDir}${colors.reset}`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log(`${colors.green}✅ Backup directory created${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠️  Backup directory already exists${colors.reset}`);
}

// Move duplicates to backup
console.log(`\n${colors.blue}🔄 Moving duplicate files to backup...${colors.reset}\n`);

let movedCount = 0;
existingDuplicates.forEach(({ file, size }) => {
  try {
    const backupPath = path.join(backupDir, file);
    fs.renameSync(file, backupPath);
    console.log(`${colors.green}✅ Moved: ${file} → ${backupPath}${colors.reset}`);
    movedCount++;
  } catch (error) {
    console.log(`${colors.red}❌ Error moving ${file}: ${error.message}${colors.reset}`);
  }
});

// Summary
console.log(`\n${colors.blue}==========================================`);
console.log(`  Cleanup Summary`);
console.log(`==========================================${colors.reset}\n`);
console.log(`${colors.green}✅ Files moved to backup: ${movedCount}${colors.reset}`);
console.log(`${colors.yellow}📁 Backup location: ./${backupDir}/${colors.reset}`);
console.log(`${colors.magenta}💡 Tip: Test your application. If everything works, you can delete the backup folder.${colors.reset}\n`);

// Create cleanup report
const reportContent = `# Duplicate File Cleanup Report
Date: ${new Date().toISOString()}

## Files Moved to Backup
${existingDuplicates.map(({ file, size }) => `- ${file} (${size} KB)`).join('\n')}

## Files Kept
${Object.entries(filesToKeep).map(([file, reason]) => `- ${file}: ${reason}`).join('\n')}

## Next Steps
1. Test your application thoroughly
2. If everything works correctly, delete the backup_duplicates folder
3. If issues arise, restore files from backup_duplicates

## Restoration Command
To restore all files:
\`\`\`bash
mv backup_duplicates/* .
\`\`\`
`;

fs.writeFileSync('CLEANUP_REPORT.md', reportContent);
console.log(`${colors.blue}📄 Cleanup report saved to: CLEANUP_REPORT.md${colors.reset}\n`);
