pragma solidity ^0.4.18;

contract gallerionContract {

    struct Image{
        string hash;
        uint256 dateAdded;
        address author;
        uint256 price;
    }

    Image[] private images;

    mapping(address => uint) public balances;

    mapping(address => string[])
    public ownedImages;

    function sell(string _hash, uint _price) public returns(uint dateAdded) {
        dateAdded = block.timestamp;
        images.push(Image(_hash, dateAdded, msg.sender, _price));
    }

    function buy(uint index) public {
        Image memory image = images[index];
        ownedImages[msg.sender].push(image.hash);
        delete images[index];
    }

    function getImagesCount() public view returns(uint length) {
        length = images.length;
    }

    function getImage(uint index) public view returns(string, uint, address, uint) {
        Image memory image = images[index];
        return (image.hash, image.dateAdded, image.author, image.price);
    }
}