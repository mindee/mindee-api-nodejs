#!/bin/sh
set -e

OUTPUT_FILE='../test_code_samples/_test.js'
ACCOUNT=$1
ENDPOINT=$2
API_KEY=$3
API_KEY_V2=$4
MODEL_ID=$5

rm -fr ../test_code_samples
mkdir ../test_code_samples

cd ../test_code_samples
npm install ../mindee-api-nodejs/dist --ignore-scripts --no-bin-links
cd -

for f in $(find docs/code_samples -maxdepth 1 -name "*.txt" -not -name "workflow_*.txt" | sort -h)
do
  if echo "${f}" | grep -q "default_v2.txt"; then
    if [ -z "${API_KEY_V2}" ] || [ -z "${MODEL_ID}" ]; then
      echo "Skipping ${f} (API_KEY_V2 or MODEL_ID not supplied)"
      echo
      continue
    fi
  fi

  echo "###############################################"
  echo "${f}"
  echo "###############################################"
  echo

  sed "s/my-api-key/$API_KEY/" "${f}" > $OUTPUT_FILE
  sed -i "s/\/path\/to\/the\/file.ext/..\/mindee-api-nodejs\/tests\/data\/file_types\/pdf\/blank_1.pdf/" $OUTPUT_FILE

  if echo "${f}" | grep -q "default_v2.txt"
  then
    sed -i "s/MY_API_KEY/$API_KEY_V2/" $OUTPUT_FILE
    sed -i "s/MY_MODEL_ID/$MODEL_ID/" $OUTPUT_FILE
  else
    sed -i "s/my-api-key/$API_KEY/" $OUTPUT_FILE
  fi

  if echo "$f" | grep -q "custom_v1.txt"
  then
    sed -i "s/my-account/$ACCOUNT/g" $OUTPUT_FILE
    sed -i "s/my-endpoint/$ENDPOINT/g" $OUTPUT_FILE
  fi

  if echo "${f}" | grep -q "default.txt"
  then
    sed -i "s/my-account/$ACCOUNT/" $OUTPUT_FILE
    sed -i "s/my-endpoint/$ENDPOINT/" $OUTPUT_FILE
    sed -i "s/my-version/1/" $OUTPUT_FILE
  fi

  if echo "${f}" | grep -q "default_async.txt"
    then
      sed -i "s/my-account/mindee/" $OUTPUT_FILE
      sed -i "s/my-endpoint/invoice_splitter/" $OUTPUT_FILE
      sed -i "s/my-version/1/" $OUTPUT_FILE
    fi

  sleep 0.6  # avoid too many request errors
  node $OUTPUT_FILE
done
