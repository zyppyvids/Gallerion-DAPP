var Gallerion = {};

const ETH = 1000000000000000000;

jQuery(document) .ready(function() {
    Gallerion.gallerionContractAddress = "0x16eb2307aaf1fdfd807557b366bc0617f235420f";  //Change every time you start `ganache-cli`
    Gallerion.gallerionContractABI = [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "getImage",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "ownedImages",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getImagesCount",
            "outputs": [
                {
                    "name": "length",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "imageCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_hash",
                    "type": "string"
                },
                {
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "sell",
            "outputs": [
                {
                    "name": "dateAdded",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "setOwnedImage",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "buy",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "boughtImages",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }
    ];

    document.addEventListener('contextmenu', event => event.preventDefault()); //It is illegal to steal pictures online ;)
    jQuery(document).on('dragstart', 'img', function(event){ event.preventDefault(); }); //It is illegal to steal pictures online ;)

    showView("viewHome");
    jQuery('.btn').removeClass('active');
    jQuery('#linkHome').addClass('active');
    
    jQuery('.btn').click(function(e) {
        e.preventDefault();
        jQuery('.btn').removeClass('active');
        jQuery(this).addClass('active');
    });

    jQuery('#linkSubmitImages').click(function () {
        showView("viewSubmitImages")
    });
    
    jQuery('#linkHome').click(function () {
        showView("viewHome")
    });
    
    jQuery('#linkGetImages').click(function () {
        jQuery('#viewGetImages div').remove();
        showView("viewGetImages");
        viewGetImages();
    });
    jQuery('#imageUploadButton').click(uploadImage);

    jQuery('#linkRegisterUser').click(function () {
        jQuery('#password').val('');
        jQuery('#username').val('');
        showView("viewRegisterUser")
    });

    jQuery('#linkUserInfo').click(function () {
        if(typeof Web3 !== 'undefined'){
            web3js = new Web3(web3.currentProvider); 
            web3js.eth.getAccounts((err, accounts) => {
                if (!err && accounts.length > 0) {
                    var account = accounts[0];
                    jQuery('#textAddress').text('Address:');
                    jQuery('#userAddress').text(account);
                } 
                else{
                    showError(err);
                }
            });
        }
        else{
            jQuery('#textAddress').text('Please install MetaMask to see your Address here!')
        }
        jQuery('#usernameField').text('Hello ' + JSON.parse(localStorage['User']).userName + '!' );
        showView("viewUserInfo")
    });

    jQuery('#linkDeleteUser').click(deleteUser);

    jQuery("#registerUser").click(function(){
    var userName = jQuery("#username").val();
    var password = jQuery("#password").val();
    if( !userName =='' && !password ==''){
        registerUser(userName, password);
    }
    else{
        showError("Invalid Username or Password!")
    }
    });

    jQuery('#linkDonate').click(function () {
        jQuery('#authorAddr').val('');
        jQuery('#value').val('');
        showView("viewDonate");
    });

    jQuery("#donate").click(function(){
        var authorAddr = jQuery("#authorAddr").val();
        var value = jQuery("#value").val();
        if( !authorAddr =='' && !value =='' && authorAddr.length == 42 && !isNaN(value)) {
            donateToAuthor(authorAddr, Number(value));
        }
        else{
            showError("Invalid Address or Value!")
        }
    });

    jQuery(document).on('click', '#linkBuyImage', function() {
        buyImage(Number(this.className));
    });
    
    const ipfs = window.IpfsApi('localhost', '5001');
    const Buffer = ipfs.Buffer;
});

jQuery(document).on({
    ajaxStart: function () {
        jQuery("#loadingBox").show()
    },
    ajaxStop: function () {
        jQuery("#loadingBox").hide()
    }
});

function showView(viewName) {
    // Hide all views and show the selected view only
    jQuery('main > section').hide();
    jQuery('#' + viewName).show();

    jQuery('a').hide();

    if (localStorage.User) {
        jQuery('#linkRegisterUser').hide();

        jQuery('#linkDonate').show();
        jQuery('#linkHome').show();
        jQuery('#linkGetImages').show();
        jQuery('#linkSubmitImages').show();
        jQuery('#linkDeleteUser').show();
        jQuery('#linkUserInfo').show();
    }
    else {
        jQuery('#linkGetImages').hide();
        jQuery('#linkSubmitImages').hide();
        jQuery('#linkDeleteUser').hide();
        jQuery('#linkUserInfo').hide();
        jQuery('#linkDonate').hide();

        jQuery('#linkRegisterUser').show();
        jQuery('#linkHome').show();
    }
}

function showLoggedInButtons() {
    jQuery('#linkRegisterUser').hide();

    jQuery('#linkHome').show();
    jQuery('#linkGetImages').show();
    jQuery('#linkSubmitImages').show();
    jQuery('#linkDeleteUser').show();
}

function showInfo(message) {
    jQuery('#infoBox>p').html(message);
    jQuery('#infoBox').show();
    jQuery('#infoBox>header').click(function () {
        jQuery('#infoBox').hide();
    });
}

function showError(errorMsg) {
    jQuery('#errorBox>p').html("Error: " + errorMsg);
    jQuery('#errorBox').show();
    jQuery('#errorBox>header').click(function () {
        jQuery('#errorBox').hide();
    });
}

function uploadImage(){
    if(jQuery('#imageForUpload')[0].files.length === 0){
        return showError("Please select a file to upload.");
    }
    let fileReader = new FileReader();
    fileReader.onload = function () {
        if(typeof Web3 ==='undefined'){
            return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
        }
        web3js = new Web3(web3.currentProvider); 
        const ipfs = window.IpfsApi('localhost', '5001');
        const Buffer = ipfs.Buffer;
        let fileBuffer = Buffer.from(fileReader.result);

        let contract = web3js.eth.contract(Gallerion.gallerionContractABI).at(Gallerion.gallerionContractAddress);
        ipfs.files.add(fileBuffer, (err, result) => {
            if (err)
                return showError(err);
            if (result) {
                let ipfsHash = result[0].hash;
                let price = jQuery("#priceSelect").val();
                contract.sell(ipfsHash, Number(price), function (err, txHash) {
                    if(err)
                        return showError("Smart contract call failed: " + err);
                    showInfo(`Image ${ipfsHash} <b>successfully added</b> to the gallery. Transaction hash: ${txHash}`);
                })
            }
        })
    };
    fileReader.readAsArrayBuffer(jQuery('#imageForUpload')[0].files[0]);
}

function viewGetImages() {
    if(typeof Web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    web3js = new Web3(web3.currentProvider); 
    let contract = web3js.eth.contract(Gallerion.gallerionContractABI).at(Gallerion.gallerionContractAddress);
    contract.getImagesCount(function (err, result){
        if(err)
            return showError("Smart contract failed: " + err);
        
        let imagesCount = result.toNumber();
        if (imagesCount > 0){
            let html = jQuery('<div>');
            for(let i = 0; i < imagesCount; i++){
                contract.getImage(i, function(err,result) {
                    if(err)
                        return showError("Smart contract call failed: "+ err);
                    let ipfsHash = result[0];
                    let contractPublishDate = result[1];
                    let author = result[2];
                    let price = result[3];
                    let div = jQuery('<div>');
                    let url = "https://ipfs.io/ipfs/" + ipfsHash;

                    let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
                    div
                        .append(jQuery(`<p style="text-align:center;">Image published on: ${displayDate}</p>`))
                        .append(jQuery(`<p style="text-align:center;" id="author${i}">Author Address: <i>${author}</i></p>`))
                        .append(jQuery(`<center><img src="${url}" alt="Loading..." class="ipfsImage"/></center>`))
                        .append(jQuery(`<p id="price${i}" class="${ipfsHash}">Price: ${price} ETH</p>`))
                        .append(jQuery(`<input type="button" id="linkBuyImage" class="${i}" value="Buy!" style = "background-color: red; "/>`))
                    html.append(div);
                })
            }
            html.append('</div>');
            jQuery('#viewGetImages').append(html);
        }
        else {
            jQuery('#viewGetImages').append('<div> No images in the gallery. You can sell yours!</div>');
        }
    })
}

function registerUser(userName, password){
    var json ={
        'userName': userName,
        'password': sha256(password)
    }
    localStorage['User'] = JSON.stringify(json);
    showLoggedInButtons();
    showView("viewHome");
    jQuery('.btn').removeClass('active');
    jQuery('#linkHome').addClass('active');
}

function deleteUser() {
    localStorage.clear();
    jQuery('#userInfo').text('')
    showView('viewHome');
    jQuery('.btn').removeClass('active');
    jQuery('#linkHome').addClass('active');
}

function buyImage(i) {
    if(typeof Web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    web3js = new Web3(web3.currentProvider); 
    web3js.eth.getAccounts((err, accounts) => {
        if (!err && accounts.length > 0) {
            var account = accounts[0];
            var authorAddr = jQuery(`#author${i}`).text().split(" ")[2];
            var amount = Number(jQuery(`#price${i}`).text().split(" ")[1]);
            var hash = jQuery(`#price${i}`).attr('class');
            console.log(amount);
            console.log(hash);
            web3js.eth.sendTransaction({from:account, to:authorAddr, value: amount * ETH},function(err, transHash){
                if(err)
                    showError(err);
                let contract = web3js.eth.contract(Gallerion.gallerionContractABI).at(Gallerion.gallerionContractAddress);
                console.log(i);
                contract.buy(i, function (err, result) {
                if(err)
                    return showError("Smart contract call failed: "+ err);
                showInfo(`Transaction hash: ${transHash}`);
                window.open("https://ipfs.io/ipfs/" + hash);
                })
            });
        } 
        else {
            showError(err);
        }
    });
}

function donateToAuthor(authorAddr, amount) {
    if(typeof Web3 === 'undefined')
        return showError("Please install MetaMask to access the Ethereum Web3 API from your Web browser.");
    web3js = new Web3(web3.currentProvider); 
    web3js.eth.getAccounts((err, accounts) => {
        if (!err && accounts.length > 0) {
            var account = accounts[0];
            web3js.eth.sendTransaction({from:account, to:authorAddr, value: amount * ETH},function(err, transHash){
                if(err)
                    showError(err);
                else
                    showInfo(`Transaction hash: ${transHash}`);
            });
        } 
        else{
            showError(err);
        }
    });
}