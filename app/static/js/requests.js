
// Return s3 asset url
function getAssetUrl(fileName) {
    filepath = 'photos/'.concat(fileName).concat('.jpg');
    s3Url = 'https://party-assets.s3.amazonaws.com/' + filepath;

    return s3Url;
}

function formatNameFromNumber(fileNumber) {
    var formattedFileNumber = pad(fileNumber, 4);
    var fileName = 'photo_'.concat(formattedFileNumber);
    return fileName;
}

// Serve existing photo assets from s3
function addExistingBoxes() {
    for ( var i = 1; i <= numFiles; i++ ) {
        createBoxFromId(i);
    }
}

// Get number of existing photos from server, set variable
function addExistingBoxesFromServer() {
    setTimeout(function() {
        $.ajax({
            url: "/fileCount",
            type: "GET",
            success: function(data) {
                console.log('Num photos init: ' + data);
                numFiles = parseInt(data);
                addExistingBoxes();
            },
            dataType: "json",
            timeout: 2000
        })
    }, 10);
};

function createBoxFromId(id) {
    var fileName, textureUrl, texture;

    // Add new box
    fileName = formatNameFromNumber(id);
    textureUrl = getAssetUrl(fileName);
    texture = THREE.ImageUtils.loadTexture( textureUrl );

    addBoxWithTexture(texture);

    // Update count
    numPhotos = numFiles;
}

function checkNumPhotos(numFiles) {
    // If new photo has been sent to Twilio, add to our directory
    if (numFiles > numPhotos) {
        console.log('Adding new photo...');

        createBoxFromId(numFiles);
        render();
    }
}

// Poll server for new photos
function poll() {
    setTimeout(function() {
        $.ajax({
            url: "/fileCount",
            type: "GET",
            success: function(data) {
                numFiles = parseInt(data);
                checkNumPhotos(numFiles);
            },
            dataType: "json",
            complete: poll,
            timeout: 2000
        })
    }, 5000);
};
