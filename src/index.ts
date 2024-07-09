/* // <reference path="./rainbow-node-sdk/typings/rainbow-sdk-node.d.ts" />
// ; / <reference types="rainbow-node-sdk" />
/// <reference path="rainbow-node-sdk" />
    //import * as rainbowNodeSDK from 'rainbow';

 */
// ; / <reference path="../node_modules/rainbow-node-sdk/typings/rainbow-sdk-node.d.ts" />
// import {} from './node_modules/rainbow-node-sdk/typings/rainbow-sdk-node'; // /lib/common/models/Channel/Channel
//import {index} from "rainbow-node-sdk"; // /lib/common/models/Channel/Channel
//import {DataStoreType} from "rainbow-node-sdk";

import "rainbow-node-sdk";
// import "webrtc";
// import {NodeSDK} from "";
//import {NodeSDK} from "rainbow-node-sdk/lib/NodeSDK";

import {NodeSDK, LogLevelAreas} from "rainbow-node-sdk";

import {DataStoreType} from "rainbow-node-sdk/lib/config/config";
import {Logger} from "rainbow-node-sdk/lib/common/Logger";
import {main} from "ts-node/dist/bin";
import * as util from "util";
import {Bubble} from "rainbow-node-sdk/lib/common/models/Bubble";
import {setTimeoutPromised} from "rainbow-node-sdk/lib/common/Utils";
import {LEVELSNAMES} from "../../rainbow-node-sdk-sample2/lib/common/LevelLogs";
import inquirer from "inquirer";

let rainbowSDK : NodeSDK; //RainbowSdk;
let logger : Logger;
export module RainbowBodeSDKTest {
    function handleEvents() {
        rainbowSDK.events.on("rainbow_onready", (data: any) => {
            // do something when the SDK is ready to be used
            logger.log("debug", "MAIN - rainbow_onready - rainbow onready. data : ", data);
        });

        rainbowSDK.events.on("rainbow_onstarted", (data: any) => {
            // do something when the SDK has been started (= initialized), but not ready to be used.
            logger.log("debug", "MAIN - rainbow_onstarted - rainbow onstarted. data : ", data);
        });

        rainbowSDK.events.on("rainbow_onstopped", (data: any) => {
            logger.log("debug", "MAIN - rainbow_onstopped - rainbow event received. data : ", data);

        });

        let bubbleInvitationReceived = null;
        rainbowSDK.events.on("rainbow_onbubbleinvitationreceived", async (bubble: Bubble) => {
            logger.log("debug", "MAIN - (rainbow_onbubbleinvitationreceived) - rainbow event received.", bubble);
            bubbleInvitationReceived = bubble;

            logger.log("debug", "MAIN - [testCreateBubbles    ] :: before setTimeoutPromised.");
            //setTimeoutPromised(6000).then(async () => {
                logger.log("debug", "MAIN - [testCreateBubbles    ] :: after setTimeoutPromised.");
                let utc = new Date().toJSON().replace(/-/g, "/");
                logger.log("debug", "MAIN - [testCreateBubbles    ] :: createBubble request ok", bubble);
                let message = "message de test : " + utc;
                await rainbowSDK.im.sendMessageToBubbleJid(message, bubble.jid, "en", undefined, "subject", undefined, "middle");
                /* await rainbowSDK.im.sendMessageToBubbleJid(message, bubble.jid, "en", {
                    "type": "text/markdown",
                    "message": message
                }, "subject", undefined, "middle"); // */
            //});
        });
    }

    function commandLineInteraction() {
        let questions = [
            {
                type: "input",
                name: "cmd",
                message: "Command> "
            }
        ];
        logger.log("debug", "MAIN - commandLineInteraction, enter a command to eval : \n" +
            "   * console.log(rainbowSDK.ServiceName.APIMethod()) // to log on console the result of a call to rainbow node sdk api method.\n" +
            "   * example : console.log(rainbowSDK.contacts.getAll()) // to get all the logged in user's contacts.\n" +
            "   * by // to quit the program."); //logger.colors.green(JSON.stringify(result)));
        let prompt = inquirer.createPromptModule();
        // @ts-ignore
        prompt(questions).then((answers : any) => {
            //console.log(`Hi ${answers.cmd}!`);
            logger.log("debug", "MAIN - cmd entered : ", answers.cmd); //logger.colors.green(JSON.stringify(result)));
            try {
                if (answers.cmd === "by") {
                    logger.log("debug", "MAIN - exit."); //logger.colors.green(JSON.stringify(result)));
                    rainbowSDK.stop().then(() => { process.exit(0); });
                }else {
                    logger.log("debug", "MAIN - run cmd : ", answers.cmd); //logger.colors.green(JSON.stringify(result)));
                    eval(answers.cmd);
                    commandLineInteraction();
                }
            }
            catch (e) {
                logger.log("debug", "MAIN - CATCH Error : ", e); //logger.colors.green(JSON.stringify(result)));
                commandLineInteraction();
            }
        });
    }

