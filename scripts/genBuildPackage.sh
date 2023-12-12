#!/bin/sh

mkdir build/assets
mv build/static/css/*.css build/assets
mv build/static/js/*.js build/assets
mv build/static/media/* build/assets
rm -rf build/static
mv build/* build/assets
cp -r zendesk-mock/assets/* build/assets
rm build/assets/iframe.html
rm build/assets/favicon.ico
cp -r zendesk-mock/translations build
cp zendesk-mock/manifest.json build

npm run edit-files

cd  build
zat package