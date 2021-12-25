#!/bin/bash

function help() {
  # echo "Creates index.ts"
  echo "index.sh <optionalDirectory> <optionalOptions>"
}

if [[ $1 == "help" ]]; then
  help
  exit 0
fi

scriptsDir=$(dirname "$0")
currentDir=$(pwd)
scriptsDir="$(echo "${scriptsDir/./$currentDir}")"

cd $scriptsDir
cd ../static/audio

function createIndex() {
  # echo "indexing $(pwd)"
  local folderList="$(ls -p | sort -r | grep /)"
  local fileList="$(ls -p | sort -r | grep -v /)"
  local importStrings=""
  local exportStrings=""
  for folder in $folderList
  do
    local strToRemove="/"
    local strToReplace=""
    folder="${folder/$strToRemove/$strToReplace}"
    asterisk='*'
    importStrings="import '*' as ${folder} from \"./${folder}\";\n${importStrings}"
    exportStrings="    ${folder},\n${exportStrings}"
  done
  for file in $fileList
  do
    if [[ $file == *".mp3" ]]; then
      local strToRemove=".mp3"
      local strToReplace=""
      file="${file/$strToRemove/$strToReplace}"
      importStrings="import ${file} from \"./${file}.mp3\";\n${importStrings}"
      exportStrings="    ${file},\n${exportStrings}"
    fi
  done
  echo -e $importStrings > ./index.ts
  indexFile=$(sed "s/'//g" ./index.ts)
  echo "$indexFile" > ./index.ts
  echo -e "\nexport {\n${exportStrings}}" >> ./index.ts
}

function createIndexDFS() {
  createIndex
  local folderList="$(ls -p | grep /)"
  if [[ $folderList != "" ]]; then
    for folder in $folderList
    do
      cd $folder
      createIndexDFS
      cd ..
    done
  fi
}

if [[ $(pwd) != *"src"* ]]; then
  echo "Gen script must be ran within a src folder"
elif [[ $@ == *"--recursive"* || $@ == *"-r"* ]]; then
  createIndexDFS
else
  createIndex
fi