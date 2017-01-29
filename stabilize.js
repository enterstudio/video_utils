// Copyright 2017 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.
const fs = require('fs');
const path = require('path');
const childprocess = require("child_process");

const DIR = './';
const FILE_TYPE = '.MOV';
const PROCESSED_MARKER = 'stable';

fs.readdir(DIR, function(err, files) {
  if( err ) {
    console.error('Could not get files in dir', err );
    process.exit(-1);
  } 

  const processNextFile = function(index) {
    if (index < files.length) {
      var nextFile = path.join(DIR, files[index]);

      fs.stat(nextFile, function(error,stat) {
        if (error) {
          console.error("Could not stat file", error);
    	  processNextFile(index + 1);
        } 

        // validate its a file we are going to process
        if (stat.isFile() &&
    	    nextFile.toString().endsWith(FILE_TYPE) &&
	    (nextFile.toString().indexOf(PROCESSED_MARKER) === -1)) {

	  nextFile = nextFile.substring(0, nextFile.indexOf(FILE_TYPE));
	  console.log('processing:' + nextFile);
	  const proc = childprocess.spawn('stabilize.bat', [nextFile]);
	  proc.stdout.on('data', (data) => {
            console.log(data.toString());
          });
	  proc.stderr.on('data', (data) => {
            console.log(data.toString());
          });
	  proc.stderr.on('close', () => {
  	    processNextFile(index + 1);
          });
        } else {
  	  processNextFile(index + 1);
        };
      });
    } else {
      console.log('Done');
    };
  };

  processNextFile(0);
});

