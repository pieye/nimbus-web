var major = 0;
var minor = 0;
var patch = 2;
var desc = "";

function getVersionString() {
    if (desc==="")
        return "v"+major+"."+minor+"."+patch;
    else
        return "v"+major+"."+minor+"."+patch+"-"+desc;
}

function splitVersion(version) {
    var rv = version.split(".")
    var major = parseInt(rv[0].slice(1), 10);
    var minor = parseInt(rv[1], 10);
    var patch = rv[2];
    patch = parseInt(patch.split("-")[0]);
    var desc = version.split("-")
    if (desc.length === 1)
        desc = "";
    else
        desc = desc[1];
    return [major, minor, patch, desc]
}

function isNewerVersion(otherVersion) {
    var otherSplit = splitVersion(otherVersion);
    var isNewer = false;
    if (otherSplit[0] > major)
        isNewer = true;
    else if (otherSplit[0] === major)
    {
        if (otherSplit[1] > minor)
            isNewer = true;
        else if (otherSplit[1] === minor)
        {
            if (otherSplit[2] > patch)
                isNewer = true
            else if (otherSplit[2] === patch)
            {
                if (desc !== "" && otherSplit[3] === "")
                    isNewer = true;
            }
        }
    }
    return isNewer;
}

export {getVersionString, isNewerVersion};
