'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var approvals = require('approvals');

function writeFileIfNoStat (filePath) {
    try{
        var stats = fs.statSync(filePath);
    } catch (e) {
        fs.writeFile(filePath, '', { encoding: 'utf8' });
    }
}

function BeyondCompare () {}

BeyondCompare.prototype = {
    name: 'BeyondCompare4',
    canReportOn: function () { return true },
    report: function (approvedPath, receivedPath) {
        var bcomparePath = '/Program Files/Beyond Compare 4/bcompare.exe';
        var opts = [ receivedPath, approvedPath ];

        writeFileIfNoStat(approvedPath);

        spawn(bcomparePath, opts, { detached: true });
    }
};

var approvalsConfig = {
  reporters:  [ new BeyondCompare() ],
  normalizeLineEndingsTo: '\n', // default
  appendEOL: true,
  EOL:  require('os').EOL,
  errorOnStaleApprovedFiles: true,
  stripBOM: false
};

approvals.configure(approvalsConfig);
approvals.mocha('./test/approvals');