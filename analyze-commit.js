// A simple script to analyze the files in our recent commit
const { execSync } = require('child_process');

console.log('===== Git Commit Message Enhancement System Analysis =====\n');

// Get the last commit message
const lastCommitMessage = execSync('git log -1 --pretty=%B').toString().trim();
console.log('Last Commit Message:', lastCommitMessage);

// Count the number of files changed in the last commit
const filesChanged = execSync('git show --pretty="" --name-only HEAD').toString().trim().split('\n');
console.log(`\nTotal files changed: ${filesChanged.length}`);

// Count new files vs modified files
const newFiles = execSync('git diff-tree --no-commit-id --name-only --diff-filter=A -r HEAD').toString().trim().split('\n').filter(Boolean);
const modifiedFiles = execSync('git diff-tree --no-commit-id --name-only --diff-filter=M -r HEAD').toString().trim().split('\n').filter(Boolean);

console.log(`New files: ${newFiles.length}`);
console.log(`Modified files: ${modifiedFiles.length}`);

console.log('\n===== New Files =====');
newFiles.forEach(file => console.log(`- ${file}`));

console.log('\n===== Modified Files =====');
modifiedFiles.forEach(file => console.log(`- ${file}`));

console.log('\n===== Original commit message template =====');
try {
  // Try to read the commit message template
  const template = execSync('cat .gitmessage').toString().trim();
  console.log(template);
} catch (error) {
  console.log('Could not find .gitmessage template file');
}

console.log('\n===== Hook script that enhanced the message =====');
try {
  // Display a snippet of the prepare-commit-msg hook
  const hookScript = execSync('cat .git/hooks/prepare-commit-msg | grep -v "^#" | grep -v "^$"').toString().trim();
  console.log(hookScript);
} catch (error) {
  console.log('Could not find prepare-commit-msg hook script');
}
