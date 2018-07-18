const Gallerion = artifacts.require("gallerionContract");

const ETH = 1000000000000000000;

contract("Gallerion", accounts => {
    const [firstAccount] = accounts;

    it("Test setting a contract owner", async () => {
        const gallerion = await Gallerion.new();
		assert.equal(await gallerion.owner.call(), firstAccount);
	});

    it("Tests setting an image to a person", async () => {
        const gallerion = await Gallerion.new();
        await gallerion.setOwnedImage({from:firstAccount});
        await gallerion.setOwnedImage({from:firstAccount});
        await gallerion.setOwnedImage({from:firstAccount});
        assert.equal(await gallerion.boughtImages.call(), 3);
    })

    it("Tests selling images", async () => {
        const gallerion = await Gallerion.new();
        await gallerion.sell("", 1 * ETH);
        await gallerion.sell("", 1 * ETH);
        assert.equal(await gallerion.imageCount.call(), 2);
    })

    it("Tests buying images", async () => {
        const gallerion = await Gallerion.new();
        await gallerion.sell("", 1 * ETH);
        await gallerion.sell("", 1 * ETH);
        await gallerion.sell("", 1 * ETH);
        await gallerion.sell("", 1 * ETH);
        await gallerion.buy(0);
        assert.equal(await gallerion.imageCount.call(), 3);
    })
})