import { writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const commitMessageFilePath = process.argv[2];

const getGitBranch = async () => {
  try {
    const branchName = await execSync('git symbolic-ref --short HEAD').toString().trim();
    return branchName;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const getTicketNumberFromCommit = (commitMessage: string) => {
  const ticketNumberRegex = /:\s*([A-Z]{1,5}-\d{1,5})/;

  const match = commitMessage.match(ticketNumberRegex);
  return match ? match[1] : null;
};

const addTicketNumberToCommitMessage = async (commitMessage: string) => {
  const branchName = await getGitBranch();
  const ticketNumber = extractTicketNumberFromBranch(branchName);

  if (ticketNumber) {
    const modifiedCommitMessage = commitMessage.replace(/^(.*):\s*/, '$1: ' + ticketNumber + ' ');
    writeFileSync(commitMessageFilePath, modifiedCommitMessage, 'utf-8');
  }
};

const extractTicketNumberFromBranch = (branchName: string) => {
  const ticketNumberRegex = /feature|hotfix\/(\w+-\d{1,5})/;

  const match = branchName.match(ticketNumberRegex);
  return match ? match[1] : null;
};

const processCommitMessage = async () => {
  console.log('Checking ticket number on commit message');
  try {
    // Read the original commit message
    const commitMessage = await readFileSync(commitMessageFilePath, 'utf-8');

    if (commitMessage.includes('Release')) {
      console.info('Skipping ticket number as this is a release commit');
      return;
    }

    if (!getTicketNumberFromCommit(commitMessage))
      await addTicketNumberToCommitMessage(commitMessage);
  } catch (error) {
    const err = error as Error;
    console.error('An error occurred:', err.message);
    process.exit(1);
  }
};

processCommitMessage();
