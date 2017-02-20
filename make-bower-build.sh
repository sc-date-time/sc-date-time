#!/usr/bin/env bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="master"

# Run only test cases if this is not a release
if [ -z "$TRAVIS_TAG" ]; then
    exit 0
fi

# Get the deploy key by using Travis's stored variables.
echo "$id_ed25519_key" > deploy_key
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

BOWER_REPO_DIR='out'
CWD="$PWD"

git clone $BOWER_REPO $BOWER_REPO_DIR
cd $BOWER_REPO_DIR
git checkout $TARGET_BRANCH || git checkout -b $TARGET_BRANCH

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# Copy all build content to the bower repo
git rm -rf .
cp -r ../dist .
cp ../inert-bower.json bower.json
cp ../LICENSE LICENSE

git add dist
git add bower.json
git add LICENSE

git commit -am "Release version $TRAVIS_TAG"
git tag -d "$TRAVIS_TAG" || true
git tag "$TRAVIS_TAG"
git push origin -f $TARGET_BRANCH $TRAVIS_TAG
