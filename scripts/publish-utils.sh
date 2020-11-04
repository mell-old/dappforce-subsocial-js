#!/bin/bash

yarn build:utils
cd ./packages/utils/dist
cp ../package.json .
npm publish --access public