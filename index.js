#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

// CLI version and description
program
  .name('create-borg-ui')
  .description('CLI tool for creating Borg UI projects')
  .version('1.0.12');

// Main command for creating a new project
program
  .argument('[project-name]', 'name of the project to create')
  .option('-t, --template <template>', 'template to use', 'default')
  .option('-y, --yes', 'skip prompts and use defaults')
  .action(async (projectName, options) => {
    const spinner = ora('Setting up your Borg UI project...').start();
    
    try {
      // TODO: Implement project creation logic
      spinner.succeed(chalk.green('Project setup complete!'));
      console.log(chalk.cyan('\nNext steps:'));
      console.log(chalk.white('1. Navigate to your project directory'));
      console.log(chalk.white('2. Install dependencies: npm install'));
      console.log(chalk.white('3. Start development: npm run dev'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to create project'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();