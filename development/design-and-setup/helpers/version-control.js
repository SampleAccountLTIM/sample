require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GIT_API_PERSONAL_ACCESS_TOKEN,
});

let flag = false;

getVersionControl = async () => {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents",
      {
        owner: "PallaviLTIM",
        repo: "sample",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const { data } = response;
    if (data && data.length > 0) {
      checkFilesExist(data);
    }
  } catch (error) {
    console.log(error);
  }
  return flag;
};

const checkFilesExist = function (data) {
  try {
    let dirNames = data?.filter((file) => file.type === "dir");
    let fileList = [];
    //   console.log("checkFilesExist => dirNames : ", dirNames.length);
    if (data && data.length > 0) {
      fileList = data.map((file) => file.name);
      // const res = checkFilesExist(fileList);
    }
    //   console.log("checkFilesExist => fileList : ", fileList.length);
    //console.log(`fileList.length: `, fileList.length);
    flag =
      fileList.includes(".gitignore") || fileList.includes(".dockerignore");
    flag = !fileList.includes(".env");
    flag = !fileList.includes("dist") || !fileList.includes("build");

    if (dirNames && dirNames.length > 0) {
      dirNames.forEach((element) => {
        //console.log(dirNames.length);
        checkFilesInDir(element.path);
      });
    }
  } catch (error) {
    console.log(error);
  }
  return flag;
};

const checkFilesInDir = async (dirName = "design-and-setup") => {
  try {
    // console.log("dirName", dirName);
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/" + dirName,
      {
        owner: "PallaviLTIM",
        repo: "sample",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const { data } = response;
    if (data && data.length > 0) {
      //   console.log(data);
      checkFilesExist(data);
    }
  } catch (error) {
    console.log(error);
  }
};
// checkFilesInDir();

module.exports = getVersionControl;
// getVersionControl();
