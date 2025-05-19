// Enhanced Git Commit Message Script
const { execSync } = require('child_process');

// Function to get file extension
const getFileExtension = (filename) => {
  const parts = filename.split('.');
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
    return '';
  }
  return parts.pop().toLowerCase();
};

// Function to categorize files by type
const categorizeFiles = (files) => {
  const categories = {
    'JavaScript/TypeScript': [],
    'React Components': [],
    'API Routes': [],
    'Configuration': [],
    'Documentation': [],
    'Styles': [],
    'Other': []
  };

  files.forEach(file => {
    const ext = getFileExtension(file);
    
    if (file.includes('/api/') && (ext === 'ts' || ext === 'js')) {
      categories['API Routes'].push(file);
    } else if (file.includes('/components/') && (ext === 'tsx' || ext === 'jsx')) {
      categories['React Components'].push(file);
    } else if (['js', 'ts', 'jsx', 'tsx'].includes(ext)) {
      categories['JavaScript/TypeScript'].push(file);
    } else if (['json', 'eslintrc', 'gitmessage'].some(e => file.includes(e))) {
      categories['Configuration'].push(file);
    } else if (['md', 'txt'].includes(ext)) {
      categories['Documentation'].push(file);
    } else if (['css', 'scss', 'less'].includes(ext)) {
      categories['Styles'].push(file);
    } else {
      categories['Other'].push(file);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

// Get staged files
try {
  console.log('===== Enhanced Git Commit Message Preview =====\n');
  
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only').toString().trim().split('\n').filter(Boolean);
  
  if (stagedFiles.length === 0) {
    console.log('No staged files found. Stage some files with `git add` first.');
    process.exit(0);
  }

  // Categorize files
  const categorized = categorizeFiles(stagedFiles);
  
  // Calculate stats
  const newFiles = execSync('git diff --cached --name-only --diff-filter=A').toString().trim().split('\n').filter(Boolean);
  const modifiedFiles = execSync('git diff --cached --name-only --diff-filter=M').toString().trim().split('\n').filter(Boolean);
  const deletedFiles = execSync('git diff --cached --name-only --diff-filter=D').toString().trim().split('\n').filter(Boolean);
  
  // Determine the appropriate emoji prefix
  const hasNewFeatures = newFiles.length > 0;
  const hasBugFixes = process.argv.includes('--bug-fix');
  const hasRefactoring = process.argv.includes('--refactor');
  
  let emojiPrefix = '';
  if (hasNewFeatures) emojiPrefix += '🆕';
  if (hasBugFixes) emojiPrefix += '🐛';
  if (hasRefactoring) emojiPrefix += '♻️';
  if (!emojiPrefix) emojiPrefix = '✨'; // Default to enhancement
  
  // Generate the commit message
  const messageTitle = process.argv[2] || 'Update codebase';
  
  // Generate file list summary (limited to first 5 files with "and X more" if needed)
  let fileList = [];
  let fileCount = 0;
  
  Object.keys(categorized).forEach(category => {
    fileCount += categorized[category].length;
    
    if (categorized[category].length > 0) {
      const fileNames = categorized[category].map(file => file.split('/').pop());
      if (fileList.length < 5) {
        const displayNames = fileNames.slice(0, 5 - fileList.length);
        fileList = fileList.concat(displayNames);
      }
    }
  });
  
  // If we have more files than we're showing
  const remainingFiles = fileCount - fileList.length;
  const fileListText = fileList.join(', ') + (remainingFiles > 0 ? ` and ${remainingFiles} more` : '');
  
  // Build the full commit message
  const commitMessage = `${emojiPrefix} - ${fileListText} - ${messageTitle}`;
  
  console.log('Commit Message Preview:');
  console.log('----------------------');
  console.log(commitMessage);
  console.log('\n');
  
  // Show detailed statistics
  console.log('Changes by Category:');
  console.log('------------------');
  Object.keys(categorized).forEach(category => {
    console.log(`${category} (${categorized[category].length} files):`);
    categorized[category].forEach(file => {
      const isNew = newFiles.includes(file);
      const isDeleted = deletedFiles.includes(file);
      const status = isNew ? '[NEW]' : isDeleted ? '[DEL]' : '[MOD]';
      console.log(`  ${status} ${file}`);
    });
    console.log('');
  });
  
  console.log('Summary:');
  console.log('--------');
  console.log(`Total: ${stagedFiles.length} files`);
  console.log(`New: ${newFiles.length} files`);
  console.log(`Modified: ${modifiedFiles.length} files`);
  console.log(`Deleted: ${deletedFiles.length} files`);
  
  console.log('\nTo use this commit message:');
  console.log('git commit -m "' + commitMessage + '"');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
