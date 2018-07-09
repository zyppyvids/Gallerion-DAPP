$(document) .ready(function() {
    const gallerionContractAddress = "";
    const gallerionContractABI = "";

    showView("viewHome");
    $('.btn').removeClass('active');
    $('#linkHome').addClass('active');
    
    $('.btn').click(function(e) {
        e.preventDefault();
        $('.btn').removeClass('active');
        $(this).addClass('active');
    });

    $('#linkSubmitImages').click(function () {
        showView("viewSubmitImages")
    });
    
    $('#linkHome').click(function () {
        showView("viewHome")
    });
    
    $('#linkGetImages').click(function () {
        $('#viewGetImages div').remove();
        showView("viewGetImages");
        viewGetImages();
    });
    $('#imageUploadButton').click(uploadImage);

    $('#linkRegisterUser').click(function () {
        $('#password').val('');
        $('#username').val('');
        showView("viewRegisterUser")
    });

    $('#linkDeleteUser').click(deleteUser);

    $("#registerUser").click(function(){
    var userName = $("#username").val();
    var password = $("#password").val();
    if( !userName =='' && !password ==''){
        registerUser(userName, password);
    }
    else{
        showError("Invalid Username or Password!")
    }
})
    
    const ipfs = window.IpfsApi('localhost', '5001');
    const Buffer = ipfs.Buffer;
});

$(document).on({
    ajaxStart: function () {
        $("#loadingBox").show()
    },
    ajaxStop: function () {
        $("#loadingBox").hide()
    }
});

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();

    $('a').hide();

    if (localStorage.User) {
        $('#linkRegisterUser').hide();

        $('#linkHome').show();
        $('#linkGetImages').show();
        $('#linkSubmitImages').show();
        $('#linkDeleteUser').show();
    }
    else {
        $('#linkGetImages').hide();
        $('#linkSubmitImages').hide();
        $('#linkDeleteUser').hide();

        $('#linkRegisterUser').show();
        $('#linkHome').show();
    }
}

function showLoggedInButtons() {
    $('#linkRegisterUser').hide();

    $('#linkHome').show();
    $('#linkGetImages').show();
    $('#linkSubmitImages').show();
    $('#linkDeleteUser').show();
}

function showInfo(message) {
    $('#infoBox>p').html(message);
    $('#infoBox').show();
    $('#infoBox>header').click(function () {
        $('#infoBox').hide();
    });
}

function showError(errorMsg) {
    $('#errorBox>p').html("Error: " + errorMsg);
    $('#errorBox').show();
    $('#errorBox>header').click(function () {
        $('#errorBox').hide();
    });
}

function uploadImage(){
    if($('#imageForUpload')[0].files.length === 0){
        return showError("Please select a file to upload.");
    }
    let fileReader = new FileReader();
    fileReader.onload = function () {
        if(typeof web3 ==='undefined'){
            return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
        }
        let fileBuffer = Buffer.from(fileReader.result);

        let contract = web3.eth.contract(gallerionContractABI).at(gallerionContractAddress);
        IPFS.files.add(fileBuffer, (err, result) => {
            if (err)
                return showError(err);
            if (result) {
                let ipfsHash = result[0].hash;
                contract.add(ipfsHash, function (err, txHash) {
                    if(err)
                        return showError("Smart contract call failed: " + err);
                    showInfo(`Image ${ipfsHash} <b>successfully added</b> to the gallery. Transaction hash: ${txHash}`);
                })
            }
        })
    };
    fileReader.readAsArrayBuffer($('#imageForUpload')[0].files[0]);
}

function viewGetImages() {
    if(typeof web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    
    let contract = web3.eth.contract(gallerionContractABI).at(gallerionContractAddress);
    contract.getImagesCount(function (err, result){
        if(err)
            return showError("Smart contract failed: " + err);
        
        let imagesCount = result.toNumber();
        if (imagesCount > 0){
            let html = $('<div>');
            for(let i = 0; i < imagesCount; i++){
                contract.getImage(i, function(err,result) {
                    if(err)
                        return showError("Smart contract call failed: "+ err);
                    let ipfsHash = result[0];
                    let contractPublishDate = result[1];
                    let div = $('<div>');
                    let url = "https://ipfs.io/ipfs/" + ipfsHash;

                    let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
                    div
                        .append($(`<p>Image published on: ${displayDate}</p>`))
                        .append($(`<img src="${url}"/>`))
                    html.append(div);
                })
            }
            html.append('</div>');
            $('#viewGetImages').append(html);
        }
        else {
            $('#viewGetImages').append('<div> No images in the gallery.</div>');
        }
    })
}

function registerUser(userName, password){
    var json ={
        'userName': userName,
        'password': password
    }
    localStorage['User'] = json;
    showLoggedInButtons();
    showView("viewHome");
    $('.btn').removeClass('active');
    $('#linkHome').addClass('active');
}

function deleteUser() {
    localStorage.clear();
    $('#userInfo').text('')
    showView('viewHome');
    $('.btn').removeClass('active');
    $('#linkHome').addClass('active');
}