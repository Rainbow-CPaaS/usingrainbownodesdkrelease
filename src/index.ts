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

import {NodeSDK} from "rainbow-node-sdk";
//import {LogLevelAreas} from "rainbow-node-sdk";
//import {LEVELSNAMES} from "rainbow-node-sdk/lib/common/LevelLogs.js";

import {DataStoreType} from "rainbow-node-sdk/lib/config/config.js";
import {Logger} from "rainbow-node-sdk/lib/common/Logger.js";
import {main} from "ts-node/dist/bin";
import * as util from "util";
import {Bubble} from "rainbow-node-sdk/lib/common/models/Bubble.js";
//import {msToTime, setTimeoutPromised} from "rainbow-node-sdk/lib/common/Utils.js";
import {setTimeoutPromised} from "rainbow-node-sdk/lib/common/Utils.js";
import inquirer from "inquirer";
import {writeFileSync} from "node:fs";

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

    function msToTime(duration: number): string {
        let ms: number = duration % 1000;
        duration = (duration - ms) / 1000;
        let secs: number = duration % 60;
        duration = (duration - secs) / 60;
        let mins: number = duration % 60;
        duration = (duration - mins) / 60;
        let hrs: number = duration % 60;
        let days: number = (duration - hrs) / 24;

        let hours: string = (hrs < 10) ? "0" + hrs : hrs.toString();
        let minutes: string = (mins < 10) ? "0" + mins : mins.toString();
        let seconds: string = (secs < 10) ? "0" + secs : secs.toString();
        let milliseconds: string = (ms < 10) ? "0" + ms : ms.toString();

        //return hrs + ':' + mins + ':' + secs + '.' + ms;
        return (days + " Jrs " + hours + ":" + minutes + ":" + seconds + "." + milliseconds);
    }

    async function testloadConversationHistoryAsyncBubbleTestBotName_2024() {
        // To be used with user vincent00 on .Net
        let bubbles = rainbowSDK.bubbles.getAllActiveBubbles();

        for (const bubble of bubbles) {
            //if (bubble.name.indexOf("testBubbleEvents")!= -1) {
            //if (bubble.name.indexOf("bulleDeTest")!= -1) {
            if (bubble.name.indexOf("testBotName_2024/02/09T10:35:36.732ZGuestUser")!= -1) {
                logger.log("debug", "MAIN - testloadConversationHistoryAsyncBubbleTestBotName_2024 Found bubble.name : ", bubble.name, ", bubble.isActive : ", bubble.isActive);
                testloadConversationHistoryAsyncBubbleByJid(bubble.jid).then((res) => {
                    logger.log("debug", "MAIN - testloadConversationHistoryAsyncBubbleTestBotName_2024 testloadConversationHistoryAsyncBubbleByJid treated.");
                });
            } else {
                logger.log("debug", "MAIN - testloadConversationHistoryAsyncBubbleTestBotName_2024 NOT Found bubble.name : ", bubble.name, ", buibble.isActive : ", bubble.isActive);
            }
        }
    }

    async function testloadConversationHistoryAsyncBubbleOpenrainbowNet() {
        // To be used on PROD.
        let bubbles = rainbowSDK.bubbles.getAllBubbles();
        if (bubbles.length > 0) {
            //let bubble = bubbles[0];
            //let jid = "room_61aee9e9d7e94cacbce7234e3fca93f2@muc.openrainbow.com/a9b77288b939470b8da4611cc2af1ed1@openrainbow.com" // jid of the bubble "openrainbow.net" on .COM platform
            let jid = "room_61aee9e9d7e94cacbce7234e3fca93f2@muc.openrainbow.com" // jid of the bubble "openrainbow.net" on .COM platform
            await testloadConversationHistoryAsyncBubbleByJid(jid);
        }
    }

    async function testloadConversationHistoryAsyncBubbleByJid(jid = "room_61aee9e9d7e94cacbce7234e3fca93f2@muc.openrainbow.com") {
        // To be used on PROD.
        let bubbles = rainbowSDK.bubbles.getAllBubbles();
        if (bubbles.length > 0) {
            //let bubble = bubbles[0];
            //let jid = "room_61aee9e9d7e94cacbce7234e3fca93f2@muc.openrainbow.com/a9b77288b939470b8da4611cc2af1ed1@openrainbow.com" // jid of the bubble "openrainbow.net" on .COM platform
            //let jid = "room_61aee9e9d7e94cacbce7234e3fca93f2@muc.openrainbow.com" // jid of the bubble "openrainbow.net" on .COM platform
            let startDate: number | Date | undefined = undefined// new Date();
            rainbowSDK.events.on("rainbow_onloadConversationHistoryCompleted", (conversationHistoryUpdated: { messages: { length: any; toSmallString: () => any; }; }) => {
                // do something when the SDK has been started
                logger.log("info", "MAIN - (rainbow_onloadConversationHistoryCompleted) - rainbow conversation history loaded completed, conversationHistoryUpdated?.messages?.length : ", conversationHistoryUpdated?.messages?.length);
                let stopDate = new Date();
                // @ts-ignore
                let startDuration = Math.round(stopDate - startDate);
                logger.log("info", "MAIN - testloadConversationHistoryAsyncBubbleByJid loadConversationHistoryAsync duration : " + startDuration + " ms => ", msToTime(startDuration));
                let utc = new Date().toJSON().replace(/-/g, "_").replace(/:/g,"_");
                let fileName = "listMsgs_"+utc ;
                const path = 'c:/Temp/'+fileName+'.txt';
                //writeFileSync(path, "", "utf8");

                try {
                    let data = conversationHistoryUpdated.messages.toSmallString();
                    writeFileSync(path, data, "utf8");
                    //appendFileSync(path, data);
                } catch (err) {

                }

                /*
                 for (let i = 0; i < conversationHistoryUpdated?.messages?.length ; i++) {
                    let msg = conversationHistoryUpdated?.messages[i];
                    logger.log("info", "MAIN - testloadConversationHistoryAsyncBubbleByJid conversationHistoryUpdated.messages[" + i + "] id : ", msg.id, ", fromJid : ", msg.fromJid, ", date : ", msg.date, ", content : ", msg.content);
                }
                // */

                if (rainbowSDK) {
                    rainbowSDK.stop().then(async () => {
                        await setTimeoutPromised(10000);
                        process.exit(0);
                    }).catch((err: any) => {
                        logger.log("warn", "MAIN - testloadConversationHistoryAsyncBubbleByJid RainbowSDK stop failed : ", err, ", but even stop the process."); //logger.colors.green(JSON.stringify(result)));
                        process.exit(0);
                    });
                } else {
                    process.exit(0);
                }
            });

            rainbowSDK.conversations.getBubbleConversation(jid).then(async function (conversation :any) {
                logger.log("info", "MAIN - testloadConversationHistoryAsyncBubbleByJid - getBubbleConversation, conversation.jid : ", conversation.jid);
                /* that.getConversationHistoryMaxime(conversation).then(() => {
                    logger.log("debug", "MAIN - testGetHistoryPageBubble - getConversationHistoryMaxime, conversation : ", conversation, ", status : ", conversation.status);
                }); // */
                startDate = new Date();
                /* rainbowSDK.conversations.loadConversationHistoryAsync(conversation, 50).then((running :any) => {
                    logger.log("info", "MAIN - testloadConversationHistoryAsyncBubbleByJid loadConversationHistoryAsync running : ", running);
                });
                // */

            });
        }
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

        // const ngrok = require('ngrok');
        let urlS2S;
        /*
        let logLevelAreas = new LogLevelAreas(LEVELSNAMES.ERROR, true, false, false);

        logLevelAreas.admin.api = true;
        logLevelAreas.admin.level = LEVELSNAMES.ERROR;
        logLevelAreas.alerts.api = true;
        logLevelAreas.alerts.level = LEVELSNAMES.ERROR;
        logLevelAreas.bubbles.api = true;
        logLevelAreas.bubbles.level = LEVELSNAMES.ERROR;
        logLevelAreas.calllog.api = true;
        logLevelAreas.calllog.level = LEVELSNAMES.ERROR;
        logLevelAreas.channels.api = true;
        logLevelAreas.channels.level = LEVELSNAMES.ERROR;
        logLevelAreas.connectedUser.api = true;
        logLevelAreas.connectedUser.level = LEVELSNAMES.ERROR;
        logLevelAreas.contacts.api = true;
        logLevelAreas.contacts.level = LEVELSNAMES.ERROR;
        logLevelAreas.conversations.api = true;
        logLevelAreas.conversations.level = LEVELSNAMES.ERROR;
        logLevelAreas.events.api = true;
        logLevelAreas.events.level = LEVELSNAMES.ERROR;
        logLevelAreas.favorites.api = true;
        logLevelAreas.favorites.level = LEVELSNAMES.ERROR;
        logLevelAreas.fileServer.api = true;
        logLevelAreas.fileServer.level = LEVELSNAMES.ERROR;
        logLevelAreas.fileStorage.api = true;
        logLevelAreas.fileStorage.level = LEVELSNAMES.ERROR;
        logLevelAreas.groups.api = true;
        logLevelAreas.groups.level = LEVELSNAMES.ERROR;
        logLevelAreas.httpoverxmpp.api = true;
        logLevelAreas.httpoverxmpp.level = LEVELSNAMES.ERROR;
        logLevelAreas.ims.api = true;
        logLevelAreas.ims.level = LEVELSNAMES.ERROR;
        logLevelAreas.invitations.api = true;
        logLevelAreas.invitations.level = LEVELSNAMES.ERROR;
        logLevelAreas.presence.api = true;
        logLevelAreas.presence.level = LEVELSNAMES.ERROR;
        logLevelAreas.profiles.api = true;
        logLevelAreas.profiles.level = LEVELSNAMES.ERROR;
        logLevelAreas.rbvoice.api = true;
        logLevelAreas.rbvoice.level = LEVELSNAMES.ERROR;
        logLevelAreas.rpcoverxmpp.api = true;
        logLevelAreas.rpcoverxmpp.level = LEVELSNAMES.ERROR;
        logLevelAreas.s2s.api = true;
        logLevelAreas.s2s.level = LEVELSNAMES.ERROR;
        logLevelAreas.settings.api = true;
        logLevelAreas.settings.level = LEVELSNAMES.ERROR;
        logLevelAreas.tasks.api = true;
        logLevelAreas.tasks.level = LEVELSNAMES.ERROR;
        logLevelAreas.telephony.api = true;
        logLevelAreas.telephony.level = LEVELSNAMES.ERROR;
        logLevelAreas.version.api = true;
        logLevelAreas.version.level = LEVELSNAMES.ERROR;
        logLevelAreas.webinars.api = true;
        logLevelAreas.webinars.level = LEVELSNAMES.ERROR;
        logLevelAreas.core.level = LEVELSNAMES.ERROR;
        logLevelAreas.bubblemanager.level = LEVELSNAMES.ERROR;
        logLevelAreas.httpmanager.level = LEVELSNAMES.ERROR;
        logLevelAreas.httpservice.level = LEVELSNAMES.ERROR;
        logLevelAreas.rest.level = LEVELSNAMES.ERROR;
        logLevelAreas.resttelephony.level = LEVELSNAMES.ERROR;
        logLevelAreas.restconferencev2.level = LEVELSNAMES.ERROR;
        logLevelAreas.restwebinar.level = LEVELSNAMES.ERROR;
        logLevelAreas.xmpp.level = LEVELSNAMES.ERROR;
        logLevelAreas.xmpp.xmppin
        logLevelAreas.xmpp.xmppout
        logLevelAreas.s2sevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.rbvoiceevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.alertevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.calllogevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.channelevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.conversationevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.conversationhistory.level = LEVELSNAMES.ERROR;
        logLevelAreas.favoriteevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.httpoverxmppevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.invitationevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.iqevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.presenceevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.rpcoverxmppevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.tasksevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.telephonyevent.level = LEVELSNAMES.ERROR;
        logLevelAreas.webinarevent.level = LEVELSNAMES.ERROR;

        logLevelAreas.showRESTLogs(LEVELSNAMES.INTERNAL);
        logLevelAreas.showEventsLogs();
        // logLevelAreas.showServicesLogs();
        logLevelAreas.hideServicesApiLogs();

        logLevelAreas.conversations.api = true;
        logLevelAreas.conversations.level = LEVELSNAMES.INTERNAL;
        logLevelAreas.conversationevent.level = LEVELSNAMES.INTERNAL;
        logLevelAreas.conversationhistory.level = LEVELSNAMES.INTERNAL;

        //logLevelAreas.bubblemanager.level = LEVELSNAMES.INTERNAL;

        logLevelAreas.fileServer.api = true;
        logLevelAreas.fileServer.level = LEVELSNAMES.INTERNAL;
        logLevelAreas.fileStorage.api = true;
        logLevelAreas.fileStorage.level = LEVELSNAMES.INTERNAL;

        logLevelAreas.xmpp.level = LEVELSNAMES.INTERNAL;
        logLevelAreas.xmpp.xmppin
        logLevelAreas.xmpp.xmppout
        // */

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
            "xmpp": {
                "host": "",
                "port": "443",
                "protocol": "wss",
                "timeBetweenXmppRequests": "0",
                "raiseLowLevelXmppInEvent": false,
                "raiseLowLevelXmppOutReq": false,
                "maxIdleTimer": 16000,
                "maxPingAnswerTimer": 11000,
//            "xmppRessourceName": "vnagw",
                "maxPendingAsyncLockXmppQueue": 10000
            },
            "s2s": {
                "hostCallback": urlS2S,
                //"hostCallback": "http://70a0ee9d.ngrok.io",
                "locallistenningport": "4000"
            }, "rest": {
                "useRestAtStartup": true,
                "useGotLibForHttp": true,
                "gotOptions": {
                    agentOptions: {
                        /**
                         * Keep sockets around in a pool to be used by other requests in the future. Default = false
                         */
                        keepAlive: true, // ?: boolean | undefined;
                        /**
                         * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets being kept alive. Default = 1000.
                         * Only relevant if keepAlive is set to true.
                         */
                        keepAliveMsecs: 4302, // ?: number | undefined;
                        /**
                         * Maximum number of sockets to allow per host. Default for Node 0.10 is 5, default for Node 0.12 is Infinity
                         */
                        maxSockets: Infinity, // ?: number | undefined;
                        /**
                         * Maximum number of sockets allowed for all hosts in total. Each request will use a new socket until the maximum is reached. Default: Infinity.
                         */
                        maxTotalSockets: Infinity, // ?: number | undefined;
                        /**
                         * Maximum number of sockets to leave open in a free state. Only relevant if keepAlive is set to true. Default = 256.
                         */
                        maxFreeSockets: 1002, // ?: number | undefined;
                        /**
                         * Socket timeout in milliseconds. This will set the timeout after the socket is connected.
                         */
                        timeout: 120002, // ?: number | undefined;
                    },
                    gotRequestOptions: {
                        timeout: { // This object describes the maximum allowed time for particular events.
                            lookup: 5252, // lookup: 100, Starts when a socket is assigned.  Ends when the hostname has been resolved.
                            connect: 10252, // connect: 50, Starts when lookup completes.  Ends when the socket is fully connected.
                            secureConnect: 10252, // secureConnect: 50, Starts when connect completes. Ends when the handshake process completes.
                            socket: 120002, // socket: 1000, Starts when the socket is connected. Resets when new data is transferred.
                            send: 120002, // send: 10000, // Starts when the socket is connected. Ends when all data have been written to the socket.
                            response: 120002 // response: 1000 // Starts when request has been flushed. Ends when the headers are received.
                        }
                    } // */
                }
            }, // */
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
                "enableFileLogs": true,
                "color": true,
                "level": "info",
              //  "areas": logLevelAreas,
                "customLabel": "RainbowSample",
                "system-dev": {
                    "internals": true,
                    "http": true,
                },
                "file": {
                    "path": "/home/vincent/temp/",
                    "customFileName": "R-SDK-Node-TS-Sample",
                    //"level": 'info',                    // Default log level used
                    "zippedArchive": false /*,
            "maxSize" : '10m',
            "maxFiles" : 10 // */
                }
            },
            "testOutdatedVersion": false,
            "testDNSentry": true,
            "httpoverxmppserver": true,
            "intervalBetweenCleanMemoryCache": 1000 * 60 * 60 * 6, // Every 6 hours.
            "requestsRate": {
                "useRequestRateLimiter": true,
                "maxReqByIntervalForRequestRate": 250, // nb requests during the interval.
                "intervalForRequestRate": 60, // nb of seconds used for the calcul of the rate limit.
                "timeoutRequestForRequestRate": 600 // nb seconds Request stay in queue before being rejected if queue is full.
            },
            "autoReconnectIgnoreErrors": false,
            // IM options
            "im": {
                "sendReadReceipt": true,
//            "messageMaxLength": 1024,
                "sendMessageToConnectedUser": false,
                "conversationsRetrievedFormat": "full",
                "storeMessages": false,
                "copyMessage": true,
                "nbMaxConversations": 15,
                "rateLimitPerHour": 100000,
//        "messagesDataStore": DataStoreType.NoStore,
                "messagesDataStore": DataStoreType.StoreTwinSide,
                "autoInitialGetBubbles": true,
                "autoInitialBubblePresence": true,
                "maxBubbleJoinInProgress": 10,
                "autoInitialBubbleFormat": "full",
                "autoInitialBubbleUnsubscribed": true,
                //"autoLoadConversations": true,
                // "autoInitialBubblePresence": false,
                "autoLoadConversations": true,
                "autoLoadConversationHistory": false,
                "autoLoadContacts": true,
                "enableCarbon": true,
                "enablesendurgentpushmessages": true,
                //"useMessageEditionAndDeletionV2": false
                "storeMessagesInConversation": true,
                "maxMessagesStoredInConversation" : 830
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
        //logger = rainbowSDK._core._logger;
        logger = rainbowSDK._core.logger;

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
