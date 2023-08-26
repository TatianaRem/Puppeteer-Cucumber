const {
	Given,
	When,
	Then,
	After,
	Before
} = require("cucumber");
const puppeteer = require("puppeteer");
const expect = require("chai").expect;

const fillBookingForm = async (page, movieTimeSelector, movieDateSelector) => {
	//Выбор даты
	await page.click(movieDateSelector);
	await page.waitForTimeout(1000);

	//Выбор времени начала фильма
	await page.click(movieTimeSelector);

	//Ожидание загрузки страницы
	await page.waitForNavigation();
};

let browser;
let page;
let movieTimeSelector;
let movieDateSelector;

Before(async () => {
	browser = await puppeteer.launch();
	page = await browser.newPage();
	await page.goto("http://qamid.tmweb.ru/client/index.php");

	movieDateSelector = `[data-time-stamp="1693256400"]`;
	movieTimeSelector = `[data-seance-id="176"]`;
});

After(async () => {
	await browser.close();
});

Given("the user is on the booking page", async () => {});

When("the user selects the movie date and time", async () => {
	await fillBookingForm(page, movieTimeSelector, movieDateSelector);
});

When("the user chooses a seat", async () => {
	const seatSelector = "div:nth-child(6) span:nth-child(5)";
	await page.click(seatSelector);
});

Then("the user should see the active {string} button", async function(string) {
	const buttonSelector = "button";
	await page.waitForSelector(buttonSelector, {
		visible: true
	});
	await page.click(buttonSelector);
	const actual = await page.$eval(
		buttonSelector,
		(button) => button.textContent
	);
	expect(actual).to.contain(string);
});

When("the user chooses occupied seat", async () => {
	const seatSelector = "div :nth-child(2) span:nth-child(9)";
	await page.click(seatSelector);
});

Then(
	"the user should see the disabled {string} button",
	async function(string) {
		const greyButtonSelector = "button";

		await page.waitForSelector(greyButtonSelector);

		await page.waitForTimeout(1000);
		const isButtonDisabled = await page.$eval(
			greyButtonSelector,
			(button) => button.disabled
		);

		expect(isButtonDisabled).to.be.true;
		const actualButtonText = await page.$eval(
			greyButtonSelector,
			(button) => button.textContent
		);

		expect(actualButtonText).to.contain(string);
	}
);

Before(async () => {
	const movieDateSelector = `[data-time-stamp="1692997200"]`;
	const movieTimeSelector = `[data-seance-id="173"]`;
});

When("the user selects a different movie date and time", async () => {
	await fillBookingForm(page, movieTimeSelector, movieDateSelector);
});

When("the user selects a seat", async () => {
	const seatSelector = "div:nth-child(3) span:nth-child(1)";
	await page.click(seatSelector);
});

Then("the user should see the {string} button", async function(string) {
	const buttonSelector = "button";
	await page.waitForSelector(buttonSelector, {
		visible: true
	});
	await page.click(buttonSelector);
	const actual = await page.$eval(
		buttonSelector,
		(button) => button.textContent
	);
	expect(actual).to.contain(string);
});