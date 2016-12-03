#! /bin/bash

set -eou pipefail

./node_modules/standard/bin/cmd.js "src/**/*.js"
./node_modules/mocha/bin/mocha --require babel-core/register -R spec
exit $?
