#!/bin/bash

yarn build:api
cd ./packages/api/dist
cp ../package.json .
npm publish --access public