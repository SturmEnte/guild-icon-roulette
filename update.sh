#! /bin/bash
echo "\033[104mStarting update\033[0m"
echo "\033[104mPull from GitHub\033[0m"
git pull
echo "\033[104mInstall npm packages\033[0m"
npm i
echo "\033[104mCompile Typescript\033[0m"
tsc
echo "\033[104mBuild application\033[0m"
npm run build
cd build
echo "\033[104mBuild Docker image\033[0m"
docker build -t guild-icon-roulette .
echo "\033[104mUpdated\033[0m"