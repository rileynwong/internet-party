
// Return s3 asset url
function getAssetUrl(assetName) {

}

// Serve existing photo assets from s3
function addExistingBoxes() {
    var numFilesFormatted, textureFile, textureFileUrl, textureUrl, material;
    var S3_BUCKET = 'party-assets';
    
    for ( var i = 1; i <= numFiles; i++ ) {
        // add new box
        numFilesFormatted = pad(i, 4);
        textureFile = 'photo_'.concat(numFilesFormatted);
        textureFilePath = 'photos/'.concat(textureFile).concat('.jpg');
    
        textureUrl = 'https://party-assets.s3.amazonaws.com/' + textureFilePath;

        // make a box
        texture = THREE.ImageUtils.loadTexture( textureUrl );
        texture.minFilter = THREE.NearestFilter;
        material = new THREE.MeshBasicMaterial( { map: texture } );
        
        addPhoto(material);
        console.log('added existing photo: ' + i);

        // "refresh" directory
        numPhotos = numFiles;
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

function checkNumPhotos(numFiles) {
    // If new photo has been sent to Twilio, add to our directory
    if (numFiles > numPhotos) {
        console.log('Adding new photo...');

        // add new box
        var numFilesFormatted = pad(numFiles, 4);
        var textureFile = 'photo_'.concat(numFilesFormatted);
        var textureFilePath = 'photos/'.concat(textureFile).concat('.jpg');
    
        var textureUrl = 'https://party-assets.s3.amazonaws.com/' + textureFilePath;

        // make a box
        var texture = THREE.ImageUtils.loadTexture( textureUrl );
        texture.minFilter = THREE.NearestFilter;
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        
        addPhoto(material);
        console.log('New photo added');
        
        // "refresh" directory
        numPhotos = numFiles;
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
