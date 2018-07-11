var Gallerion = {};

jQuery(document) .ready(function() {
    Gallerion.gallerionContractAddress = "0x02348b3094ee16873d0efe22a3341af04c5a326b";  //Change every time you start `ganache-cli`
    Gallerion.gallerionContractABI = [
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
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
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
	}
];

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
})
    
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
                contract.sell(ipfsHash, 1, function (err, txHash) {
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
                        .append(jQuery(`<p>Image published on: ${displayDate}</p>`))
                        .append(jQuery(`<p>Author Address: <i>${author}</i></p>`))
                        .append(jQuery(`<img src="${url}"/>`))
                        .append(jQuery(`<p>Price: ${price}/>`))
                        .append(jQuery(`<input type="button" id="linkBuyImage" value="Buy!" style = "color: red; "/>`))
                        .append(jQuery(`<input type="button" id="linkDonate" value="Donate!" style = "color: green; "/>`))
                    html.append(div);
                })
            }
            html.append('</div>');
            jQuery('#viewGetImages').append(html);
        }
        else {
            jQuery('#viewGetImages').append('<div> No images in the gallery. You can upload!</div>');
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