'use strict';
const {unlinkSync, writeFileSync, readFileSync} = require('fs');
const rimraf = require('rimraf');
const exec = require('child_process').exec;

const CDW = process.cwd();
const packageFile = CDW + "/package.json";

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

const lastLine = (file) => {
  const lines = file.split('\n');
  return lines.pop();
};

let packageJson = null;
const restorePackage = () => {
  if (packageJson) {
    console.log('unmasking package.json');
    writeFileSync(packageFile, packageJson);
    packageJson = null;
  }
}

const packProject = async () => {
  packageJson = readFileSync(packageFile);
  const packageData = require(packageFile);
  const {name} = packageData;

  await asyncRimRaf(`${CDW}/node_modules/${name}`);
  console.log('packing...');
  const tgzName = lastLine((await asyncExecuteCommand(`npm pack`)).trim());
  console.log('masking package.json');
  try {
    writeFileSync(packageFile, JSON.stringify({
      ...packageData,
      name: 'packaging-' + name
    }));
    console.log(`unpacking... ${tgzName}`);
    (await asyncExecuteCommand(`yarn add ./${tgzName}`));
  } finally {
    restorePackage();
  }

  unlinkSync(tgzName);
};

process.on('SIGINT', restorePackage);
process.on('SIGTERM', restorePackage);

console.log(process.cwd());

module.exports = {
  packProject
};