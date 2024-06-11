"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

let packages = [
    { "packageName":"Emagine Toilet" , "versionNo":"0.0.0" },
    { "packageName":"C# crash course" , "versionNo":"0.0.0" } ];

let missingPackages = [];

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

connection.on("GetSerial", async () => {
    //let promise = new Promise((resolve, reject) => {
    //    setTimeout(() => {
    //        resolve(new { data: "2G0YC1ZG0801Q1" });
    //    }, 100);
    //});
    console.debug("Sending test serial 2G0YC1ZG0801Q1");
    return "2G0YC1ZG0801Q2";
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {

        //console.error(err.toString());
        var p = document.createElement("p");
        document.getElementById("messagesList").appendChild(p);
        //p.textContent = `Error: ${message}`;
        p.textContent = `${err}`;

    });
    event.preventDefault();
});

document.getElementById("sendCommand").addEventListener("click", function (event) {
    var command = document.getElementById("sendCommandInput").value;
    var serialNo = document.getElementById("sendCommandSerialno").value;
    
    connection.invoke("RunCommandOnHeadset", command, serialNo).catch(function (err) {
        var p = document.createElement("p");
        document.getElementById("testSendCommand").appendChild(p);
        p.textContent = `${err}`;
    });
    event.preventDefault();
})

connection.on("ExecuteCommand", function (command) {
    console.debug("Executing command: " + command)
})

connection.on("SyncAllPackages", function (test) {

    
    var databasePackageList = JSON.parse(test);
    
    console.debug("Sync triggered");
    
    // let packages = [
    //     { "packageName":"Emagine Toilet" , "versionNo":"0.0.0" },
    //     { "packageName":"C# crash course" , "versionNo":"0.0.0" } ];

    let updatePackages = [];
    
    packages.find(p => p.packageName === "C# crash course")
    
    //Todo: Check why this does not work for missing packages.
    console.debug("Database packages: " + databasePackageList.map(p => p.PackageName))
    for(var dp of databasePackageList){
        console.debug("Checking package " + dp.PackageName);
        if (!packages.map(p => p.PackageName).includes(dp.PackageName)){
            updatePackages = updatePackages.concat(dp)
        }
        else if(packages.find(p => p.PackageName === dp.PackageName).versionNo !== dp.VersionNo){
            updatePackages = updatePackages.concat(dp)
        }
    }

    // if(updatePackages.length === 0){
    //     return "All packages are up to date";
    // }

    //This should return at least the packages drone simulator and  C# crash course.
    missingPackages = databasePackageList;
    
    return updatePackages;


})

// connection.on("SyncAllPackages", function (databasePackageList) {
//     let packages = [
//         { "packageName":"Emagine Toilet" , "version":"0.0.0" },
//         { "packageName":"C# crash course" , "version":"0.0.0" } ];
//     let updatePackages = Array;
//     let missingPackages = Array;
//
//     for(let p in packages){
//         if (!databasePackageList.packageName.contains(p.packageName)){
//             updatePackages.add(p)
//             break;
//         }
//         if(databasePackageList.packageName[p] !== p.version){
//             missingPackages.add(p)
//             break;
//         }
//     }
//    
//     return message
// })

connection.on("RequestFile", function (fileId) {
    packages = missingPackages;
    console.debug("FileId to recieve:" + fileId);
});

document.getElementById("getTestApkButton").addEventListener("click", function (event) {

    connection.invoke("GetFile", "22D68DD2-DBC2-4C0B-8493-BE87FFFE3704").catch(function (err) {

    });
    event.preventDefault();
});

document.getElementById("testBatteryStatus").addEventListener("click", function (event) {
    var percentage = document.getElementById("batteryPercentage").value;
    connection.invoke("OnBatteryLevelChange", percentage).catch(function (err) {

    });
    event.preventDefault();
});

connection.on("ReceiveFile", function (filename) {

    console.debug("FileName to receive:" + filename);

});