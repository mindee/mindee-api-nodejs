#!/bin/sh
set -e

TEST_FILE='./tests/data/file_types/pdf/blank_1.pdf'

for f in $(
  find docs/code_samples -maxdepth 1 -name "v2_*.txt" | sort -h
)
do
  echo "###############################################"
  echo "${f}"
  echo "###############################################"
  echo

  if echo "${f}" | grep -q "v2_classification.txt"
  then
    node ./dist/bin/mindeeV2.js -d classification -m "${MINDEE_V2_SE_TESTS_CLASSIFICATION_MODEL_ID}" "${TEST_FILE}"
  fi

  if echo "${f}" | grep -q "v2_crop.txt"
  then
    node ./dist/bin/mindeeV2.js -d crop -m "${MINDEE_V2_SE_TESTS_CROP_MODEL_ID}" "${TEST_FILE}"
  fi

  if echo "${f}" | grep -q "v2_extraction.txt"
  then
    node ./dist/bin/mindeeV2.js -d extraction -m "${MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID}" "${TEST_FILE}"
  fi

  if echo "${f}" | grep -q "v2_ocr.txt"
  then
    node ./dist/bin/mindeeV2.js -d ocr -m "${MINDEE_V2_SE_TESTS_OCR_MODEL_ID}" "${TEST_FILE}"
  fi

  if echo "${f}" | grep -q "v2_split.txt"
  then
    node ./dist/bin/mindeeV2.js -d split -m "${MINDEE_V2_SE_TESTS_SPLIT_MODEL_ID}" "${TEST_FILE}"
  fi

  sleep 0.5  # avoid too many request errors
done
