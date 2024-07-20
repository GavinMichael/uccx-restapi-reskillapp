const express = require('express');
const router = express.Router();
// Older V2 of node-fetch
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const base64 = require('base-64');

// Do not do this in your production enviornment
// Setting this to 0 since the sandbox env did not have signed certs
// If this was skipped will get -> UnhandledPromiseRejectionWarning: FetchError: request failed, reason: self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Please don't leave credentials like this, I'm leaving it here since it's a demo
// You can hide them away in a process env file : https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs
let authToken = 'Basic ' + base64.encode('administrator:ciscopsdt');

// This is a simple get request endpoint to demonstrate the response from the admin api
router.get('/get-all-users', function (req, res) {

    console.log('Request received on get-all-users')

    // make a get request to the UCCX Admin API
    // Replace hq-uccx.abc.inc with your Base URL
    fetch('https://hq-uccx.abc.inc/adminapi/resource', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: authToken
        },
    })
        .then(res => res.json())
        .then(json => {
            res.send(json)
        })

}) // end of router.get

// This is an example of asking for details of a specific user
// will mimic asking for Agent007
router.get('/get-one-users', function (req, res) {

    console.log('Request received on get-one-users')

    // make a get request to the UCCX Admin API
    // Replace hq-uccx.abc.inc with your Base URL
    fetch('https://hq-uccx.abc.inc/adminapi/resource/Agent007', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: authToken
        },
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            res.send(json)
        })

}) // end of router.get

/*

Example of body
Note that the skillMap is an object which has the "skillCompetency" prop
"skillCompetency" is an array containing objects 
Each object defines the competencelevel and skillNameUriPair
skillNameUriPair is also an object with @name and refURL props

- skillMap
    - skillCompetency
        - competencelevel
        - skillNameUriPair
            - @name
            - refURL

*/

// Replace hq-uccx.abc.inc with your Base URL
// replace Agent007 with the agent name in your instance
let example_agent = {
    "self": "https://hq-uccx.abc.inc/adminapi/resource/Agent007",
    "userID": "Agent007",
    "firstName": "Mike",
    "lastName": "Bastrop",
    "extension": "6007",
    "alias": "",
    "skillMap": {
        "skillCompetency": [
            {
                "competencelevel": 10,
                "skillNameUriPair": {
                    "@name": "IT_Tier1",
                    "refURL": "https://hq-uccx.abc.inc/adminapi/skill/2"
                }
            },
            {
                "competencelevel": 5,
                "skillNameUriPair": {
                    "@name": "IT_Tier2",
                    "refURL": "https://hq-uccx.abc.inc/adminapi/skill/3"
                }
            }
        ]
    },
    "autoAvailable": true,
    "type": 1,
    "team": {
        "@name": "Team_IT_Tier2",
        "refURL": "https://hq-uccx.abc.inc/adminapi/team/6"
    },
    "primarySupervisorOf": {},
    "secondarySupervisorOf": {}
}

// Demo code that changes the agent's skillMap to the below defined
// Want to know the refURL of your skills, check out /adminapi/skill

/*
    Notes on resource data
    When updating resource info, we will be using the PUT method
    Modify the resource data and when you push it to the ADMIN API, the changes will be updated against the UCCX resoruce
    We can update the 
    - skill map with 1 or more skills and competencies
    - which team the agent is assigned to ("team")
    - I haven't tried to update the Primary / Secondary Supervisor but should be possible
*/

// Agent007 resource data
let resourceData = {
    "self": "https://hq-uccx.abc.inc/adminapi/resource/Agent007",
    "userID": "Agent007",
    "firstName": "Mike",
    "lastName": "Bastrop",
    "extension": "6007",
    "alias": "",
    "skillMap": {
        "skillCompetency": [
            {
                "competencelevel": 1,
                "skillNameUriPair": {
                    "@name": "HR",
                    "refURL": "https://hq-uccx.abc.inc/adminapi/skill/4"
                }
            }
        ]
    },
    "autoAvailable": true,
    "type": 1,
    "team": {
        "@name": "Team_IT_Tier2",
        "refURL": "https://hq-uccx.abc.inc/adminapi/team/6"
    },
    "primarySupervisorOf": {},
    "secondarySupervisorOf": {}
}


// in this section we will mimic modifying the skillMap for Agent007
fetch('https://hq-uccx.abc.inc/adminapi/resource/Agent007', {
    method: 'PUT',
    body: JSON.stringify(resourceData),
    headers: {
        'Content-Type': 'application/json',
        Authorization: authToken
    },
})
    .then(response => response.text())
    .then(body => {

        try {
            // failed
            if (JSON.parse(body).apiError[0].errorData == 'ServerError') {
                console.log(body)
                // API said no or API Error
            }
        } catch (error) {
            // sucess
            // Capture on logs or something to track the change 
        }
    })
    .catch((error) => {
        // If error, update error capture here
        console.log(error);
    });

module.exports = router;