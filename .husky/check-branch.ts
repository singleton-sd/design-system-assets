import { readFileSync } from 'fs';
import { resolve } from 'path';

const branchName = getCurrentBranchName();

const isValidBranchName =
  branchName === 'master' ||
  branchName === 'main' ||
  branchName === 'design' ||
  branchName === 'develop' ||
  /^release\/v\d+\.\d+\.\d+$/.test(branchName) ||
  /^(feature|hotfix)\/(\w+-\d{1,5})(-\w+)*$/.test(branchName);

if (!isValidBranchName) {
  console.error(
    'Error: Branch name must start with "feature/{TICKET_NUMBER}" or "hotfix/{TICKET_NUMBER}" or release/v{VERSION_NUMBER} or "master" or "develop"',
  );
  process.exit(1);
}

function getCurrentBranchName() {
  const headPath = resolve('.git', 'HEAD');
  const headContent = readFileSync(headPath, 'utf-8').trim();

  const branchMatch = headContent.match(/^ref: refs\/heads\/(.+)$/);

  if (branchMatch && branchMatch[1]) {
    return branchMatch[1];
  } else {
    console.error('Error: Unable to determine the current branch.');
    process.exit(1);
  }
}
