#!/bin/bash

cp -r _site/ _deploy/
cd _deploy
git add .
git add -u
git commit -am "Site generated at $(date)"
