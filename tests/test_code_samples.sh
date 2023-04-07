#!/bin/sh
set -e

OUTPUT_FILE='../test_code_samples/_test.js'
ACCOUNT=$1
ENDPOINT=$2
API_KEY=$3

rm -fr ../test_code_samples
mkdir ../test_code_samples

cd ../test_code_samples
npm install ../mindee-api-nodejs/dist
cd -

for f in $(find docs/code_samples -name "*.txt" -maxdepth 1 | sort -h)
do
  echo "###############################################"
  echo "${f}"
  echo "###############################################"
  echo

  cat "${f}" > $OUTPUT_FILE

  if echo "$f" | grep -q "custom_v1.txt"
  then
    sed -i "s/my-account/$ACCOUNT/g" $OUTPUT_FILE
    sed -i "s/my-endpoint/$ENDPOINT/g" $OUTPUT_FILE
  fi

  sed -i "s/my-api-key/$API_KEY/" $OUTPUT_FILE
  sed -i "s/\/path\/to\/the\/file.ext/..\/mindee-api-nodejs\/tests\/data\/pdf\/blank_1.pdf/" $OUTPUT_FILE

  node $OUTPUT_FILE
done