    export function Main() {
        console.log("MAIN - Start");

        const ngrok = require('ngrok');
        let urlS2S;
        let logLevelAreas = new LogLevelAreas(LEVELSNAMES.ERROR, true, false, false);
        let options = {
            "rainbow": {
                "host": "sandbox",                      // Can be "sandbox" (developer platform), "official" or any other hostname when using dedicated AIO
                // "mode": "s2s"
                "mode": "xmpp"
            },
            "credentials": {
                "login": "",  // The Rainbow email account to use
                "password": "",
            },
            "s2s": {
                "hostCallback": urlS2S,
                //"hostCallback": "http://70a0ee9d.ngrok.io",
                "locallistenningport": "4000"
            },
            // Application identifier
            "application": {
                "appID": "",
                "appSecret": ""

            },
            // */
            /*
                // Proxy configuration
                proxy: {
                    host: "",
                    port: 8080,
                    protocol: "http",
                    user: "",
                    password: "",
                    secureProtocol: "SSLv3_method"
                }, // */
            // Logs options
            "logs": {
                "enableConsoleLogs": true,
                "enableFileLogs": false,
                "color": true,
                "level": "debug",
                "areas": logLevelAreas,
                "customLabel": "RainbowSample",
                "system-dev": {
                    "internals": true,
                    "http": true,
                },
                "file": {
                    "path": "c:/temp/",
                    "customFileName": "R-SDK-Node-TS-Sample",
                    //"level": 'info',                    // Default log level used
                    "zippedArchive": false /*,
            "maxSize" : '10m',
            "maxFiles" : 10 // */
                }
            },
            "testOutdatedVersion": false,
            // IM options
            "im": {
                "sendReadReceipt": true,
                "messageMaxLength": 1024,
                "sendMessageToConnectedUser": true,
                "conversationsRetrievedFormat": "small",
                "storeMessages": false,
                "nbMaxConversations": 15,
                "rateLimitPerHour": 1000,
                "messagesDataStore": DataStoreType.StoreTwinSide // */
            },
            // Services to start. This allows to start the SDK with restricted number of services, so there are less call to API.
            // Take care, severals services are linked, so disabling a service can disturb an other one.
            // By default all the services are started. Events received from server are not yet filtered.
            // So this feature is realy risky, and should be used with much more cautions.
            "servicesToStart": {
                "bubbles": {
                    "start_up": true,
                },
                "telephony": {
                    "start_up": true,
                },
                "channels": {
                    "start_up": true,
                },
                "admin": {
                    "start_up": true,
                },
                "fileServer": {
                    "start_up": true,
                },
                "fileStorage": {
                    start_up: true,
                },
                "calllog": {
                    "start_up": true,
                },
                "favorites": {
                    "start_up": true,
                }, //need services :
                "webrtc": {
                    "start_up": true,
                    "optional": true
                } // */
            } // */
        };
        process.argv.forEach((val, index) => {
            //console.log(`${index}: ${val}`);
            if (`${val}`.startsWith("login=")) {
                options.credentials.login = `${val}`.substring(6);
            }
            if (`${val}`.startsWith("password=")) {
                options.credentials.password = `${val}`.substring(9);
            }
            if (`${val}`.startsWith("host=")) {
                options.rainbow.host = `${val}`.substring(5);
            }
            if (`${val}`.startsWith("appID=")) {
                options.application.appID = `${val}`.substring(6);
            }
            if (`${val}`.startsWith("appSecret=")) {
                options.application.appSecret = `${val}`.substring(10);
            }
        });


        // To add the name of the connected user in logs. Useful for debug when using multiple instance of the SDK in same program to connect several bots.
        // Of course it is not a good idea on production system to do it because it does not complain the RGPD.
        options.logs.customLabel = options.credentials.login;

        rainbowSDK = new NodeSDK(options);
        // To use the same logger than the SDK. It is not recommended for real programs.
        logger = rainbowSDK._core._logger;

        handleEvents();

        let token;

        rainbowSDK.start(token).then(async (result: any) => {
            try {
                // Do something when the SDK is started
                logger.log("debug", "MAIN - rainbow SDK started result : ", logger.colors.green(result)); //logger.colors.green(JSON.stringify(result)));

                commandLineInteraction();
            } catch (err) {
                console.log("MAIN - Error during starting : " + util.inspect(err));
            }
        });
    }
}

RainbowBodeSDKTest.Main();
