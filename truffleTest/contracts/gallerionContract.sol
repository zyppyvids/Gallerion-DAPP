pragma solidity ^0.4.18;

contract gallerionContract {

    struct Image{
        string hash;
        uint256 dateAdded;
        address author;
        uint256 price;
    }

    address public owner;

    uint public imageCount;
    uint public boughtImages;

    Image[] private images;

    mapping(address => string[])
    public ownedImages;

    constructor () public {
        owner = msg.sender;
        imageCount = 0;
        boughtImages = 0;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function setOwnedImage() public onlyOwner{
        ownedImages[msg.sender].push("test");
        boughtImages++;
    }

    function sell(string _hash, uint _price) public returns(uint dateAdded) {
        dateAdded = block.timestamp;
        images.push(Image(_hash, dateAdded, msg.sender, _price));
        imageCount++;
    }

    function buy(uint index) public {
        if (index >= images.length) return;
        Image memory image = images[index];
        ownedImages[msg.sender].push(image.hash);
        for (uint i = index; i < images.length-1; i++){
            images[i] = images[i+1];
        }
        delete images[images.length-1];
        images.length--;
        imageCount--;
    }

    function getImagesCount() public view returns(uint length) {
        length = images.length;
    }

    function getImage(uint index) public view returns(string, uint, address, uint) {
        Image memory image = images[index];
        return (image.hash, image.dateAdded, image.author, image.price);
    }
}