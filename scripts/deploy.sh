#!/bin/sh

# SSH_OPTIONS='-p50008'
# SSH_TARGET=root@dev02.xiaoman.cc
# DIRECTORY_TARGET=/xvda2/codebase/dev/xcompass
# CONFIG_TAG=dev

RSYNC_SSH_OPTIONS=''
if [ "$SSH_OPTIONS" != '' ]; then
    RSYNC_SSH_OPTIONS="ssh $SSH_OPTIONS"
fi
if [ "$SSH_TARGET" = '' ]; then
    echo "SSH_TARGET not set"
    exit 1
fi
if [ "$DIRECTORY_TARGET" = '' ]; then
    echo "DIRECTORY_TARGET not set"
    exit 1
fi
if [ "$CONFIG_TAG" = '' ]; then
    echo "CONFIG_TAG not set"
    exit 1
fi

RSYNC_TARGET=$SSH_TARGET:$DIRECTORY_TARGET

rm -rf src/frontend/dist/* src/backend/public/* \
    && npm run build-frontend \
    && mv src/frontend/dist/* src/backend/public/ \
    && rsync -a --progress \
        --include='.babelrc' \
        --include='package.json' \
        --exclude='*' \
        -e "$RSYNC_SSH_OPTIONS" . "$RSYNC_TARGET" \
    && rsync -a --progress \
        --exclude='*.map' \
        --exclude='frontend/' \
        -e "$RSYNC_SSH_OPTIONS" src "$RSYNC_TARGET" \
    && ssh $SSH_OPTIONS $SSH_TARGET "cd $DIRECTORY_TARGET && cnpm install --production && mv src/backend/config/app{-$CONFIG_TAG,}.json" \
    && echo "Done"

