'use strict';

var assert = require('chai').assert;
var signetChecker = require('../index');
var signetRegistrar = require('signet-registrar');
var signetParser = require('signet-parser')();

require('./utils/approvals.config.js');

function prettyJson (value){
    return JSON.stringify(value, null, 4);
}

describe('Signet Type Correctness Checker', function () {

    var checker;

    beforeEach(function () {
        var registrar = signetRegistrar();

        registrar.set('*', function () { return true; });
        registrar.set('number', function (value) { return typeof value === 'number'; });
        registrar.set('object', function (value) { return typeof value === 'object'; });
        registrar.set('string', function (value) { return typeof value === 'string'; });
        registrar.set('boolean', function (value) { return typeof value === 'boolean'; });
        registrar.set('null', function (value) { return value === null; });

        checker = signetChecker(registrar);
    });

    describe('checkType', function () {

        it('should return true when type is okay', function () {
            assert.equal(checker.checkType(signetParser.parseType('number')), true);
        });

        it('should return false when type is okay', function () {
            assert.equal(checker.checkType(signetParser.parseType('foo')), false);
        });

    });

    describe('checkSignature', function () {

        it('should return null when signature is okay', function () {
            var signature = '* => string => number => object';
            var ast = signetParser.parseSignature(signature);

            assert.strictEqual(checker.checkSignature(ast), null);
        });

        it('should return array of unacceptable types when it fails', function () {
            var signature = 'foo => string => bar => number';
            var ast = signetParser.parseSignature(signature);

            this.verify(prettyJson(checker.checkSignature(ast)));
        });

    });


});