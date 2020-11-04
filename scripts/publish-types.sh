#!/bin/bash

yarn build:types
cd ./packages/types/dist
cp ../package.json .
npm publish --access public