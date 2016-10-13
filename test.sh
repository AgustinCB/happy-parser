#! /bin/bash

./node_modules/standard/bin/cmd.js src
./node_modules/mocha/bin/mocha --require babel-core/register -R spec
exit $?
