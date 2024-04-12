const Report = require("../models/reportModel");
async function createRport(objData) {
  const admins = ["64679eb603239724cc8773ce", "645db313dca0904d905b61fe"];
  const report = await Report.find().sort({ createdAt: -1 }).limit(1);

  const index = admins.findIndex((adminId) => report[0].admin.equals(adminId));
  console.log(index, report);
  if (index < 0 || index === admins.length - 1) {
    objData.admin = admins[0];
  }

  if (index >= 0 && index < admins.length - 1) {
    objData.admin = admins[index + 1];
  }

  return await Report.create(objData);
}

module.exports = createRport;
