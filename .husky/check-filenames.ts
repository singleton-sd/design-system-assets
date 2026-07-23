import { execSync } from 'child_process';

// Define your allowed file name pattern
const allowedPattern = /^([a-z0-9-]+|[A-Z][a-zA-Z0-9]+)(\.spec|\.test)?(\.d)?(\.defs)?\.tsx?$/;

// Get staged files
const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', {
  encoding: 'utf-8',
})
  .split('\n')
  .filter((file) => file.trim() !== '') // Filter out empty strings
  .filter((file) => file.endsWith('.ts')); // Only check TypeScript files

// Check for invalid files
const invalidFiles = stagedFiles.filter((file) => {
  if (!file) return false; // Ensure the file is defined
  const fileName = file.split('/').pop(); // Extract the file name
  return fileName && !allowedPattern.test(fileName.trim()); // Check the pattern if fileName is valid
});

if (invalidFiles.length > 0) {
  console.error(
    `❌ The following files do not match the naming convention (kebab-case.ts):\n${invalidFiles.join(
      '\n',
    )}`,
  );
  process.exit(1); // Exit with an error to block the commit
}

console.log('✅ All staged files follow the naming convention.');
