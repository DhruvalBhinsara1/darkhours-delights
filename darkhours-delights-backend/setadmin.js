const admin = require("./firebaseAdmin");

admin.auth().setCustomUserClaims("YzWoap2pKXYf4Mw7RouCNlHDcKm2", { admin: true })
    .then(() => {
        console.log("Admin role set successfully");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });