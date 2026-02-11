#!/bin/bash
set -e

IMAGE_NAME="ghcr.io/tybali/zero-to-gpt"
TAG="${1:-latest}"

echo "Building image: ${IMAGE_NAME}:${TAG}"
docker build -t "${IMAGE_NAME}:${TAG}" .

echo "Pushing image: ${IMAGE_NAME}:${TAG}"
docker push "${IMAGE_NAME}:${TAG}"

echo "Done! Image pushed to ${IMAGE_NAME}:${TAG}"
