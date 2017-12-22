'use strict';
const {unlinkSync} = require('fs');

const rimraf = require('rimraf');
const exec = require('child_process').exec;

function asyncExecuteCommand(command) {
  return new Promise((resolve, reject) =>
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    })
  );
}

function asyncRimRaf(filepath) {
  return new Promise((resolve, reject) =>
    rimraf(filepath, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    })
  );
}

const packProject = async () => {
  const CDW = process.cwd();
  const {name} = require(CDW + "/package.json");

  await asyncRimRaf(`${CDW}/node_modules/${name}`);
  const tgzName = (await asyncExecuteCommand(`npm pack`)).trim();
  (await asyncExecuteCommand(`npm install ./${tgzName} --force`));

  unlinkSync(tgzName);
};

const buildProject = async () => {
  await asyncExecuteCommand("npm run prepublish");
}

console.log(process.cwd());

module.exports = {
  packProject,
  buildProject
};