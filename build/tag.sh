#!/bin/bash

node build/update-citation.js

# =================================================================

new_version=$(date '+%Y%m%d.%H%M%S')

git tag $new_version
git push origin $new_version

# # =================================================================

git add .
git commit -m "${new_version}"
git push --force-with-lease

# =================================================================

GITHUB_HOMEPAGE=`jq -r '.homepage' package.json`
#echo $GITHUB_HOMEPAGE

GITHUB_USER=`echo $GITHUB_HOMEPAGE | awk -F'/' '{print $4}'`

GITHUB_REPO=`jq -r '.name' package.json`
#echo $GITHUB_REPO

echo "================================================"
echo "Integrate GitHub with Zenodo: https://rb.gy/ql60qi"
echo "GitHub Homepage:  ${GITHUB_HOMEPAGE}"
echo "Zenono GitHub Setting:  https://zenodo.org/account/settings/github/"
echo "Zenono Repo:  https://zenodo.org/account/settings/github/repository/${GITHUB_USER}/${GITHUB_REPO}"
echo "================================================"