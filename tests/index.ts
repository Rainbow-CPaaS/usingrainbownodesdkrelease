import "mocha";
import  * as assert from "assert";
import {RainbowBodeSDKTest} from "../build/esm";

describe("index", ()=> {
    it('should say MAIN - start', function () {
        //console.log("test MAIN - start");
        RainbowBodeSDKTest.Main();
        assert.ok(true);
    });
})
