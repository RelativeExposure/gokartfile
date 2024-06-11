"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

let packages = [
    { "packageName": "Emagine Toilet", "versionNo": "0.0.0" },
    { "packageName": "C# crash course", "versionNo": "0.0.0" }];

let missingPackages = [];


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
    console.debug("Sending test serial 2G0YC1ZG0801Q2");
    return "2G0YC1ZG0801Q1";
});

connection.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
});


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
    for (var dp of databasePackageList) {
        console.debug("Checking package " + dp.PackageName);
        if (!packages.map(p => p.PackageName).includes(dp.PackageName)) {
            updatePackages = updatePackages.concat(dp)
        }
        else if (packages.find(p => p.PackageName === dp.PackageName).versionNo !== dp.VersionNo) {
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

connection.on("ReceiveFile", function (filename) {

    console.debug("FileName to receive:" + filename);

});